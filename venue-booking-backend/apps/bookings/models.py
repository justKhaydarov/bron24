from django.conf import settings
from django.db import models

from apps.venues.models import Venue


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking #{self.pk} – {self.venue.name} on {self.booking_date}"

    def calculate_total_price(self):
        """Calculate total price based on duration and venue hourly rate."""
        from datetime import datetime
        from decimal import Decimal

        start_dt = datetime.combine(self.booking_date, self.start_time)
        end_dt = datetime.combine(self.booking_date, self.end_time)
        duration_hours = Decimal(str((end_dt - start_dt).total_seconds() / 3600))
        return round(self.venue.price_per_hour * duration_hours, 2)

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.calculate_total_price()
        super().save(*args, **kwargs)
