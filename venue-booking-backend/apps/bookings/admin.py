from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "venue",
        "booking_date",
        "start_time",
        "end_time",
        "total_price",
        "status",
        "created_at",
    )
    list_filter = ("status", "booking_date")
    search_fields = ("user__phone_number", "venue__name")
    list_editable = ("status",)
    readonly_fields = ("total_price", "created_at", "updated_at")
    raw_id_fields = ("user", "venue")
