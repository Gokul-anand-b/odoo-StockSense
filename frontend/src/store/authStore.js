/**
 * StockSense — Auth Store (Zustand)
 *
 * Manages:
 *   - JWT tokens (access + refresh) in localStorage
 *   - User object with role
 *   - Auth state: isAuthenticated, isLoading
 *   - Login, register, logout, and profile actions
 */

import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  // ── State ──
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // true until initial hydration completes
  error: null,

  // ── Hydrate from localStorage ──
  hydrate: () => {
    if (typeof window === 'undefined') return;

    try {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (accessToken && user) {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // ── Persist tokens ──
  _persistAuth: (accessToken, refreshToken, user) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  // ── Login ──
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login({ email, password });
      get()._persistAuth(data.access, data.refresh, data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ── Register ──
  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(formData);
      get()._persistAuth(data.access, data.refresh, data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const errors = err.response?.data;
      let message = 'Registration failed.';

      if (errors) {
        // Flatten field errors
        const fieldErrors = Object.entries(errors)
          .filter(([key]) => key !== 'non_field_errors')
          .map(([, msgs]) => (Array.isArray(msgs) ? msgs[0] : msgs));
        const nonField = errors.non_field_errors;

        if (nonField) message = Array.isArray(nonField) ? nonField[0] : nonField;
        else if (fieldErrors.length) message = fieldErrors[0];
      }

      set({ isLoading: false, error: message });
      return { success: false, error: message, errors };
    }
  },

  // ── Logout ──
  logout: async () => {
    try {
      const refreshToken = get().refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Silent fail — still clear local state
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // ── Profile ──
  fetchProfile: async () => {
    try {
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      return user;
    } catch {
      return null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const user = await authService.updateProfile(profileData);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.response?.data || 'Update failed.' };
    }
  },

  // ── Helpers ──
  clearError: () => set({ error: null }),

  isManager: () => get().user?.role === 'inventory_manager',
  isStaff: () => get().user?.role === 'warehouse_staff',
}));

export default useAuthStore;
