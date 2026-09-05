from django.db import models
from django_filters import rest_framework as filters

from .models import Product


class ProductFilter(filters.FilterSet):
    category = filters.CharFilter(
        field_name="category__slug",
        lookup_expr="iexact",
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
       