from datetime import time

from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bookings.models import Booking

from .filters import VenueFilter
from .models import Venue
from .serializers import (
    AvailabilityQuerySerializer,
    VenueDetailSerializer,
    VenueListSerializer,
)


class VenueListView(generics.ListAPIView):
    """List all active venues with pagination, filtering, and search."""

    queryset = Venue.objects.filter(is_active=True).prefetch_related("images")
    serializer_class = VenueListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = VenueFilter
    search_fields = ["name", "name_ru", "name_uz", "name_en"]
    ordering_fields = ["price_per_hour", "created_at", "name"]


class VenueDetailView(generics.RetrieveAPIView):
    """Get single venue details."""

    queryset = Venue.objects.filter(is_active=True).prefetch_related("images")
    serializer_class = VenueDetailSerializer
    permission_classes = [permissions.AllowAny]


class VenueAvailabilityView(APIView):
    """Get available time slots for a venue on a specific date."""

    permission_classes = [permissions.AllowAny]

    OPENING_HOUR = 9   # 9 AM
    CLOSING_HOUR = 22  # 10 PM

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="date",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Date to check (YYYY-MM-DD)",
                required=True,
            )
        ],
        responses={200: dict},
    )
    def get(self, request, pk):
        # Validate venue exists
        try:
            venue = Venue.objects.get(pk=pk, is_active=True)
        except Venue.DoesNotExist:
            return Response(
                {"detail": "Venue not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AvailabilityQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data["date"]

        # Get existing bookings for this venue on this date
        bookings = Booking.objects.filter(
            venue=venue,
            booking_date=date,
            status__in=["pending", "confirmed"],
        ).values_list("start_time", "end_time")

        booked_slots = [(b[0], b[1]) for b in bookings]

        # Generate available 1-hour slots
        available_slots = []
        for hour in range(self.OPENING_HOUR, self.CLOSING_HOUR):
            slot_start = time(hour, 0)
            slot_end = time(hour + 1, 0)

            is_available = True
            for booked_start, booked_end in booked_slots:
                # Check overlap
                if slot_start < booked_end and slot_end > booked_start:
                    is_available = False
                    break

            available_slots.append(
                {
                    "start_time": slot_start.strftime("%H:%M"),
                    "end_time": slot_end.strftime("%H:%M"),
                    "is_available": is_available,
                }
            )

        return Response(
            {
                "venue_id": venue.pk,
                "venue_name": venue.name,
                "date": str(date),
                "price_per_hour": str(venue.price_per_hour),
                "slots": available_slots,
            }
        )
