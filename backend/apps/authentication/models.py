"""
Custom User model with role-based access control and OTP password reset model.
"""

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom manager for the User model with email as the unique identifier."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address.')
        email = self.normalize_email(email)
        extra_fields.setdefault('role', User.Role.WAREHOUSE_STAFF)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.INVENTORY_MANAGER)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with email-based authentication and role support.

    Roles:
        INVENTORY_MANAGER — Full access: products, warehouses, operations, alerts,
                            forecasting, and user management.
        WAREHOUSE_STAFF   — Scoped access: view products, handle stock operations,
                            scan barcodes, acknowledge alerts.
    """

    class Role(models.TextChoices):
        INVENTORY_MANAGER = 'inventory_manager', 'Inventory Manager'
        WAREHOUSE_STAFF = 'warehouse_staff', 'Warehouse Staff'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.WAREHOUSE_STAFF,
    )
    phone = models.CharField(max_length=20, blank=True, default='')
    avatar_url = models.URLField(blank=True, default='')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'auth_user'
        ordering = ['-date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.email})'

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    @property
    def is_manager(self):
        return self.role == self.Role.INVENTORY_MANAGER

    @property
    def is_warehouse_staff(self):
        return self.role == self.Role.WAREHOUSE_STAFF


class PasswordResetOTP(models.Model):
    """
    Stores time-limited 6-digit OTP codes for email-based password resets.
    Each user may only have one active OTP at a time (enforced in otp_service).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_otps',
    )
    otp_code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'auth_password_reset_otp'
        ordering = ['-created_at']
        verbose_name = 'Password Reset OTP'
        verbose_name_plural = 'Password Reset OTPs'

    def __str__(self):
        return f'OTP for {self.user.email} — expires {self.expires_at}'

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired and self.attempts < 3
