/**
 * StockSense — LoginForm Component
 *
 * Premium glassmorphic login form with 3D background,
 * animated field entries, and shimmer submit button.
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/auth.module.css';

export default function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLocalError('');

      if (!formData.email || !formData.password) {
        setLocalError('Please fill in all fields.');
        return;
      }

      await login(formData.email, formData.password);
    },
    [formData, login]
  );

  const displayError = localError || error;

  return (
    <div className={styles.formCard}>
      {/* Header */}
      <div className={styles.formHeader}>
        <div className={styles.brandLogo}>
          <div className={styles.logoIcon}>S</div>
          <span className={styles.logoText}>StockSense</span>
        </div>
        <h1 className={styles.formTitle}>Welcome back</h1>
        <p className={styles.formSubtitle}>
          Sign in to your account to continue managing your inventory
        </p>
      </div>

      {/* Error */}
      {displayError && (
        <div className={`${styles.messageBox} ${styles.errorMessage}`}>
          <AlertCircle size={16} />
          {displayError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.formBody}>
        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="login-email">
            Email address
          </label>
          <div className={styles.fieldWrapper}>
            <Mail className={styles.fieldIcon} size={18} />
            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.field}
              placeholder="you@company.com"
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="login-password">
            Password
          </label>
          <div className={styles.fieldWrapper}>
            <Lock className={styles.fieldIcon} size={18} />
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className={styles.field}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div style={{ textAlign: 'right', marginTop: '-8px' }}>
          <Link href="/reset-password" className={styles.formLink} style={{ fontSize: '0.8125rem' }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          <span className={styles.buttonContent}>
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </span>
        </button>
      </form>

      {/* Footer */}
      <div className={styles.formFooter}>
        <p className={styles.formFooterText}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className={styles.formLink}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
