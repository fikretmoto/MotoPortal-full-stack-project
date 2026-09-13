from django.db import models
from django_filters import rest_framework as filters

from .models import Category, Product


class ProductFilter(filters.FilterSet):
    category = filters.CharFilter(
        method="filter_category",
    )

    brand = filters.CharFilter(
        field_name="brand__slug",
        lookup_expr="iexact",
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

    class Meta:
        model = Product
        fields = (
            "category",
            "brand",
            "featured",
            "tag",
            "on_discount",
            "facets",
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