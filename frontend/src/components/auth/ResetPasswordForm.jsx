/**
 * StockSense — ResetPasswordForm Component
 *
 * Multi-step password reset flow:
 *   Step 1: Enter email → Request OTP
 *   Step 2: Enter 6-digit OTP → Verify
 *   Step 3: Set new password → Reset complete
 *
 * Features step indicator, animated transitions, and the 3D background.
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle, KeyRound, ShieldCheck,
} from 'lucide-react';
import authService from '../../services/authService';
import OTPInput from './OTPInput';
import styles from '../../styles/auth.module.css';

const STEPS = [
  { label: 'Email', number: 1 },
  { label: 'Verify', number: 2 },
  { label: 'Reset', number: 3 },
];

export default function ResetPasswordForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Step 1: Request OTP ──
  const handleRequestOTP = useCallback(
    async (e) => {
      e?.preventDefault();
      setError('');
      setIsLoading(true);

      try {
        if (!email) {
          setError('Please enter your email address.');
          return;
        }

        await authService.requestOTP(email);
        setStep(2);
        setSuccess('A verification code has been sent to your email.');
      } catch (err) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to send OTP. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );

  // ── Step 2: Verify OTP ──
  const handleVerifyOTP = useCallback(
    async (otpCode) => {
      setError('');
      setSuccess('');
      setIsLoading(true);

      try {
        const data = await authService.verifyOTP({ email, otpCode });
        setResetToken(data.reset_token);
        setStep(3);
        setSuccess('Code verified! Set your new password.');
      } catch (err) {
        setError(
          err.response?.data?.error || 'Invalid or expired code. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );

  // ── Step 3: Reset Password ──
  const handleResetPassword = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setIsLoading(true);

      try {
        await authService.resetPassword({
          email,
          otpCode: resetToken,
          newPassword,
          newPasswordConfirm: confirmPassword,
        });
        setStep(4); // Success state
        setSuccess('Password reset successful! You can now sign in.');
      } catch (err) {
        setError(
          err.response?.data?.error || 'Failed to reset password. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, resetToken, newPassword, confirmPassword]
  );

  // ── Resend OTP ──
  const handleResendOTP = useCallback(async () => {
    setError('');
    try {
      await authService.requestOTP(email);
      setSuccess('A new verification code has been sent.');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  }, [email]);

  return (
    <div className={styles.formCard}>
      {/* Header */}
      <div className={styles.formHeader}>
        <div className={styles.brandLogo}>
          <div className={styles.logoIcon}>S</div>
          <span className={styles.logoText}>StockSense</span>
        </div>

        {step < 4 && (
          <>
            <h1 className={styles.formTitle}>
              {step === 1 && 'Reset password'}
              {step === 2 && 'Enter verification code'}
              {step === 3 && 'Set new password'}
            </h1>
            <p className={styles.formSubtitle}>
              {step === 1 && 'Enter your email and we\'ll send you a verification code'}
              {step === 2 && `We sent a 6-digit code to ${email}`}
              {step === 3 && 'Choose a strong password for your account'}
            </p>
          </>
        )}
      </div>

      {/* Step Indicator */}
      {step < 4 && (
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s.number} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className={`${styles.step} ${
                  step === s.number ? styles.stepActive : ''
                } ${step > s.number ? styles.stepComplete : ''}`}
              >
                <div className={styles.stepDot}>
                  {step > s.number ? <CheckCircle size={14} /> : s.number}
                </div>
              </div>
              {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className={`${styles.messageBox} ${styles.errorMessage}`}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && !error && (
        <div className={`${styles.messageBox} ${styles.successMessage}`}>
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* ── STEP 1: Email ── */}
      {step === 1 && (
        <form onSubmit={handleRequestOTP} className={styles.formBody}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="reset-email">
              Email address
            </label>
            <div className={styles.fieldWrapper}>
              <Mail className={styles.fieldIcon} size={18} />
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className={styles.field}
                placeholder="you@company.com"
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            <span className={styles.buttonContent}>
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  Sending code...
                </>
              ) : (
                <>
                  <ArrowRight size={18} />
                  Send Verification Code
                </>
              )}
            </span>
          </button>
        </form>
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 2 && (
        <div className={styles.formBody}>
          <OTPInput
            length={6}
            onComplete={handleVerifyOTP}
            onResend={handleResendOTP}
            isLoading={isLoading}
            resendCooldown={60}
          />

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <span className={`${styles.spinner} ${styles.spinnerWhite}`} />
            </div>
          )}

          <button
            type="button"
            onClick={() => { setStep(1); setError(''); setSuccess(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-sans)',
              marginTop: '8px',
              width: '100%',
            }}
          >
            <ArrowLeft size={16} />
            Change email
          </button>
        </div>
      )}

      {/* ── STEP 3: New Password ── */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className={styles.formBody}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="new-password">
              New password
            </label>
            <div className={styles.fieldWrapper}>
              <Lock className={styles.fieldIcon} size={18} />
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                className={styles.field}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="confirm-new-password">
              Confirm new password
            </label>
            <div className={styles.fieldWrapper}>
              <Lock className={styles.fieldIcon} size={18} />
              <input
                id="confirm-new-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                className={styles.field}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirm((p) => !p)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            <span className={styles.buttonContent}>
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  Resetting password...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Reset Password
                </>
              )}
            </span>
          </button>
        </form>
      )}

      {/* ── STEP 4: Success ── */}
      {step === 4 && (
        <div className={styles.formBody} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'scaleIn 0.5s var(--ease-spring)',
            }}
          >
            <CheckCircle size={32} color="#10b981" />
          </div>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-white)',
              marginBottom: '8px',
            }}
          >
            Password Reset Complete
          </h2>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: '24px',
            }}
          >
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Link href="/login">
            <button className={styles.submitButton}>
              <span className={styles.buttonContent}>
                <KeyRound size={18} />
                Sign In
              </span>
            </button>
          </Link>
        </div>
      )}

      {/* Footer */}
      {step < 4 && (
        <div className={styles.formFooter}>
          <p className={styles.formFooterText}>
            Remember your password?{' '}
            <Link href="/login" className={styles.formLink}>
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
