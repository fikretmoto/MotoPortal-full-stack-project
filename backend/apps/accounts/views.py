from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ChangePasswordSerializer,
    LogoutSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
    PasswordResetConfirmSerializer,
PasswordResetRequestSerializer,
)


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (
        permissions.AllowAny,
    )


class MeAPIView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_object(self):
        return self.request.user


class ProfileUpdateAPIView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = (
        permissions.IsAuthenticated,
    )

    http_method_names = (
        "patch",
        "options",
    ) # type: ignore

    def get_object(self):
        return self.request.user


class ChangePasswordAPIView(APIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            {
                "detail": (
                    "Şifreniz başarıyla değiştirildi."
                )
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def post(self, request):
        serializer = LogoutSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            {
                "detail": (
                    "Başarıyla çıkış yapıldı."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetRequestAPIView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            {
                "detail": (
                    "E-posta kayıtlıysa şifre sıfırlama "
                    "bağlantısı gönderildi."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmAPIView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            {
                "detail": (
                    "Şifreniz başarıyla sıfırlandı."
                )
            },
            status=status.HTTP_200_OK,
        )