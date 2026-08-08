from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),

        
   

    path(
    "api/token/",
    TokenObtainPairView.as_view(),
    name="token_obtain_pair",
    ),

path(
    "api/token/refresh/",
    TokenRefreshView.as_view(),
    name="token_refresh",
    ),

    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="api-schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="api-schema",
        ),
        name="swagger-ui",
    ),

    path(
        "api/redoc/",
        SpectacularRedocView.as_view(
            url_name="api-schema",
        ),
        name="redoc",
    ),

     path(
        "api/",
        include("apps.catalog.urls"),

    ),

    path(
        "api/auth/",
        include("apps.accounts.urls"),
    ),

    path(
        "api-auth/",
        include("rest_framework.urls"),
    ),

   
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )