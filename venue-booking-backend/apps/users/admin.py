from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserCreationForm(forms.ModelForm):
    """Form for creating new users in admin (no password required)."""

    class Meta:
        model = User
        fields = ("phone_number", "name")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_unusable_password()
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """Form for updating users in admin."""

    class Meta:
        model = User
        fields = ("phone_number", "name", "is_active", "is_verified", "is_staff", "is_superuser", "groups", "user_permissions")


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ("phone_number", "name", "is_active", "is_verified", "is_staff", "created_at")
    list_filter = ("is_active", "is_verified", "is_staff")
    search_fields = ("phone_number", "name")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("phone_number",)}),
        ("Personal Info", {"fields": ("name",)}),
        (
            "Permissions",
            {"fields": ("is_active", "is_verified", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("phone_number", "name", "is_verified", "is_staff", "is_superuser"),
            },
        ),
    )
