from django.db.models import Prefetch
from rest_framework import generics, permissions
from .permissions import CanManageProducts, IsCustomerRole
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny

from .filters import ProductFilter

from .models import AttributeOption, Brand, Category, CategoryAttribute, Product, ProductReview
from .serializers import (
   BrandSerializer,
    CategoryAttributesResponseSerializer,
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductWriteSerializer,
    ProductReviewSerializer,
)

class CategoryListAPIView(generics.ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

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

class ProductCreateAPIView(generics.CreateAPIView):
    serializer_class = ProductWriteSerializer
    queryset = Product.objects.all()
    permission_classes = (
         CanManageProducts,
    )


class ProductUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProductWriteSerializer
    lookup_field = "slug"
    queryset = Product.objects.all()
    permission_classes = (
         CanManageProducts,
    )

class CategoryAttributesAPIView(generics.GenericAPIView):
    serializer_class = CategoryAttributesResponseSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Category.objects
            .filter(is_active=True)
        )

    def get(self, request, *args, **kwargs):
        category = self.get_object()

        category_attributes = (
            CategoryAttribute.objects
            .filter(
                category=category,
            )
            .select_related(
                "attribute",
                "attribute__group",
            )
            .prefetch_related(
                Prefetch(
                    "attribute__options",
                    queryset=(
                        AttributeOption.objects
                        .filter(is_active=True)
                        .order_by("display_order", "value")
                    ),
                )
            )
            .order_by(
                "attribute__group__display_order",
                "display_order",
                "attribute__display_order",
            )
        )

        attribute_groups = self.group_by_attribute_group(
            category_attributes
        )

        response_data = {
            "category": category,
            "attribute_groups": attribute_groups,
        }

        serializer = self.get_serializer(response_data)
        return Response(serializer.data)

    def group_by_attribute_group(self, category_attributes):
        groups_by_id = {}
        ordered_group_ids = []

        for category_attribute in category_attributes:
            group = category_attribute.attribute.group

            if group.id not in groups_by_id:
                groups_by_id[group.id] = {
                    "name": group.name,
                    "slug": group.slug,
                    "display_order": group.display_order,
                    "attributes": [],
                }
                ordered_group_ids.append(group.id)

            groups_by_id[group.id]["attributes"].append(
                category_attribute
            )

        return [
            groups_by_id[group_id]
            for group_id in ordered_group_ids
        ]

class ProductReviewListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: bir ürünün ONAYLI yorumlarını listeler (herkese açık).
    POST: yeni yorum oluşturur (sadece customer rolü, giriş şart).
    """
    serializer_class = ProductReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return (IsCustomerRole(),)
        return (AllowAny(),)

    def get_queryset(self):
        return (
            ProductReview.objects
            .filter(
                product__slug=self.kwargs["slug"],
                is_approved=True,
            )
            .select_related("user")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        product = generics.get_object_or_404(
            Product,
            slug=self.kwargs["slug"],
        )
        serializer.save(
            user=self.request.user,
            product=product,
        )