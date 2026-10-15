from django.db import models
from django.db.models import Case, IntegerField, Value, When
from django.db.models.functions import Coalesce
from django_filters import rest_framework as filters

from .models import Category, Product
from .utils.text import normalize_match_value


class ProductFilter(filters.FilterSet):
    category = filters.CharFilter(
        method="filter_category",
    )

    brand = filters.CharFilter(
        method="filter_brand",
    )

    featured = filters.BooleanFilter(
        field_name="is_featured",
    )

    tag = filters.CharFilter(
        field_name="tags__slug",
        lookup_expr="iexact",
    )

    on_discount = filters.BooleanFilter(
        method="filter_on_discount",
    )

    facets = filters.CharFilter(
        method="filter_facets",
    )

    price_min = filters.NumberFilter(
        method="filter_price_min",
    )

    price_max = filters.NumberFilter(
        method="filter_price_max",
    )

    q = filters.CharFilter(
        method="filter_q",
    )

    class Meta:
        model = Product
        fields = (
            "category",
            "brand",
            "featured",
            "tag",
            "on_discount",
            "facets",
            "price_min",
            "price_max",
            "q",
        )

    def filter_brand(self, queryset, name, value):
        slugs = [s.strip() for s in value.split(",") if s.strip()]

        if not slugs:
            return queryset

        return queryset.filter(brand__slug__in=slugs)

    def with_effective_price(self, queryset):
        if "effective_price" in queryset.query.annotations:
            return queryset

        return queryset.annotate(
            effective_price=Coalesce("discount_price", "price"),
        )

    def filter_price_min(self, queryset, name, value):
        return self.with_effective_price(queryset).filter(
            effective_price__gte=value,
        )

    def filter_price_max(self, queryset, name, value):
        return self.with_effective_price(queryset).filter(
            effective_price__lte=value,
        )

    def filter_on_discount(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            discount_price__isnull=False,
            discount_price__lt=models.F("price"),
        )

    def filter_facets(self, queryset, name, value):
        groups = [g.strip() for g in value.split(",") if g.strip()]

        for group in groups:
            if ":" not in group:
                continue

            attribute_slug, values_part = group.split(":", 1)
            values = [v.strip() for v in values_part.split("|") if v.strip()]

            if not values:
                continue

            queryset = queryset.filter(
                attribute_values__attribute__slug=attribute_slug,
                attribute_values__value__in=values,
            )

        return queryset.distinct()

    def filter_category(self, queryset, name, value):
        slugs = [s.strip() for s in value.split(",") if s.strip()]

        all_category_ids = []

        for slug in slugs:
            try:
                category = Category.objects.get(slug=slug)
            except Category.DoesNotExist:
                continue

            all_category_ids.extend(
                self.get_descendant_category_ids(category)
            )

        if not all_category_ids:
            return queryset.none()

        return queryset.filter(category_id__in=all_category_ids)

    def get_descendant_category_ids(self, category):
        ids = [category.id]

        for child in Category.objects.filter(parent=category):
            ids.extend(self.get_descendant_category_ids(child))

        return ids

    def filter_q(self, queryset, name, value):
        # Sayfalama ile birlikte calismali: eslesen urun id'lerini
        # Python'da (normalize_match_value ile, Postgres'in "C"
        # collation'inda ILIKE'in Turkce buyuk/kucuk harf donusumunu
        # yapamamasi yuzunden) bulup queryset'i id__in ile daraltiyoruz,
        # boylece DRF'in pagination'i (count/slice) bu daraltilmis
        # queryset uzerinde normal calismaya devam ediyor.
        words = [
            normalize_match_value(word)
            for word in value.split()
            if word.strip()
        ]

        if not words:
            return queryset

        # local import -- serializers.py -> filters.py yonunde bir
        # bagimlilik yok, ama ust seviyede import etmek yerine burada
        # tutmak modul yukleme sirasina bagli dongusel import riskini
        # tamamen ortadan kaldiriyor.
        from .serializers import get_display_name

        # mpn_prefetch, cagiran view'in get_queryset()'inde zaten
        # (Prefetch(..., to_attr="mpn_prefetch") ile) ekleniyor -- ayni
        # to_attr'i burada tekrar prefetch_related'e eklemek Django'nun
        # "lookup was already seen with a different queryset" hatasini
        # tetikler. Burada sadece select_related tekrarlaniyor (idempotent,
        # sorun degil); mpn_prefetch yoksa asagida guvenli sekilde
        # (N+1 pahasina) tek tek sorgulanir.
        candidates = queryset.select_related(
            "brand",
            "category",
            "vehicle_model",
        )

        ranks = {}

        for product in candidates:
            mpn_values = getattr(product, "mpn_prefetch", [])
            mpn_value = mpn_values[0].value if mpn_values else ""

            name_blob = normalize_match_value(" ".join(filter(None, [
                product.name,
                get_display_name(product),
            ])))
            brand_category_blob = normalize_match_value(" ".join(filter(None, [
                product.brand.name,
                product.category.name,
            ])))
            code_blob = normalize_match_value(" ".join(filter(None, [
                product.product_code or "",
                mpn_value,
            ])))

            combined_blob = name_blob + brand_category_blob + code_blob

            if not all(word in combined_blob for word in words):
                continue

            if all(word in name_blob for word in words):
                rank = 0
            elif all(word in (name_blob + brand_category_blob) for word in words):
                rank = 1
            else:
                rank = 2

            ranks[product.id] = rank

        if not ranks:
            return queryset.none()

        ranking = Case(
            *[
                When(id=product_id, then=Value(rank))
                for product_id, rank in ranks.items()
            ],
            default=Value(3),
            output_field=IntegerField(),
        )

        return (
            queryset
            .filter(id__in=ranks.keys())
            .annotate(search_rank=ranking)
        )