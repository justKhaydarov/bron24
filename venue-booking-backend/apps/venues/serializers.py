from rest_framework import serializers

from .models import Venue, VenueImage


class VenueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueImage
        fields = ["id", "image", "is_primary"]


class VenueListSerializer(serializers.ModelSerializer):
    images = VenueImageSerializer(many=True, read_only=True)

    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "address",
            "description",
            "price_per_hour",
            "amenities",
            "images",
            "is_active",
            "created_at",
            "updated_at",
        ]


class VenueDetailSerializer(serializers.ModelSerializer):
    images = VenueImageSerializer(many=True, read_only=True)

    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "address",
            "description",
            "price_per_hour",
            "amenities",
            "images",
            "is_active",
            "created_at",
            "updated_at",
        ]


class AvailabilityQuerySerializer(serializers.Serializer):
    date = serializers.DateField(
        help_text="Date to check availability for (YYYY-MM-DD)"
    )
