/**
 * StockSense — SignupForm Component
 *
 * Registration form with role selection (Inventory Manager / Warehouse Staff),
 * animated field staggering, and premium glassmorphic styling.
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Mail, Lock, Eye, EyeOff, User, Phone,
  UserPlus, AlertCircle, Shield, Package,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/auth.module.css';

export default function SignupForm() {
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'warehouse_staff',
    password: '',
    passwordConfirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setLocalError('Please fill in all required fields.');
        return;
      }

      if (formData.password.length < 8) {
        setLocalError('Password must be at least 8 characters.');
        return;
      }

      if (formData.password !== formData.passwordConfirm) {
        setLocalError('Passwords do not match.');
        return;
      }

      await register(formData);
    },
    [formData, register]
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
        <h1 className={styles.formTitle}>Create your account</h1>
        <p className={styles.formSubtitle}>
          Join StockSense to start managing inventory intelligently
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
        {/* Name Row */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <div>
              <label className={styles.fieldLabel} htmlFor="signup-firstname">
                First name
              </label>
              <div className={styles.fieldWrapper}>
                <User className={styles.fieldIcon} size={18} />
                <input
                  id="signup-firstname"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.field}
                  placeholder="John"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className={styles.fieldLabel} htmlFor="signup-lastname">
                Last name
              </label>
              <div className={styles.fieldWrapper}>
                <User className={styles.fieldIcon} size={18} />
                <input
                  id="signup-lastname"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.field}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-email">
            Email address
          </label>
          <div className={styles.fieldWrapper}>
            <Mail className={styles.fieldIcon} size={18} />
            <input
              id="signup-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.field}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Phone */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-phone">
            Phone <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
          </label>
          <div className={styles.fieldWrapper}>
            <Phone className={styles.fieldIcon} size={18} />
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={styles.field}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Role Selector */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Role</label>
          <div className={styles.roleSelector}>
            <label className={styles.roleOption}>
              <input
                type="radio"
                name="role"
                value="inventory_manager"
                checked={formData.role === 'inventory_manager'}
                onChange={handleChange}
              />
              <div className={styles.roleCard}>
                <Shield className={styles.roleIcon} size={28} />
                <span className={styles.roleName}>Inventory Manager</span>
              </div>
            </label>
            <label className={styles.roleOption}>
              <input
                type="radio"
                name="role"
                value="warehouse_staff"
                checked={formData.role === 'warehouse_staff'}
                onChange={handleChange}
              />
              <div className={styles.roleCard}>
                <Package className={styles.roleIcon} size={28} />
                <span className={styles.roleName}>Warehouse Staff</span>
              </div>
            </label>
          </div>
        </div>

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-password">
            Password
          </label>
          <div className={styles.fieldWrapper}>
            <Lock className={styles.fieldIcon} size={18} />
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className={styles.field}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-confirm">
            Confirm password
          </label>
          <div className={styles.fieldWrapper}>
            <Lock className={styles.fieldIcon} size={18} />
            <input
              id="signup-confirm"
              name="passwordConfirm"
              type={showConfirm ? 'text' : 'password'}
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={styles.field}
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </span>
        </button>
      </form>

      {/* Footer */}
      <div className={styles.formFooter}>
        <p className={styles.formFooterText}>
          Already have an account?{' '}
          <Link href="/login" className={styles.formLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
