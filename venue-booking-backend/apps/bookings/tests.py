from datetime import date, time
from decimal import Decimal

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.bookings.models import Booking
from apps.users.models import User
from apps.venues.models import Venue


class BookingTests(TestCase):
    """Tests for booking endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(phone_number="+998901234567")
        self.other_user = User.objects.create_user(phone_number="+998901234568")

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

        self.venue = Venue.objects.create(
            name_ru="Зал",
            name_uz="Zal",
            name_en="Hall",
            address_ru="Адрес",
            address_uz="Manzil",
            address_en="Address",
            price_per_hour=Decimal("100000.00"),
            is_active=True,
        )

    def test_create_booking(self):
        response = self.client.post(
            "/api/bookings/",
            {
                "venue": self.venue.pk,
                "booking_date": "2026-03-15",
                "start_time": "10:00",
                "end_time": "12:00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["total_price"], "200000.00")
        self.assertEqual(response.data["status"], "pending")

    def test_double_booking_prevented(self):
        # First booking
        self.client.post(
            "/api/bookings/",
            {
                "venue": self.venue.pk,
                "booking_date": "2026-03-15",
                "start_time": "10:00",
                "end_time": "12:00",
            },
            format="json",
        )
        # Overlapping booking
        response = self.client.post(
            "/api/bookings/",
            {
                "venue": self.venue.pk,
                "booking_date": "2026-03-15",
                "start_time": "11:00",
                "end_time": "13:00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_outside_hours(self):
        response = self.client.post(
            "/api/bookings/",
            {
                "venue": self.venue.pk,
                "booking_date": "2026-03-15",
                "start_time": "07:00",
                "end_time": "09:00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_end_before_start(self):
        response = self.client.post(
            "/api/bookings/",
            {
                "venue": self.venue.pk,
                "booking_date": "2026-03-15",
                "start_time": "14:00",
                "end_time": "12:00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_own_bookings(self):
        Booking.objects.create(
            user=self.user,
            venue=self.venue,
            booking_date=date(2026, 3, 15),
            start_time=time(10, 0),
            end_time=time(12, 0),
            total_price=Decimal("200000.00"),
        )
        Booking.objects.create(
            user=self.other_user,
            venue=self.venue,
            booking_date=date(2026, 3, 16),
            start_time=time(10, 0),
            end_time=time(12, 0),
            total_price=Decimal("200000.00"),
        )

        response = self.client.get("/api/bookings/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see own bookings
        self.assertEqual(response.data["count"], 1)

    def test_cancel_booking(self):
        booking = Booking.objects.create(
            user=self.user,
            venue=self.venue,
            booking_date=date(2026, 3, 15),
            start_time=time(10, 0),
            end_time=time(12, 0),
            total_price=Decimal("200000.00"),
            status="pending",
        )
        response = self.client.patch(f"/api/bookings/{booking.pk}/cancel/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "cancelled")

    def test_cancel_completed_booking_fails(self):
        booking = Booking.objects.create(
            user=self.user,
            venue=self.venue,
            booking_date=date(2026, 3, 15),
            start_time=time(10, 0),
            end_time=time(12, 0),
            total_price=Decimal("200000.00"),
            status="completed",
        )
        response = self.client.patch(f"/api/bookings/{booking.pk}/cancel/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancel_other_users_booking_fails(self):
        booking = Booking.objects.create(
            user=self.other_user,
            venue=self.venue,
            booking_date=date(2026, 3, 15),
            start_time=time(10, 0),
            end_time=time(12, 0),
            total_price=Decimal("200000.00"),
            status="pending",
        )
        response = self.client.patch(f"/api/bookings/{booking.pk}/cancel/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_booking(self):
        self.client.credentials()  # Remove auth
        response = self.client.post(
            "/api/bookings/",
            {
                "venue": self.venue.pk,
                "booking_date": "2026-03-15",
                "start_time": "10:00",
                "end_time": "12:00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
