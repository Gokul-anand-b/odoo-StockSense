"""
Authentication URL routes.

All endpoints are prefixed with /api/auth/ (configured in root urls.py).
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .jwt_utils import StockSenseTokenObtainPairView
from .views import (
    RegisterView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    OTPRequestView,
    OTPVerifyView,
    ResetPasswordView,
)

app_name = 'authentication'

urlpatterns = [
    # ── Auth Core ──
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', StockSenseTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # ── Profile ──
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # ── OTP Password Reset ──
    path('otp/request/', OTPRequestView.as_view(), name='otp-request'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp-verify'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
