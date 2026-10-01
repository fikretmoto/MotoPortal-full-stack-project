from django.urls import path

from .views import (
    ChangePasswordAPIView,
    LogoutAPIView,
    MeAPIView,
    ProfileUpdateAPIView,
    RegisterAPIView,
    ResendVerificationAPIView,
    VerifyEmailAPIView,
    PasswordResetConfirmAPIView,
PasswordResetRequestAPIView,
)

app_name = "accounts"


urlpatterns = [


    path(
    "password-reset/",
    PasswordResetRequestAPIView.as_view(),
    name="password-reset",
),

path(
    "password-reset-confirm/",
    PasswordResetConfirmAPIView.as_view(),
    name="password-reset-confirm",
),
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),
    path(
        "verify-email/",
        VerifyEmailAPIView.as_view(),
        name="verify-email",
    ),
    path(
        "resend-verification/",
        ResendVerificationAPIView.as_view(),
        name="resend-verification",
    ),
    path(
        "me/",
        MeAPIView.as_view(),
        name="me",
    ),
    path(
        "profile/",
        ProfileUpdateAPIView.as_view(),
        name="profile-update",
    ),
    path(
        "change-password/",
        ChangePasswordAPIView.as_view(),
        name="change-password",
    ),
    path(
        "logout/",
        LogoutAPIView.as_view(),
        name="logout",
    ),
]