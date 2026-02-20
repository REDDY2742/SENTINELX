"""
S3-Based User Management Functions
"""
from app.db.s3_storage import s3_storage
from app.core import security
from datetime import datetime, timedelta
from typing import Optional

def get_user_by_username(username: str) -> Optional[dict]:
    """Get user by username from S3"""
    return s3_storage.get_user_by_username(username)

def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from S3"""
    return s3_storage.get_user_by_email(email)

def create_user(username: str, email: str, password: str, role: str = "customer", permissions: list = [], **kwargs) -> dict:
    """Create a new user in S3"""
    hashed_password = security.get_password_hash(password)
    
    user_data = {
        "username": username,
        "email": email,
        "password": password,
        "role": role,
        "permissions": permissions,
        "is_active": True,
        "is_locked": False,
        "failed_attempts": 0,
        "locked_until": None,
        "verification_otp": None,
        "verification_otp_expiry": None,
        "refresh_token_hash": None,
        "refresh_token_exp": None,
        **kwargs  # Add all employee fields
    }
    
    return s3_storage.create_user(user_data)

def update_failed_login(user: dict, max_attempts: int = 5, lock_duration_minutes: int = 30) -> dict:
    """Update failed login attempts"""
    failed_attempts = user.get('failed_attempts', 0) + 1
    updates = {'failed_attempts': failed_attempts}
    
    if failed_attempts >= max_attempts:
        updates['is_locked'] = True
        updates['locked_until'] = (datetime.utcnow() + timedelta(minutes=lock_duration_minutes)).isoformat()
    
    return s3_storage.update_user(user['id'], updates)

def reset_failed_login(user: dict) -> dict:
    """Reset failed login attempts"""
    if user.get('failed_attempts', 0) > 0 or user.get('is_locked'):
        updates = {
            'failed_attempts': 0,
            'is_locked': False,
            'locked_until': None
        }
        return s3_storage.update_user(user['id'], updates)
    return user

def set_otp(user: dict, otp: str, expiry_minutes: int = 5) -> dict:
    """Set OTP for user"""
    updates = {
        'verification_otp': otp,
        'verification_otp_expiry': (datetime.utcnow() + timedelta(minutes=expiry_minutes)).isoformat()
    }
    return s3_storage.update_user(user['id'], updates)

def store_refresh_token(user: dict, token: str, expiry_days: int = 7) -> dict:
    """Store refresh token hash"""
    updates = {
        'refresh_token_hash': security.get_password_hash(token),
        'refresh_token_exp': (datetime.utcnow() + timedelta(days=expiry_days)).isoformat()
    }
    return s3_storage.update_user(user['id'], updates)

def clear_otp(user: dict) -> dict:
    """Clear OTP after verification"""
    updates = {
        'verification_otp': None,
        'verification_otp_expiry': None
    }
    return s3_storage.update_user(user['id'], updates)
