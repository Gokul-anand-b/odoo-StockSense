"""
Authentication API views.

Endpoints:
    POST /api/auth/register/         — Create new user account
    POST /api/auth/login/            — JWT token pair (access + refresh)
    POST /api/auth/refresh/          — Refresh access token
    POST /api/auth/logout/           — Blacklist refresh token
    GET  /api/auth/profile/          — Get authenticated user profile
    PUT  /api/auth/profile/          — Update profile
    POST /api/auth/change-password/  — Change password (authenticated)
    POST /api/auth/otp/request/      — Request password reset OTP
    POST /api/auth/otp/verify/       — Verify OTP code
    POST /api/auth/reset-password/   — Reset password with OTP
"""

import logging
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import User
from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    ResetPasswordSerializer,
)
from .otp_service import generate_otp, send_otp_email, validate_otp
from .jwt_utils import StockSenseTokenObtainPairView

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────
# Registration
# ──────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    """Create a new user account and return JWT tokens."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate token pair for immediate login after registration
        refresh = RefreshToken.for_user(user)

        # Inject custom claims
        refresh['user_id'] = str(user.id)
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['full_name'] = user.full_name

        logger.info(f'New user registered: {user.email} ({user.role})')

        return Response({
            'message': 'Account created successfully.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


# ──────────────────────────────────────────────
# Logout (blacklist refresh token)
# ──────────────────────────────────────────────
class LogoutView(APIView):
    """Blacklist the refresh token to force re-authentication."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info(f'User logged out: {request.user.email}')
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.warning(f'Logout failed: {e}')
            return Response(
                {'error': 'Invalid or expired refresh token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ──────────────────────────────────────────────
# Profile
# ──────────────────────────────────────────────
class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the authenticated user's profile."""

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ──────────────────────────────────────────────
# Change Password (authenticated)
# ──────────────────────────────────────────────
class ChangePasswordView(APIView):
    """Change password for authenticated users."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])

        logger.info(f'Password changed for: {request.user.email}')
        return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# OTP — Request
# ──────────────────────────────────────────────
class OTPRequestView(APIView):
    """Send a 6-digit OTP to the user's email for password reset."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Generic success message to prevent email enumeration
        success_message = (
            'If an account with that email exists, '
            'a password reset code has been sent.'
        )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal that the email doesn't exist
            return Response({'message': success_message}, status=status.HTTP_200_OK)

        otp = generate_otp(user)
        send_otp_email(user, otp.otp_code)

        return Response({'message': success_message}, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# OTP — Verify
# ──────────────────────────────────────────────
class OTPVerifyView(APIView):
    """Verify a 6-digit OTP code without resetting the password."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or OTP code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_valid, result = validate_otp(user, otp_code)

        if not is_valid:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        # Re-generate OTP for the actual reset step (single-use)
        new_otp = generate_otp(user)

        return Response({
            'message': 'OTP verified successfully.',
            'reset_token': new_otp.otp_code,  # New OTP for the reset step
        }, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# Password Reset (with OTP)
# ──────────────────────────────────────────────
class ResetPasswordView(APIView):
    """Reset the user's password using a verified OTP code."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or OTP code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_valid, result = validate_otp(user, otp_code)

        if not is_valid:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=['password'])

        logger.info(f'Password reset successfully for: {user.email}')

        return Response(
            {'message': 'Password has been reset successfully. You can now log in.'},
            status=status.HTTP_200_OK,
        )


class UserListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.filter(is_active=True).order_by('first_name', 'last_name')
        data = [
            {
                'id': str(u.id),
                'name': u.full_name or u.email,
                'email': u.email,
                'role': u.role,
            }
            for u in users
        ]
        return Response(data, status=status.HTTP_200_OK)

