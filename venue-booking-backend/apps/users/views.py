from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .otp import send_otp, verify_otp
from .serializers import (
    SendOTPSerializer,
    UserSerializer,
    UserUpdateSerializer,
    VerifyOTPSerializer,
)


class SendOTPView(APIView):
    """Send OTP to the given phone number."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(request=SendOTPSerializer, responses={200: dict})
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data["phone_number"]

        result = send_otp(phone_number)

        if not result["success"]:
            return Response(
                {"detail": result["error"]},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        return Response(
            {"detail": "OTP sent successfully."},
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    """Verify OTP and return JWT tokens."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(request=VerifyOTPSerializer, responses={200: dict})
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone_number = serializer.validated_data["phone_number"]
        otp = serializer.validated_data["otp"]

        if not verify_otp(phone_number, otp):
            return Response(
                {"detail": "Invalid or expired OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get or create user
        user, created = User.objects.get_or_create(phone_number=phone_number)
        if not user.is_verified:
            user.is_verified = True
            user.save(update_fields=["is_verified"])

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "is_new_user": created,
            },
            status=status.HTTP_200_OK,
        )


class RefreshTokenView(APIView):
    """Refresh access token using a valid refresh token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(request={"type": "object", "properties": {"refresh": {"type": "string"}}}, responses={200: dict})
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            refresh = RefreshToken(refresh_token)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class UserMeView(generics.RetrieveUpdateAPIView):
    """Get or update the current user's profile."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UserUpdateSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user
