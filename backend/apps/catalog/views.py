from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .filters import ProductFilter
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Brand, Category, Product
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryListAPIView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return (
            Category.objects
            .filter(is_active=True)
            .select_related("parent")
            .order_by("name")
        )


class CategoryDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Category.objects
            .filter(is_active=True)
            .select_related("parent")
        )


class BrandListAPIView(generics.ListAPIView):
    serializer_class = BrandSerializer

    def get_queryset(self):
        return (
            Brand.objects
            .filter(is_active=True)
            .order_by("name")
        )


class BrandDetailAPIView(generics.RetrieveAPIView):
    serializer_class = BrandSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Brand.objects.filter(is_active=True)


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    filter_backends = (
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    )

    filterset_class = ProductFilter

    search_fields = (
        "name",
        "brand__name",
        "category__name",
        "short_description",
    )

    ordering_fields = (
        "name",
        "created_at",
        "updated_at",
        "brand__name",
        "category__name",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .select_related(
                "brand",
                "category",
                "category__parent",
            )
        )

class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .select_related(
                "brand",
                "category",
                "category__parent",
            )
            .prefetch_related(
                "images",
                "attribute_values__attribute",
                "attribute_values__attribute__group",
            )
        )