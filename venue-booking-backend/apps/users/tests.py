from unittest.mock import patch

from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User


@override_settings(
    CACHES={
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }
)
class AuthTests(TestCase):
    """Tests for OTP authentication flow."""

    def setUp(self):
        self.client = APIClient()
        self.phone_number = "+998901234567"

    def test_send_otp_success(self):
        response = self.client.post(
            "/api/auth/send-otp/",
            {"phone_number": self.phone_number},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

    def test_send_otp_invalid_phone(self):
        response = self.client.post(
            "/api/auth/send-otp/",
            {"phone_number": "12345"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("apps.users.otp.cache")
    def test_verify_otp_success(self, mock_cache):
        mock_cache.get.return_value = "123456"

        response = self.client.post(
            "/api/auth/verify-otp/",
            {"phone_number": self.phone_number, "otp": "123456"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertTrue(response.data["is_new_user"])

    @patch("apps.users.otp.cache")
    def test_verify_otp_invalid(self, mock_cache):
        mock_cache.get.return_value = "654321"

        response = self.client.post(
            "/api/auth/verify-otp/",
            {"phone_number": self.phone_number, "otp": "000000"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_me_unauthenticated(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_me_authenticated(self):
        user = User.objects.create_user(phone_number=self.phone_number)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone_number"], self.phone_number)

    def test_user_me_update(self):
        user = User.objects.create_user(phone_number=self.phone_number)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )
        response = self.client.patch(
            "/api/auth/me/",
            {"name": "Test User"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.name, "Test User")

    def test_refresh_token(self):
        user = User.objects.create_user(phone_number=self.phone_number)
        refresh = RefreshToken.for_user(user)
        response = self.client.post(
            "/api/auth/refresh/",
            {"refresh": str(refresh)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
