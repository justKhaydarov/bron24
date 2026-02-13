import re

from rest_framework import serializers

from .models import User


class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=13)

    def validate_phone_number(self, value):
        if not re.match(r"^\+998\d{9}$", value):
            raise serializers.ValidationError(
                "Invalid phone number. Use format: +998XXXXXXXXX"
            )
        return value


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=13)
    otp = serializers.CharField(max_length=6, min_length=6)

    def validate_phone_number(self, value):
        if not re.match(r"^\+998\d{9}$", value):
            raise serializers.ValidationError(
                "Invalid phone number. Use format: +998XXXXXXXXX"
            )
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "phone_number", "name", "is_active", "is_verified", "created_at"]
        read_only_fields = ["id", "phone_number", "is_active", "is_verified", "created_at"]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name"]
