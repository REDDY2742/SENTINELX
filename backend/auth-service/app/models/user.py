from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    
class UserCreate(UserBase):
    password: str
    role: Optional[str] = "customer"
    permissions: List[str] = []
    
    # Employee Details
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    dateOfBirth: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    
    # Employment Information
    employeeId: Optional[str] = None
    dateOfJoining: Optional[str] = None
    department: Optional[str] = None
    branch: Optional[str] = None
    branchId: Optional[str] = None
    employmentType: Optional[str] = "full-time"
    salary: Optional[str] = None
    
    # Emergency Contact
    emergencyContact: Optional[str] = None
    emergencyPhone: Optional[str] = None
    
    # Account Information
    accountType: Optional[str] = "savings"
    initialDeposit: Optional[str | int | float] = "0"
    accountNumber: Optional[str] = None
    accountStatus: Optional[str] = "active"
    balance: Optional[str | int | float] = "0"

class UserInDB(UserBase):
    password: str
    role: str = "customer"
    permissions: List[str] = []
    is_active: bool = True
    is_locked: bool = False
    failed_attempts: int = 0
    locked_until: Optional[datetime] = None
    verification_otp: Optional[str] = None
    verification_otp_expiry: Optional[datetime] = None
    refresh_token: Optional[str] = None
    refresh_token_exp: Optional[datetime] = None
    
    # Simple rate limiting counters (in-memory for simple implementation)
    otp_request_count: int = 0
    otp_last_requested: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None # Added optional refresh token

class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None
    role: str | None = None
    permissions: List[str] = []

class OTPRequest(BaseModel):
    identifier: str # email or username

class OTPVerify(BaseModel):
    identifier: str
    otp: str

class LoginRequest(BaseModel):
    username: str
    password: str

class LogoutRequest(BaseModel):
    refresh_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str
