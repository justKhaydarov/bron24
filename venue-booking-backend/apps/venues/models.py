from django.contrib.postgres.fields import ArrayField
from django.db import models


class Venue(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    description = models.TextField(blank=True, default="")
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Venue"
        verbose_name_plural = "Venues"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class VenueImage(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="venues/images/")
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Venue Image"
        verbose_name_plural = "Venue Images"
        ordering = ["-is_primary", "created_at"]

    def __str__(self):
        return f"Image for {self.venue.name}"
