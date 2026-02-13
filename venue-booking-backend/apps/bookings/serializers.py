from datetime import time

from rest_framework import serializers

from apps.venues.serializers import VenueListSerializer

from .models import Booking

OPENING_HOUR = 9
CLOSING_HOUR = 22


class BookingSerializer(serializers.ModelSerializer):
    venue_detail = VenueListSerializer(source="venue", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "venue",
            "venue_detail",
            "booking_date",
            "start_time",
            "end_time",
            "total_price",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "total_price", "status", "created_at", "updated_at"]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["venue", "booking_date", "start_time", "end_time"]

    def validate(self, attrs):
        start_time = attrs["start_time"]
        end_time = attrs["end_time"]
        venue = attrs["venue"]
        booking_date = attrs["booking_date"]

        # Ensure end_time > start_time
        if end_time <= start_time:
            raise serializers.ValidationError(
                {"end_time": "End time must be after start time."}
            )

        # Validate booking hours (9 AM – 10 PM)
        if start_time < time(OPENING_HOUR, 0):
            raise serializers.ValidationError(
                {"start_time": f"Bookings are only allowed from {OPENING_HOUR}:00."}
            )
        if end_time > time(CLOSING_HOUR, 0):
            raise serializers.ValidationError(
                {"end_time": f"Bookings are only allowed until {CLOSING_HOUR}:00."}
            )

        # Ensure venue is active
        if not venue.is_active:
            raise serializers.ValidationError(
                {"venue": "This venue is not available for booking."}
            )

        # Prevent double-booking: check for overlapping bookings
        overlapping = Booking.objects.filter(
            venue=venue,
            booking_date=booking_date,
            status__in=["pending", "confirmed"],
        ).filter(
            start_time__lt=end_time,
            end_time__gt=start_time,
        )

        if overlapping.exists():
            raise serializers.ValidationError(
                "This time slot is already booked. Please choose a different time."
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        booking = Booking(user=user, **validated_data)
        booking.total_price = booking.calculate_total_price()
        booking.save()
        return booking
