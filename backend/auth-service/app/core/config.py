from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SentinelX Auth Service"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    
    # JWT Settings
    SECRET_KEY: str = "SUPER_SECRET_CHANGE_THIS_IN_PROD_1234567890"  # Environment variable overrides this
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Security
    PWD_MIN_LENGTH: int = 12
    Require_2FA: bool = False  # Disabled for now - enable after creating OTP page
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # AWS RDS / Database Configuration
    DB_HOST: str = "sentinelx-db.cluster-xxxxxxxxxxxx.us-east-1.rds.amazonaws.com"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "securepassword"
    DB_NAME: str = "sentinelx_auth"
    
    # AWS General Configuration (S3, etc)
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None

    # SMTP / Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: str = "SentinelX <noreply@sentinelx.com>"
    EMAIL_ENABLED: bool = True

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    class Config:
        env_file = ".env"
        extra = "ignore" # Important to allow extra fields in env file if needed

settings = Settings()
