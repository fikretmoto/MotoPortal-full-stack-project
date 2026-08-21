from django.urls import path

from .views import (
    BrandDetailAPIView,
    BrandListAPIView,
    CategoryAttributesAPIView,
    CategoryDetailAPIView,
    CategoryListAPIView,
    ProductDetailAPIView,
    ProductListAPIView,
    
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
        "products/<slug:slug>/",
        ProductDetailAPIView.as_view(),
        name="product-detail",
    ),
]