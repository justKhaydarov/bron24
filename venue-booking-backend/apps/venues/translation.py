from modeltranslation.translator import TranslationOptions, register

from .models import Venue


@register(Venue)
class VenueTranslationOptions(TranslationOptions):
    fields = ("name", "address", "description", "amenities")
