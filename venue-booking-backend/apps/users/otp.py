import logging
import random
import string

from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

OTP_PREFIX = "otp:"
OTP_COUNT_PREFIX = "otp_count:"


def generate_otp() -> str:
    """Generate a random numeric OTP of configured length."""
    length = getattr(settings, "OTP_LENGTH", 6)
    return "".join(random.choices(string.digits, k=length))


def send_otp(phone_number: str) -> dict:
    """
    Generate OTP, store in Redis, and mock-send via console logging.
    Returns dict with success status. Enforces rate limiting (3 per 10 min).
    """
    # Bypass for test phone numbers — use fixed OTP "000000"
    bypass_phones = getattr(settings, "OTP_TEST_BYPASS_PHONES", [])
    if phone_number in bypass_phones:
        otp_key = f"{OTP_PREFIX}{phone_number}"
        cache.set(otp_key, "000000", timeout=86400)  # 24h expiry
        print(f"\n{'=' * 50}")
        print(f"🔓  TEST BYPASS for {phone_number}: OTP is 000000")
        print(f"{'=' * 50}\n")
        return {"success": True}

    count_key = f"{OTP_COUNT_PREFIX}{phone_number}"
    current_count = cache.get(count_key, 0)

    if current_count >= 3:
        return {"success": False, "error": "Rate limit exceeded. Try again later."}

    otp = generate_otp()
    otp_key = f"{OTP_PREFIX}{phone_number}"
    expiry = getattr(settings, "OTP_EXPIRY_SECONDS", 300)

    # Store OTP in Redis
    cache.set(otp_key, otp, timeout=expiry)

    # Increment rate limit counter (10-minute window)
    if current_count == 0:
        cache.set(count_key, 1, timeout=600)
    else:
        cache.incr(count_key)

    # Mock SMS – log to console
    logger.info("=" * 50)
    logger.info(f"📱  OTP for {phone_number}: {otp}")
    logger.info("=" * 50)
    print(f"\n{'=' * 50}")
    print(f"📱  OTP for {phone_number}: {otp}")
    print(f"{'=' * 50}\n")

    return {"success": True}


def verify_otp(phone_number: str, otp: str) -> bool:
    """Verify the OTP against the value stored in Redis."""
    otp_key = f"{OTP_PREFIX}{phone_number}"
    stored_otp = cache.get(otp_key)

    if stored_otp and stored_otp == otp:
        cache.delete(otp_key)  # one-time use
        return True
    return False
