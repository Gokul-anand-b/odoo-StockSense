/**
 * StockSense — Auth Service
 *
 * Provides all authentication API calls:
 *   - register, login, logout
 *   - profile get/update
 *   - password change
 *   - OTP request, verify, reset
 */

import api from './api';

const AUTH_PREFIX = '/auth';

const authService = {
  // ── Registration ──
  async register({ email, firstName, lastName, role, phone, password, passwordConfirm }) {
    const { data } = await api.post(`${AUTH_PREFIX}/register/`, {
      email,
      first_name: firstName,
      last_name: lastName,
      role: role || 'warehouse_staff',
      phone: phone || '',
      password,
      password_confirm: passwordConfirm,
    });
    return data;
  },

  // ── Login ──
  async login({ email, password }) {
    const { data } = await api.post(`${AUTH_PREFIX}/login/`, { email, password });
    return data;
  },

  // ── Logout ──
  async logout(refreshToken) {
    const { data } = await api.post(`${AUTH_PREFIX}/logout/`, { refresh: refreshToken });
    return data;
  },

  // ── Token Refresh ──
  async refreshToken(refreshToken) {
    const { data } = await api.post(`${AUTH_PREFIX}/refresh/`, { refresh: refreshToken });
    return data;
  },

  // ── Profile ──
  async getProfile() {
    const { data } = await api.get(`${AUTH_PREFIX}/profile/`);
    return data;
  },

  async updateProfile(profileData) {
    const { data } = await api.put(`${AUTH_PREFIX}/profile/`, profileData);
    return data;
  },

  // ── Password ──
  async changePassword({ currentPassword, newPassword, newPasswordConfirm }) {
    const { data } = await api.post(`${AUTH_PREFIX}/change-password/`, {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return data;
  },

  // ── OTP Password Reset ──
  async requestOTP(email) {
    const { data } = await api.post(`${AUTH_PREFIX}/otp/request/`, { email });
    return data;
  },

  async verifyOTP({ email, otpCode }) {
    const { data } = await api.post(`${AUTH_PREFIX}/otp/verify/`, {
      email,
      otp_code: otpCode,
    });
    return data;
  },

  async resetPassword({ email, otpCode, newPassword, newPasswordConfirm }) {
    const { data } = await api.post(`${AUTH_PREFIX}/reset-password/`, {
      email,
      otp_code: otpCode,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return data;
  },

  async getUsers() {
    const { data } = await api.get(`${AUTH_PREFIX}/users/`);
    return data;
  },
};

export default authService;
