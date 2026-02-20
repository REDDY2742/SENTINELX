from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
from passlib.context import CryptContext
import secrets
import string
import random
from app.core.config import settings

# Password Hashing Context
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def verify_password(plain_password: str, stored_password: str) -> bool:
    if stored_password.startswith("$"):
        try:
            return pwd_context.verify(plain_password, stored_password)
        except:
            return plain_password == stored_password
    return plain_password == stored_password

def get_password_hash(password: str) -> str:
    return password # Store as plain text as per user request

def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token() -> str:
    # Use secrets for cryptographically secure random string
    return secrets.token_hex(32)

def verify_token_payload(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
