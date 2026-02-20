from sqlalchemy import Column, String, Boolean, Integer, DateTime, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    role = Column(String, default="customer")
    permissions = Column(JSON, default=[]) # Storing as JSON for flexibility, or use ARRAY(String) if pure Postgres
    
    is_active = Column(Boolean, default=True)
    is_locked = Column(Boolean, default=False)
    failed_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    
    # 2FA / OTP
    verification_otp = Column(String, nullable=True)
    verification_otp_expiry = Column(DateTime, nullable=True)
    
    # Refresh Token
    refresh_token_hash = Column(String, nullable=True) # We store the hash, not the token itself
    refresh_token_exp = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "permissions": self.permissions,
            "is_active": self.is_active
        }
