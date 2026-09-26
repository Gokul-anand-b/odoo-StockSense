'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Save,
  Clock,
  Sparkles,
  Check,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import authService from '../../../services/authService';
import styles from '../../../styles/profile.module.css';

export default function ProfilePage() {
  const { user, isManager, isStaff, updateProfile, logout } = useAuth({
    requireAuth: true,
  });

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync profileForm with user on mount/update
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setProfileError('');
      setProfileSuccess('');
      setIsUpdatingProfile(true);

      const result = await updateProfile({
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        phone: profileForm.phone,
      });

      setIsUpdatingProfile(false);
      if (result.success) {
        setProfileSuccess('Profile updated successfully.');
      } else {
        setProfileError(
          typeof result.error === 'string'
            ? result.error
            : 'Failed to update profile. Please try again.'
        );
      }
    },
    [profileForm, updateProfile]
  );

  // Handle Password Change
  const handlePasswordSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setPasswordError('');
      setPasswordSuccess('');

      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        setPasswordError('Please fill in all password fields.');
        return;
      }

      if (passwordForm.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters long.');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError('New passwords do not match.');
        return;
      }

      setIsUpdatingPassword(true);

      try {
        await authService.changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          newPasswordConfirm: passwordForm.confirmPassword,
        });

        setPasswordSuccess('Password changed successfully.');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err) {
        const errorData = err.response?.data;
        const msg =
          errorData?.current_password?.[0] ||
          errorData?.new_password?.[0] ||
          errorData?.non_field_errors?.[0] ||
          errorData?.error ||
          errorData?.detail ||
          'Failed to change password. Please verify current password.';
        setPasswordError(msg);
      } finally {
        setIsUpdatingPassword(false);
      }
    },
    [passwordForm]
  );

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : 'SS';

  const roleTitle = isManager
    ? 'Inventory Manager'
    : isStaff
    ? 'Warehouse Staff'
    : user?.role || 'Staff';

  // Role permissions breakdown
  const managerPermissions = [
    {
      title: 'Full Ledger Access & Adjustments',
      desc: 'Can record manual adjustments, inventory reconciliations, and view full audit history.',
    },
    {
      title: 'Catalog & Reorder Rule Management',
      desc: 'Create, update, and categorize products, suppliers, safety stock thresholds, and min/max limits.',
    },
    {
      title: 'AI Forecasting & Parameter Tuning',
      desc: 'Trigger demand forecast runs, inspect ML predictions, and adjust seasonal growth multipliers.',
    },
    {
      title: 'Warehouse 3D Twin & Layout Configuration',
      desc: 'Configure physical warehouse zones, aisles, rack heights, and bay storage limits.',
    },
  ];

  const staffPermissions = [
    {
      title: 'Barcode & QR Scanning',
      desc: 'Scan SKU barcodes and bin labels for real-time validation of operations.',
    },
    {
      title: 'Picking, Packing & Goods Receipt',
      desc: 'Execute pick lists, pack outbound crates, receive incoming purchase orders, and transfer bins.',
    },
    {
      title: 'Voice-Activated Operations',
      desc: 'Issue hands-free voice commands to verify quantities, locate items, and log discrepancies.',
    },
    {
      title: 'Interactive 3D Bay Navigation',
      desc: 'Locate inventory items dynamically inside the 3D warehouse twin visualization.',
    },
  ];

  const activePermissions = isManager ? managerPermissions : staffPermissions;

  return (
    <div className={styles.profileContainer}>
      {/* Profile Banner */}
      <section className={styles.profileBanner}>
        <div className={styles.profileInfoGroup}>
          <div className={styles.bannerAvatar}>{initials}</div>
          <div className={styles.bannerDetails}>
            <h1 className={styles.bannerName}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'StockSense User'}
            </h1>
            <p className={styles.bannerEmail}>{user?.email}</p>
            <div className={styles.bannerMeta}>
              <span
                className={`${styles.bannerRole} ${
                  isManager ? styles.managerBadge : styles.staffBadge
                }`}
              >
                <Shield size={12} />
                {roleTitle}
              </span>
              <span className={styles.bannerStatus}>
                <span className={styles.bannerStatusDot} />
                Active Session
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className={`${styles.submitBtn} ${styles.btnSecondary}`}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </section>

      {/* Main 2-Column Content */}
      <div className={styles.gridTwoCol}>
        {/* Left Column: Edit Details & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Card: Personal Details */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <User size={20} className={styles.cardHeaderIcon} />
              <div>
                <h2 className={styles.cardTitle}>Personal Information</h2>
                <p className={styles.cardSubtitle}>Update your profile details and contact number</p>
              </div>
            </div>

            {profileSuccess && (
              <div className={styles.alertSuccess}>
                <CheckCircle2 size={16} />
                {profileSuccess}
              </div>
            )}

            {profileError && (
              <div className={styles.alertError}>
                <AlertCircle size={16} />
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className={styles.formGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="profile-email">
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    id="profile-email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className={`${styles.inputField} ${styles.inputFieldDisabled}`}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="profile-firstname">
                    First Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <User size={16} className={styles.inputIcon} />
                    <input
                      id="profile-firstname"
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      className={styles.inputField}
                      placeholder="Jane"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="profile-lastname">
                    Last Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <User size={16} className={styles.inputIcon} />
                    <input
                      id="profile-lastname"
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      className={styles.inputField}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="profile-phone">
                  Phone Number
                </label>
                <div className={styles.inputWrapper}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className={styles.submitBtn}
                style={{ marginTop: 'var(--space-2)' }}
              >
                <Save size={16} />
                {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Card: Change Password */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <KeyRound size={20} className={styles.cardHeaderIcon} />
              <div>
                <h2 className={styles.cardTitle}>Change Password</h2>
                <p className={styles.cardSubtitle}>
                  Ensure your account uses a secure password (minimum 8 characters)
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className={styles.alertSuccess}>
                <CheckCircle2 size={16} />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className={styles.alertError}>
                <AlertCircle size={16} />
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className={styles.formGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="curr-pass">
                  Current Password
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    id="curr-pass"
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowCurrentPass((p) => !p)}
                    aria-label="Toggle password visibility"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="new-pass">
                  New Password
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    id="new-pass"
                    type={showNewPass ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowNewPass((p) => !p)}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="confirm-pass">
                  Confirm New Password
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    id="confirm-pass"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className={styles.submitBtn}
                style={{ marginTop: 'var(--space-2)' }}
              >
                <Lock size={16} />
                {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Role & RBAC Permissions Matrix + Session Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Card: Role & RBAC Capabilities */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Shield size={20} className={styles.cardHeaderIcon} />
              <div>
                <h2 className={styles.cardTitle}>Role & Assigned Capabilities</h2>
                <p className={styles.cardSubtitle}>
                  Current authorization level: <strong>{roleTitle}</strong>
                </p>
              </div>
            </div>

            <div className={styles.permissionList}>
              {activePermissions.map((perm, idx) => (
                <div key={idx} className={styles.permissionItem}>
                  <div className={styles.permissionIconGranted}>
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className={styles.permissionTitle}>{perm.title}</h3>
                    <p className={styles.permissionDesc}>{perm.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-border)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-tertiary)',
                lineHeight: '1.5',
              }}
            >
              Need additional operational privileges or warehouse zone assignments? Contact your
              system administrator or senior inventory director.
            </div>
          </div>

          {/* Card: Security & Session Telemetry */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Clock size={20} className={styles.cardHeaderIcon} />
              <div>
                <h2 className={styles.cardTitle}>Active Session Details</h2>
                <p className={styles.cardSubtitle}>Cryptographic JWT and account parameters</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionKeyVal}>
                  <span className={styles.sessionKey}>AUTH METHOD</span>
                  <span className={styles.sessionVal}>JWT Bearer (RS256 / HS256)</span>
                </div>
                <span className={styles.bannerStatus}>
                  <span className={styles.bannerStatusDot} />
                  Verified
                </span>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionKeyVal}>
                  <span className={styles.sessionKey}>USER ID (UUID)</span>
                  <span className={styles.sessionVal}>
                    {user?.id ? `${String(user.id).slice(0, 18)}...` : 'Assigned upon signin'}
                  </span>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionKeyVal}>
                  <span className={styles.sessionKey}>PASSWORD RECOVERY</span>
                  <span className={styles.sessionVal}>6-Digit Cryptographic OTP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
