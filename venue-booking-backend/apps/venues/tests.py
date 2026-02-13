from decimal import Decimal

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User
from apps.venues.models import Venue


class VenueTests(TestCase):
    """Tests for venue endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.venue = Venue.objects.create(
            name_ru="Тестовый зал",
            name_uz="Test zal",
            name_en="Test Hall",
            address_ru="г. Ташкент, ул. Тест 1",
            address_uz="Toshkent sh., Test ko'chasi 1",
            address_en="1 Test Street, Tashkent",
            description_ru="Описание",
            description_uz="Tavsif",
            description_en="Description",
            price_per_hour=Decimal("100000.00"),
            amenities_ru=["Wi-Fi"],
            amenities_uz=["Wi-Fi"],
            amenities_en=["Wi-Fi"],
            is_active=True,
        )

    def test_list_venues(self):
        response = self.client.get("/api/venues/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_venue_detail(self):
        response = self.client.get(f"/api/venues/{self.venue.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.venue.pk)

    def test_venue_filter_by_price(self):
        response = self.client.get("/api/venues/", {"min_price": 50000, "max_price": 200000})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_venue_filter_by_price_no_results(self):
        response = self.client.get("/api/venues/", {"min_price": 999999})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    def test_venue_search(self):
        response = self.client.get("/api/venues/", {"search": "Test"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_venue_availability(self):
        response = self.client.get(
            f"/api/venues/{self.venue.pk}/availability/",
            {"date": "2026-03-15"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["slots"]), 13)  # 9AM-10PM = 13 slots
        self.assertTrue(all(s["is_available"] for s in response.data["slots"]))

    def test_venue_availability_missing_date(self):
        response = self.client.get(f"/api/venues/{self.venue.pk}/availability/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_venue_not_found(self):
        response = self.client.get("/api/venues/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_i18n_accept_language(self):
        response = self.client.get(
            f"/api/venues/{self.venue.pk}/",
            HTTP_ACCEPT_LANGUAGE="en",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # name field should return the English value
        self.assertEqual(response.data["name"], "Test Hall")
