from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking
from .serializers import BookingCreateSerializer, BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    """List current user's bookings or create a new booking."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .select_related("venue")
            .prefetch_related("venue__images")
        )


class BookingDetailView(generics.RetrieveAPIView):
    """Get booking details. Users can only view their own bookings."""

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .select_related("venue")
            .prefetch_related("venue__images")
        )


class BookingCancelView(APIView):
    """Cancel a booking. Only pending/confirmed bookings can be cancelled."""

    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: BookingSerializer})
    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status not in ("pending", "confirmed"):
            return Response(
                {"detail": "Only pending or confirmed bookings can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = Booking.Status.CANCELLED
        booking.save(update_fields=["status", "updated_at"])

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
