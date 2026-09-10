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

    class Meta:
        model = Product
        fields = (
            "category",
            "brand",
            "featured",
            "tag",
            "on_discount",
        )

    def filter_on_discount(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            discount_price__isnull=False,
            discount_price__lt=models.F("price"),
        )

    def filter_category(self, queryset, name, value):
        try:
            category = Category.objects.get(slug=value)
        except Category.DoesNotExist:
            return queryset.none()

        category_ids = self.get_descendant_category_ids(category)

        return queryset.filter(category_id__in=category_ids)

    def get_descendant_category_ids(self, category):
        ids = [category.id]

        for child in Category.objects.filter(parent=category):
            ids.extend(self.get_descendant_category_ids(child))

        return ids