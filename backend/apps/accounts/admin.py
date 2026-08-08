from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("-created_at",)

    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
        "email_verified",
        "created_at",
    )

    list_filter = (
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
        "email_verified",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
        "phone",
    )

    readonly_fields = (
        "last_login",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Giriş Bilgileri",
            {
                "fields": (
                    "email",
                    "password",
                ),
            },
        ),
        (
            "Kişisel Bilgiler",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone",
                    "avatar",
                ),
            },
        ),
        (
            "Rol ve Durum",
            {
                "fields": (
                    "role",
                    "email_verified",
                    "is_active",
                ),
            },
        ),
        (
            "Yetkilendirme",
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
        (
            "Sistem Bilgileri",
            {
                "fields": (
                    "last_login",
                    "created_at",
                    "updated_at",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    add_fieldsets = (
        (
            "Yeni Kullanıcı",
            {
                "classes": (
                    "wide",
                ),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "role",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )