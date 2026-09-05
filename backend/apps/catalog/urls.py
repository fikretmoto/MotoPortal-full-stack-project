from django.urls import path

from .views import (
   BrandDetailAPIView,
    BrandListAPIView,
    CategoryAttributesAPIView,
    CategoryDetailAPIView,
    CategoryListAPIView,
    FavoriteListAPIView,
    FavoriteToggleAPIView,
    HomepageBandByTagAPIView,
    HomepageBandListAPIView,
    InstallmentOptionListAPIView,
    ProductCreateAPIView,
    ProductDetailAPIView,
    ProductListAPIView,
    ProductReviewListCreateAPIView,
    ProductUpdateAPIView,
    SiteContentAPIView,
)


app_name = "catalog"


urlpatterns = [

    path(
        "site-content/",
        SiteContentAPIView.as_view(),
        name="site-content",
    ),

    path(
        "installment-options/",
        InstallmentOptionListAPIView.as_view(),
        name="installment-option-list",
    ),



     path(
        "homepage-bands/",
        HomepageBandListAPIView.as_view(),
        name="homepage-band-list",
    ),

    path(
        "homepage-bands/<slug:tag_slug>/",
        HomepageBandByTagAPIView.as_view(),
        name="homepage-band-by-tag",
    ),


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

    path(
        "products/<slug:slug>/reviews/",
        ProductReviewListCreateAPIView.as_view(),
        name="product-review-list-create",
    ),

     path(
        "products/<slug:slug>/favorite/",
        FavoriteToggleAPIView.as_view(),
        name="product-favorite-toggle",
    ),

    path(
        "favorites/",
        FavoriteListAPIView.as_view(),
        name="favorite-list",
    ),
]