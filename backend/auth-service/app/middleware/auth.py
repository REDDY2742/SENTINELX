from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core import security
from app.core.config import settings
from app.models.user import TokenPayload, UserInDB
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock In-Memory User Database
fake_users_db = {} 

# Helper to verify Token payload
def get_current_user_token(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.verify_token_payload(token)
        username: str = payload.get("sub")
        role: str = payload.get("role")
        permissions: list = payload.get("permissions", [])
        if username is None:
            raise credentials_exception
        token_data = TokenPayload(sub=username, role=role, permissions=permissions)
    except JWTError:
        raise credentials_exception
    return token_data

# Role Dependency
class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: TokenPayload = Depends(get_current_user_token)):
        if user.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return user

# Permission Dependency (Granular)
class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission
        
    def __call__(self, user: TokenPayload = Depends(get_current_user_token)):
        if self.required_permission not in user.permissions:
             raise HTTPException(status_code=403, detail="Missing required permission")
        return user
