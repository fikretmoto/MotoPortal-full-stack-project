from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class UserRole(models.TextChoices):
    SUPER_ADMIN = "super_admin", "Super Admin"
    ADMIN = "admin", "Admin"
    EDITOR = "editor", "Editör"
    DEALER = "dealer", "Bayi"
    CUSTOMER = "customer", "Müşteri"


class User(AbstractUser):
    username = None

    email = models.EmailField(
        unique=True,
        verbose_name="E-posta Adresi",
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Telefon",
    )

    avatar = models.ImageField(
        upload_to="users/avatars/",
        null=True,
        blank=True,
        verbose_name="Profil Görseli",
    )

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
        verbose_name="Kullanıcı Rolü",
    )

    email_verified = models.BooleanField(
        default=False,
        verbose_name="E-posta Doğrulandı mı?",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Oluşturulma Tarihi",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Güncellenme Tarihi",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()  # type: ignore[assignment]

    class Meta:
        verbose_name = "Kullanıcı"
        verbose_name_plural = "Kullanıcılar"
        ordering = ["-created_at"]

    def __str__(self):
        return self.email