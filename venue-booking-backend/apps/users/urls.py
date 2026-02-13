from django.urls import path

from . import views

urlpatterns = [
    path("send-otp/", views.SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", views.VerifyOTPView.as_view(), name="verify-otp"),
    path("refresh/", views.RefreshTokenView.as_view(), name="token-refresh"),
    path("me/", views.UserMeView.as_view(), name="user-me"),
]
