"""
Serializers for authentication: Register, Login, Profile, OTP request & verify,
and password reset.
"""

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """
    User registration with password confirmation and validation.
    """

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role',
            'phone', 'password', 'password_confirm',
        ]
        extra_kwargs = {
            'role': {'required': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """
    Validates email + password credentials.
    Token generation is handled by the JWT view; this is used for
    validation when a custom login flow is needed.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Read/update serializer for the authenticated user's profile.
    """

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar_url', 'date_joined', 'updated_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'date_joined', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    """
    Allows authenticated users to change their own password.
    """

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'New passwords do not match.'}
            )
        validate_password(attrs['new_password'])
        return attrs


class OTPRequestSerializer(serializers.Serializer):
    """
    Accepts an email address to initiate the password reset OTP flow.
    """

    email = serializers.EmailField()

    def validate_email(self, value):
        # We intentionally don't reveal whether the email exists
        return value.lower()


class OTPVerifySerializer(serializers.Serializer):
    """
    Validates a 6-digit OTP code for a given email.
    """

    email = serializers.EmailField()
    otp_code = serializers.CharField(min_length=6, max_length=6)

    def validate_email(self, value):
        return value.lower()

    def validate_otp_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('OTP must be a 6-digit number.')
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """
    Resets the user's password after OTP verification.
    Requires the email, verified OTP code, and a new password.
    """

    email = serializers.EmailField()
    otp_code = serializers.CharField(min_length=6, max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return value.lower()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'Passwords do not match.'}
            )
        validate_password(attrs['new_password'])
        return attrs
