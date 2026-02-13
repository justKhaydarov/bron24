from django.contrib import admin
from modeltranslation.admin import TranslationAdmin

from .models import Venue, VenueImage


class VenueImageInline(admin.TabularInline):
    model = VenueImage
    extra = 1


@admin.register(Venue)
class VenueAdmin(TranslationAdmin):
    list_display = ("name", "address", "price_per_hour", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "address")
    inlines = [VenueImageInline]


@admin.register(VenueImage)
class VenueImageAdmin(admin.ModelAdmin):
    list_display = ("venue", "is_primary", "created_at")
    list_filter = ("is_primary",)
