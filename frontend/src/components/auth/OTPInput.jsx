/**
 * StockSense — OTPInput Component
 *
 * 6-digit OTP input with:
 *   - Auto-focus advance on digit entry
 *   - Backspace navigation
 *   - Paste support (full 6-digit paste)
 *   - Individual digit glow animation on fill
 *   - Countdown timer for resend
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from '../../styles/auth.module.css';

export default function OTPInput({
  length = 6,
  onComplete,
  onResend,
  isLoading = false,
  resendCooldown = 60,
}) {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const [countdown, setCountdown] = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index, value) => {
      // Only allow single digit
      const digit = value.replace(/\D/g, '').slice(-1);

      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);

      // Auto-advance to next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if complete
      if (digit && newDigits.every((d) => d !== '')) {
        const code = newDigits.join('');
        onComplete?.(code);
      }
    },
    [digits, length, onComplete]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        // Move to previous input on backspace
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, length]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pasted.length === 0) return;

      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);

      // Focus last filled or next empty
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // If all digits filled
      if (newDigits.every((d) => d !== '')) {
        onComplete?.(newDigits.join(''));
      }
    },
    [digits, length, onComplete]
  );

  const handleResend = useCallback(() => {
    if (!canResend || isLoading) return;
    setDigits(Array(length).fill(''));
    setCountdown(resendCooldown);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    onResend?.();
  }, [canResend, isLoading, length, resendCooldown, onResend]);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* OTP Digit Inputs */}
      <div className={styles.otpContainer} onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`${styles.otpDigit} ${digit ? styles.otpDigitFilled : ''}`}
            disabled={isLoading}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      {/* Resend */}
      <div className={styles.otpResend}>
        {canResend ? (
          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend code
          </button>
        ) : (
          <span className={styles.countdown}>
            Resend in {formatCountdown(countdown)}
          </span>
        )}
      </div>
    </div>
  );
}
