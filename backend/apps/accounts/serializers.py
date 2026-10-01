
import random

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_decode,
    urlsafe_base64_encode,
)
from datetime import timedelta

from typing import Any, cast
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


EMAIL_VERIFICATION_CODE_LIFETIME_MINUTES = 15


def generate_and_send_verification_code(user) -> None:
    code = str(random.randint(100000, 999999))

    user.email_verification_code = code
    user.email_verification_code_expires_at = (
        timezone.now()
        + timedelta(minutes=EMAIL_VERIFICATION_CODE_LIFETIME_MINUTES)
    )
    user.save(
        update_fields=(
            "email_verification_code",
            "email_verification_code_expires_at",
        )
    )

    send_mail(
        subject="MotoPortal e-posta doğrulama kodunuz",
        message=(
            f"MotoPortal doğrulama kodunuz: {code}\n\n"
            f"Bu kod {EMAIL_VERIFICATION_CODE_LIFETIME_MINUTES} dakika "
            "geçerlidir."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "avatar",
            "role",
            "email_verified",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "role",
            "email_verified",
            "is_active",
            "created_at",
            "updated_at",
        )

    def get_full_name(self, obj) -> str:
        return obj.get_full_name().strip()


class RegisterSerializer(serializers.ModelSerializer):
    # ModelSerializer'ın email için otomatik ürettiği UniqueValidator
    # (İngilizce/karma "Kullanıcı with this E-posta Adresi already
    # exists." mesajını üretiyordu) devre dışı bırakıldı —
    # benzersizlik kontrolü sadece aşağıdaki validate_email()'de,
    # özel Türkçe mesajla yapılsın diye.
    email = serializers.EmailField(validators=[])

    password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    password_confirm = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    class Meta:
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
            "phone",
            "password",
            "password_confirm",
        )

    def validate_email(self, value: str) -> str:
        normalized_email = value.strip().lower()

        if User.objects.filter(
            email__iexact=normalized_email,
        ).exists():
            raise serializers.ValidationError(
                "Bu e-posta adresi zaten kullanılıyor."
            )

        return normalized_email

    def validate(self, attrs):
        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        if password != password_confirm:
            raise serializers.ValidationError(
                {
                    "password_confirm": (
                        "Şifreler birbiriyle eşleşmiyor."
                    )
                }
            )

        temporary_user = User(
            email=attrs.get("email", ""),
            first_name=attrs.get("first_name", ""),
            last_name=attrs.get("last_name", ""),
        )

        validate_password(
            password=password,
            user=temporary_user,
        )

        return attrs

    def create(self, validated_data):
        data = cast(
            dict[str, Any],
            validated_data,
        )

        data.pop(
            "password_confirm",
            None,
        )

        password = data.pop("password")

        user = User.objects.create_user(
            password=password,
            is_active=False,
            **data,
        )

        generate_and_send_verification_code(user)

        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        code = attrs["code"].strip()

        user = User.objects.filter(email__iexact=email).first()

        if user is None:
            raise serializers.ValidationError(
                {"email": "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı."}
            )

        if user.email_verified:
            raise serializers.ValidationError(
                {"email": "Bu hesap zaten doğrulanmış."}
            )

        if (
            not user.email_verification_code
            or user.email_verification_code != code
        ):
            raise serializers.ValidationError(
                {"code": "Doğrulama kodu hatalı."}
            )

        if (
            not user.email_verification_code_expires_at
            or user.email_verification_code_expires_at < timezone.now()
        ):
            raise serializers.ValidationError(
                {"code": "Doğrulama kodunun süresi dolmuş. Yeni bir kod isteyin."}
            )

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]  # type: ignore

        user.is_active = True
        user.email_verified = True
        user.email_verification_code = None
        user.email_verification_code_expires_at = None
        user.save(
            update_fields=(
                "is_active",
                "email_verified",
                "email_verification_code",
                "email_verification_code_expires_at",
            )
        )

        return user


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def save(self, **kwargs):
        email = self.validated_data["email"]  # type: ignore

        user = User.objects.filter(
            email__iexact=email,
            email_verified=False,
        ).first()

        # Kullanıcı yoksa ya da zaten doğrulanmışsa sessizce hiçbir şey
        # yapmıyoruz (password-reset akışındaki gibi) -- böylece bu
        # endpoint hangi e-postaların kayıtlı olduğunu açığa çıkarmaz.
        if user is None:
            return None

        generate_and_send_verification_code(user)

        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "phone",
            "avatar",
        )

    def validate_phone(self, value: str) -> str:
        return value.strip()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    new_password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    new_password_confirm = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    def validate_old_password(self, value: str) -> str:
        request = self.context.get("request")

        if request is None:
            raise serializers.ValidationError(
                "Kullanıcı bilgisi alınamadı."
            )

        user = request.user

        if not user.check_password(value):
            raise serializers.ValidationError(
                "Mevcut şifreniz hatalı."
            )

        return value

    def validate(self, attrs):
        request = self.context.get("request")

        if request is None:
            raise serializers.ValidationError(
                "Kullanıcı bilgisi alınamadı."
            )

        new_password = attrs.get("new_password")
        new_password_confirm = attrs.get(
            "new_password_confirm"
        )

        if new_password != new_password_confirm:
            raise serializers.ValidationError(
                {
                    "new_password_confirm": (
                        "Yeni şifreler birbiriyle eşleşmiyor."
                    )
                }
            )

        validate_password(
            password=new_password,
            user=request.user,
        )

        return attrs

    def save(self, **kwargs):
        request = self.context.get("request")

        if request is None:
            raise serializers.ValidationError(
                "Kullanıcı bilgisi alınamadı."
            )

        validated_data = cast(
            dict[str, Any],
            self.validated_data,
        )

        new_password = validated_data.get(
            "new_password"
        )

        if not new_password:
            raise serializers.ValidationError(
                {
                    "new_password": (
                        "Yeni şifre alanı zorunludur."
                    )
                }
            )

        user = request.user
        user.set_password(new_password)

        user.save(
            update_fields=(
                "password",
                "updated_at",
            )
        )

        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(
        write_only=True,
    )

    def save(self, **kwargs) -> None:
        validated_data = cast(
            dict[str, Any],
            self.validated_data,
        )

        refresh_token = validated_data.get(
            "refresh"
        )

        if not refresh_token:
            raise serializers.ValidationError(
                {
                    "refresh": (
                        "Refresh token zorunludur."
                    )
                }
            )

        try:
            token = RefreshToken(
    cast(Any, refresh_token)
)
            token.blacklist()

        except TokenError as exc:
            raise serializers.ValidationError(
                {
                    "refresh": (
                        "Refresh token geçersiz "
                        "veya süresi dolmuş."
                    )
                }
            ) from exc


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def save(self, **kwargs):
        email = self.validated_data.get("email")

        user = User.objects.filter(
            email__iexact=email,
            is_active=True,
        ).first()

        # Kullanıcı bulunmasa bile aynı cevabı döndüreceğiz.
        # Böylece sistemde hangi e-postaların kayıtlı olduğu anlaşılmaz.
        if user is None:
            return None

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(
            user
        )

        # Link doğrudan backend API'sine değil, kullanıcının şifreyi
        # gireceği FRONTEND sayfasına gitmeli -- password-reset-confirm
        # view'ı sadece POST kabul ediyor, bir tarayıcıda tıklanabilir
        # değil (405 döner). /sifre-sifirla sayfası bu değerleri
        # okuyup API'ye POST atıyor.
        reset_url = (
            f"{settings.FRONTEND_URL}/sifre-sifirla"
            f"?uid={uid}&token={token}"
        )

        user.email_user(
            subject="MotoPortal şifre sıfırlama",
            message=(
                "Şifrenizi sıfırlamak için aşağıdaki "
                "bağlantıyı kullanın:\n\n"
                f"{reset_url}\n\n"
                "Bu bağlantı sınırlı bir süre geçerlidir."
            ),
        )

        return user


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    new_password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    new_password_confirm = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")
        new_password = attrs.get("new_password")
        new_password_confirm = attrs.get(
            "new_password_confirm"
        )

        if new_password != new_password_confirm:
            raise serializers.ValidationError(
                {
                    "new_password_confirm": (
                        "Yeni şifreler eşleşmiyor."
                    )
                }
            )

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ) as exc:
            raise serializers.ValidationError(
                {
                    "uid": (
                        "Şifre sıfırlama bağlantısı "
                        "geçersizdir."
                    )
                }
            ) from exc

        if not default_token_generator.check_token(
            user,
            token,
        ):
            raise serializers.ValidationError(
                {
                    "token": (
                        "Şifre sıfırlama bağlantısı "
                        "geçersiz veya süresi dolmuş."
                    )
                }
            )

        validate_password(
            password=new_password,
            user=user,
        )

        attrs["user"] = user

        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"] # type: ignore
        new_password = self.validated_data[ # type: ignore
            "new_password"
        ]

        user.set_password(new_password)
        user.save(
            update_fields=(
                "password",
                "updated_at",
            )
        )

        return user