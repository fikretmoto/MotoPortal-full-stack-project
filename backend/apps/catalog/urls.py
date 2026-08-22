from django.urls import path

from .views import (
   BrandDetailAPIView,
    BrandListAPIView,
    CategoryAttributesAPIView,
    CategoryDetailAPIView,
    CategoryListAPIView,
    ProductCreateAPIView,
    ProductDetailAPIView,
    ProductListAPIView,
    ProductUpdateAPIView,
)


app_name = "catalog"


urlpatterns = [
    path(
        "categories/",
        CategoryListAPIView.as_view(),
        name="category-list",
    ),
    path(
        "categories/<slug:slug>/",
        CategoryDetailAPIView.as_view(),
        name="category-detail",
    ),

    path(
        "categories/<slug:slug>/attributes/",
        CategoryAttributesAPIView.as_view(),
        name="category-attributes",
    ),

    path(
        "brands/",
        BrandListAPIView.as_view(),
        name="brand-list",
    ),
    path(
        "brands/<slug:slug>/",
        BrandDetailAPIView.as_view(),
        name="brand-detail",
    ),

    path(
        "products/",
        ProductListAPIView.as_view(),
        name="product-list",
    ),


    path(
        "products/create/",
        ProductCreateAPIView.as_view(),
        name="product-create",
    ),

    path(
        "products/<slug:slug>/",
        ProductDetailAPIView.as_view(),
        name="product-detail",
    ),

    path(
        "products/<slug:slug>/edit/",
        ProductUpdateAPIView.as_view(),
        name="product-update",
    ),
]