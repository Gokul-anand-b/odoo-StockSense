"""
OTP generation, email dispatch, and validation service.
"""

import random
import logging
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

from .models import PasswordResetOTP

logger = logging.getLogger(__name__)


def generate_otp(user):
    """
    Create a fresh 6-digit OTP for the given user.

    Invalidates any existing active OTPs first, ensuring only one
    active code at a time. Returns the OTP record.
    """
    # Invalidate all previous OTPs for this user
    PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)

    otp_code = f'{random.randint(0, 999999):06d}'
    expiry_minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 5)

    otp = PasswordResetOTP.objects.create(
        user=user,
        otp_code=otp_code,
        expires_at=timezone.now() + timedelta(minutes=expiry_minutes),
    )

    logger.info(f'OTP generated for {user.email} — expires in {expiry_minutes} min')
    return otp


def send_otp_email(user, otp_code):
    """
    Send the OTP code to the user's email.

    Uses Django's email backend — in development this falls through
    to the console backend; in production it sends via SMTP.
    """
    subject = 'StockSense — Password Reset Code'

    # Plain-text body
    plain_message = (
        f'Hello {user.first_name},\n\n'
        f'Your password reset verification code is:\n\n'
        f'    {otp_code}\n\n'
        f'This code expires in {getattr(settings, "OTP_EXPIRY_MINUTES", 5)} minutes.\n'
        f'If you did not request this, please ignore this email.\n\n'
        f'— StockSense Security Team'
    )

    # HTML body
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 40px; }}
            .container {{ max-width: 480px; margin: 0 auto; background: #141414; border: 1px solid #262626; border-radius: 12px; padding: 40px; }}
            .logo {{ font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 24px; letter-spacing: -0.5px; }}
            .otp-code {{ font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #ffffff; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px 24px; text-align: center; margin: 24px 0; font-family: 'Courier New', monospace; }}
            .message {{ color: #a0a0a0; font-size: 14px; line-height: 1.6; }}
            .footer {{ margin-top: 32px; padding-top: 16px; border-top: 1px solid #262626; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">StockSense</div>
            <p class="message">Hello {user.first_name},</p>
            <p class="message">Your password reset verification code is:</p>
            <div class="otp-code">{otp_code}</div>
            <p class="message">
                This code expires in <strong>{getattr(settings, "OTP_EXPIRY_MINUTES", 5)} minutes</strong>.<br>
                If you did not request this reset, you can safely ignore this email.
            </p>
            <div class="footer">
                &copy; StockSense Security Team
            </div>
        </div>
    </body>
    </html>
    """

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f'OTP email sent to {user.email}')
        return True
    except Exception as e:
        logger.error(f'Failed to send OTP email to {user.email}: {e}')
        # Fallback: print to console so development never blocks
        print(f'\n{"="*50}')
        print(f'  STOCKSENSE OTP — {user.email}')
        print(f'  Code: {otp_code}')
        print(f'{"="*50}\n')
        return False


def validate_otp(user, otp_code):
    """
    Validate an OTP code for the given user.

    Returns:
        (True, otp_obj)  — if the code is correct and still valid
        (False, error_str) — if validation fails
    """
    max_attempts = getattr(settings, 'OTP_MAX_ATTEMPTS', 3)

    try:
        otp = PasswordResetOTP.objects.filter(
            user=user,
            is_used=False,
        ).latest('created_at')
    except PasswordResetOTP.DoesNotExist:
        return False, 'No active OTP found. Please request a new code.'

    if otp.is_expired:
        otp.is_used = True
        otp.save(update_fields=['is_used'])
        return False, 'OTP has expired. Please request a new code.'

    if otp.attempts >= max_attempts:
        otp.is_used = True
        otp.save(update_fields=['is_used'])
        return False, 'Maximum OTP attempts exceeded. Please request a new code.'

    if otp.otp_code != otp_code:
        otp.attempts += 1
        otp.save(update_fields=['attempts'])
        remaining = max_attempts - otp.attempts
        return False, f'Invalid OTP code. {remaining} attempt(s) remaining.'

    # Success — mark as used
    otp.is_used = True
    otp.save(update_fields=['is_used'])
    return True, otp
