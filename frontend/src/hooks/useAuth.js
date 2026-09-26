/**
 * StockSense — useAuth Hook
 *
 * Provides:
 *   - Auth state (user, isAuthenticated, isLoading)
 *   - Auth actions (login, register, logout)
 *   - Route guard: redirects unauthenticated users to /login
 *   - Role guards: requireManager(), requireStaff()
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '../store/authStore';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/reset-password'];

export default function useAuth({ requireAuth = false, requiredRole = null } = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    hydrate,
    clearError,
    isManager,
    isStaff,
  } = useAuthStore();

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route));

    if (requireAuth && !isAuthenticated && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isPublicRoute) {
      router.replace('/dashboard');
      return;
    }

    // Role-based guard
    if (requiredRole && isAuthenticated && user?.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, requireAuth, requiredRole, pathname, router, user]);

  // Login with redirect
  const handleLogin = useCallback(
    async (email, password) => {
      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      }
      return result;
    },
    [login, router]
  );

  // Register with redirect
  const handleRegister = useCallback(
    async (formData) => {
      const result = await register(formData);
      if (result.success) {
        router.push('/dashboard');
      }
      return result;
    },
    [register, router]
  );

  // Logout with redirect
  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/login');
  }, [logout, router]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isManager: isManager(),
    isStaff: isStaff(),

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchProfile,
    updateProfile,
    clearError,
  };
}
