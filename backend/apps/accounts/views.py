from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    ChangePasswordSerializer,
    LogoutSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ResendVerificationSerializer,
    UserSerializer,
    VerifyEmailSerializer,
    PasswordResetConfirmSerializer,
PasswordResetRequestSerializer,
)
from .throttling import (
    ResendVerificationHourThrottle,
    ResendVerificationMinuteThrottle,
    VerifyEmailThrottle,
)


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (
        permissions.AllowAny,
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "detail": (
                    "Kaydınız alındı. E-posta adresinize gönderilen "
                    "doğrulama kodunu girerek hesabınızı aktifleştirin."
                ),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailAPIView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )
    throttle_classes = (
        VerifyEmailThrottle,
    )

    def post(self, request):
        serializer = VerifyEmailSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class ResendVerificationAPIView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )
    throttle_classes = (
        ResendVerificationMinuteThrottle,
        ResendVerificationHourThrottle,
    )

    def post(self, request):
        serializer = ResendVerificationSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            {
                "detail": (
                    "Hesap kayıtlıysa ve henüz doğrulanmadıysa yeni "
                    "bir doğrulama kodu gönderildi."
                )
            },
            status=status.HTTP_200_OK,
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