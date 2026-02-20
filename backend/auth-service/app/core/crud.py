from sqlalchemy.orm import Session
from app.models.sql_user import User
from app.models.user import UserCreate
from app.core import security
from datetime import datetime, timedelta

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, role: str = "customer", permissions: list = []):
    hashed_password = security.get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=role,
        permissions=permissions,
        created_at=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_failed_login(db: Session, user: User, max_attempts: int = 5, lock_duration_minutes: int = 30):
    user.failed_attempts = (user.failed_attempts or 0) + 1
    if user.failed_attempts >= max_attempts:
        user.is_locked = True
        user.locked_until = datetime.utcnow() + timedelta(minutes=lock_duration_minutes)
    db.commit()
    db.refresh(user)
    return user

def reset_failed_login(db: Session, user: User):
    if user.failed_attempts > 0 or user.is_locked:
        user.failed_attempts = 0
        user.is_locked = False
        user.locked_until = None
        db.commit()
        db.refresh(user)
    return user

def set_otp(db: Session, user: User, otp: str, expiry_minutes: int = 5):
    user.verification_otp = otp
    user.verification_otp_expiry = datetime.utcnow() + timedelta(minutes=expiry_minutes)
    db.commit()

def store_refresh_token(db: Session, user: User, token: str, expiry_days: int = 7):
    # Store hash of refresh token
    user.refresh_token_hash = security.get_password_hash(token)
    user.refresh_token_exp = datetime.utcnow() + timedelta(days=expiry_days)
    db.commit()
