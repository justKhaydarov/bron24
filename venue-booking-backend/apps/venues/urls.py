from django.urls import path

from . import views

urlpatterns = [
    path("", views.VenueListView.as_view(), name="venue-list"),
    path("<int:pk>/", views.VenueDetailView.as_view(), name="venue-detail"),
    path(
        "<int:pk>/availability/",
        views.VenueAvailabilityView.as_view(),
        name="venue-availability",
    ),
]
