"""
Unit and integration tests for StockSense Authentication app (Module 1).

Tests cover:
    - User registration (role selection, validation)
    - JWT login (claims verification: role, email, user_id, full_name)
    - OTP generation, expiry check, single-use invalidation
    - Password reset via OTP flow
    - Authenticated profile get & update
    - Authenticated password change
    - Token refresh and logout blacklisting
    - Role-based permission checks (IsInventoryManager, IsWarehouseStaff)
"""

from datetime import timedelta
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import User, PasswordResetOTP
from .otp_service import generate_otp, validate_otp
from .permissions import IsInventoryManager, IsWarehouseStaff


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Manager user
        self.manager_user = User.objects.create_user(
            email='manager@stocksense.io',
            password='Password123!',
            first_name='Marcus',
            last_name='Vance',
            role=User.Role.INVENTORY_MANAGER,
            phone='+1-555-0100',
        )

        # Staff user
        self.staff_user = User.objects.create_user(
            email='staff@stocksense.io',
            password='Password123!',
            first_name='Sara',
            last_name='Connor',
            role=User.Role.WAREHOUSE_STAFF,
            phone='+1-555-0200',
        )

    # ── 1. Registration Tests ──
    def test_register_warehouse_staff_success(self):
        url = reverse('authentication:register')
        payload = {
            'email': 'newstaff@stocksense.io',
            'first_name': 'Alex',
            'last_name': 'Mercer',
            'role': 'warehouse_staff',
            'phone': '+1-555-0300',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'newstaff@stocksense.io')
        self.assertEqual(response.data['user']['role'], 'warehouse_staff')

        # Check JWT token claims
        token = AccessToken(response.data['access'])
        self.assertEqual(token['role'], 'warehouse_staff')
        self.assertEqual(token['email'], 'newstaff@stocksense.io')

    def test_register_password_mismatch(self):
        url = reverse('authentication:register')
        payload = {
            'email': 'fail@stocksense.io',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword!',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)

    # ── 2. Login & JWT Claims Tests ──
    def test_login_success_and_jwt_claims(self):
        url = reverse('authentication:login')
        payload = {
            'email': 'manager@stocksense.io',
            'password': 'Password123!',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'inventory_manager')

        # Decode token and verify custom claims
        token = AccessToken(response.data['access'])
        self.assertEqual(token['role'], 'inventory_manager')
        self.assertEqual(token['full_name'], 'Marcus Vance')
        self.assertEqual(token['email'], 'manager@stocksense.io')

    def test_login_invalid_credentials(self):
        url = reverse('authentication:login')
        payload = {
            'email': 'manager@stocksense.io',
            'password': 'WrongPassword!',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── 3. OTP Service Tests ──
    def test_otp_generation_and_validation(self):
        otp = generate_otp(self.manager_user)
        self.assertEqual(len(otp.otp_code), 6)
        self.assertTrue(otp.otp_code.isdigit())
        self.assertFalse(otp.is_expired)

        # Validate with correct code
        is_valid, result = validate_otp(self.manager_user, otp.otp_code)
        self.assertTrue(is_valid)

        # Verify OTP is now consumed (single-use)
        is_valid_second, _ = validate_otp(self.manager_user, otp.otp_code)
        self.assertFalse(is_valid_second)

    def test_otp_expiry(self):
        otp = generate_otp(self.staff_user)
        # Manually backdate expiry
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()

        is_valid, msg = validate_otp(self.staff_user, otp.otp_code)
        self.assertFalse(is_valid)
        self.assertIn('expired', msg.lower())

    def test_otp_max_attempts(self):
        otp = generate_otp(self.staff_user)
        # Attempt 1: wrong
        validate_otp(self.staff_user, '000000')
        # Attempt 2: wrong
        validate_otp(self.staff_user, '000000')
        # Attempt 3: wrong
        is_valid, msg = validate_otp(self.staff_user, '000000')
        self.assertFalse(is_valid)

        # Even if 4th attempt is the right code, it must fail because max attempts exceeded
        is_valid, msg = validate_otp(self.staff_user, otp.otp_code)
        self.assertFalse(is_valid)
        self.assertIn('exceeded', msg.lower())

    # ── 4. Password Reset API Flow ──
    def test_password_reset_full_flow(self):
        # Step 1: Request OTP
        req_url = reverse('authentication:otp-request')
        resp = self.client.post(req_url, {'email': 'staff@stocksense.io'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Retrieve generated OTP from DB
        otp = PasswordResetOTP.objects.filter(user=self.staff_user, is_used=False).latest('created_at')

        # Step 2: Verify OTP
        verify_url = reverse('authentication:otp-verify')
        resp = self.client.post(
            verify_url,
            {'email': 'staff@stocksense.io', 'otp_code': otp.otp_code},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        reset_token = resp.data['reset_token']

        # Step 3: Reset Password
        reset_url = reverse('authentication:reset-password')
        resp = self.client.post(
            reset_url,
            {
                'email': 'staff@stocksense.io',
                'otp_code': reset_token,
                'new_password': 'BrandNewPassword99!',
                'new_password_confirm': 'BrandNewPassword99!',
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Step 4: Login with new password
        login_url = reverse('authentication:login')
        resp = self.client.post(
            login_url,
            {'email': 'staff@stocksense.io', 'password': 'BrandNewPassword99!'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # ── 5. Profile & Change Password ──
    def test_profile_retrieve_and_update(self):
        self.client.force_authenticate(user=self.manager_user)
        profile_url = reverse('authentication:profile')

        # GET
        resp = self.client.get(profile_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['first_name'], 'Marcus')

        # PUT
        resp = self.client.put(
            profile_url,
            {
                'first_name': 'Marcus Updated',
                'last_name': 'Vance',
                'phone': '+1-555-9999',
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['first_name'], 'Marcus Updated')
        self.assertEqual(resp.data['phone'], '+1-555-9999')

    def test_change_password_authenticated(self):
        self.client.force_authenticate(user=self.staff_user)
        change_url = reverse('authentication:change-password')

        resp = self.client.post(
            change_url,
            {
                'current_password': 'Password123!',
                'new_password': 'UpdatedPassword456!',
                'new_password_confirm': 'UpdatedPassword456!',
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Verify old password no longer works
        self.staff_user.refresh_from_db()
        self.assertFalse(self.staff_user.check_password('Password123!'))
        self.assertTrue(self.staff_user.check_password('UpdatedPassword456!'))

    # ── 6. Logout and Token Blacklisting ──
    def test_logout_blacklists_token(self):
        refresh = RefreshToken.for_user(self.staff_user)
        self.client.force_authenticate(user=self.staff_user)
        logout_url = reverse('authentication:logout')

        resp = self.client.post(logout_url, {'refresh': str(refresh)}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Attempt to use blacklisted refresh token
        refresh_url = reverse('authentication:token-refresh')
        resp = self.client.post(refresh_url, {'refresh': str(refresh)}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── 7. Role-Based Permissions ──
    def test_rbac_permission_classes(self):
        class DummyRequest:
            def __init__(self, user):
                self.user = user

        manager_req = DummyRequest(self.manager_user)
        staff_req = DummyRequest(self.staff_user)

        perm_mgr = IsInventoryManager()
        perm_staff = IsWarehouseStaff()

        self.assertTrue(perm_mgr.has_permission(manager_req, None))
        self.assertFalse(perm_mgr.has_permission(staff_req, None))

        self.assertTrue(perm_staff.has_permission(staff_req, None))
        self.assertFalse(perm_staff.has_permission(manager_req, None))
