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

    class Meta:
        model = Product
        fields = (
            "category",
            "brand",
            "featured",
        )