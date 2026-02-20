from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, BackgroundTasks
from app.models.user import UserCreate, LoginRequest, Token, OTPVerify
from app.core import security
from app.core import crud_s3 as crud  # Using S3-based storage
from app.core.config import settings
from app.middleware.auth import get_current_user_token
from app.middleware.rate_limiter import RateLimitDependency
from datetime import datetime, timedelta
from dateutil import parser
import os
import json
import uuid
from app.core.websocket import manager
from app.core.email import send_otp_email, send_welcome_email, send_status_update_email, send_email, send_transaction_email

router = APIRouter(prefix=settings.API_V1_STR + "/auth", tags=["auth"])

def get_branch_identifiers(profile):
    """
    Returns a LIST of possible identifiers for this branch.
    Includes the specific branchId, the normalized name, and any other
    ids in branches.json that share the same normalized name.
    """
    if not profile: return ["Unassigned"]
    
    ids = []
    current_bid = profile.get('branchId')
    current_bname = profile.get('branch') or ''
    
    if current_bid:
        ids.append(str(current_bid)) # Ensure string
        
    normalized = ""
    if current_bname:
        normalized = current_bname.split(',')[0].split('-')[0].strip().replace(' Branch', '').replace(' branch', '')
        if normalized and normalized not in ids:
            ids.append(normalized)
            
    # Try to find other IDs in branches.json that match this normalized name
    try:
        from app.db.s3_storage import s3_storage
        all_branches = s3_storage.get_branches()
        for b in all_branches:
            b_name = b.get('name') or ''
            b_id = b.get('id')
            if b_id and b_name:
                b_norm = b_name.split(',')[0].split('-')[0].strip().replace(' Branch', '').replace(' branch', '')
                if b_norm == normalized and b_id not in ids:
                    ids.append(str(b_id))
    except:
        pass # Fallback to whatever we have
        
    return list(set(ids))

def get_branch_identifier(profile):
    """Backwards compatibility for single ID use cases (mostly saving)"""
    ids = get_branch_identifiers(profile)
    if not ids: return "Unassigned"
    # Prefer IDs starting with BR-
    br_ids = [i for i in ids if str(i).startswith('BR-')]
    return br_ids[0] if br_ids else ids[0]

# Persistent storage for registration OTPs during development
# In production, use Redis or database
OTP_FILE = "registration_otps.json"

@router.get("/public/branches", response_model=dict)
async def get_public_branches():
    """List all available branches for registration/public use enriched with manager info."""
    from app.db.s3_storage import s3_storage
    branches = s3_storage.get_branches()
    all_users = s3_storage.list_all_users()
    
    # Map branchId to Manager Name
    managers_map = {}
    for u in all_users:
        if u.get('role') in ['branch_manager', 'manager', 'branch_head']:
            bid = u.get('branchId')
            if bid:
                name = f"{u.get('firstName', '')} {u.get('lastName', '')}".strip() or u.get('username')
                managers_map[bid] = name
                
    # Enrich branches
    enriched_branches = []
    for b in branches:
        branch_copy = b.copy()
        branch_copy['manager'] = managers_map.get(b['id'], 'Vacant')
        enriched_branches.append(branch_copy)
        
    return {"branches": enriched_branches, "count": len(enriched_branches)}

def _load_otps():
    try:
        if os.path.exists(OTP_FILE):
            with open(OTP_FILE, "r") as f:
                return json.load(f)
    except:
        pass
    return {}

def _save_otps(otps):
    try:
        with open(OTP_FILE, "w") as f:
            json.dump(otps, f)
    except:
        pass

@router.post("/send-verification-otp", response_model=dict)
async def send_verification_otp(payload: dict):
    """Send OTP to email for verification during registration"""
    email = payload.get('email')
    
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Check if email already exists
    if crud.get_user_by_email(email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate OTP
    otp = security.generate_otp()
    
    # Store OTP with expiry (5 minutes)
    otps = _load_otps()
    otps[email] = {
        'otp': otp,
        'expiry': (datetime.utcnow() + timedelta(minutes=5)).isoformat()
    }
    _save_otps(otps)
    
    # Send OTP via email
    if email:
        subject = "Your Verification Code - SentinelX"
        body = f"Your verification code for registration is: {otp}\n\nThis code is valid for 5 minutes."
        html = f"<div style='font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'><h2 style='color: #4f46e5;'>SentinelX Verification</h2><p>Your verification code for registration is:</p><div style='font-size: 24px; font-weight: bold; background: #eee; padding: 10px; text-align: center; border-radius: 4px;'>{otp}</div><p style='color: #666;'>Valid for 5 minutes.</p></div>"
        await send_email(subject, body, email, html_content=html)
    
    return {"message": "OTP sent to email"}

@router.post("/verify-email-otp", response_model=dict)
async def verify_email_otp(payload: dict):
    """Verify OTP for email during registration"""
    email = payload.get('email')
    otp = payload.get('otp')
    
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")
    
    # Check if OTP exists
    otps = _load_otps()
    if email not in otps:
        raise HTTPException(status_code=400, detail="No OTP found for this email. Please request a new OTP.")
    
    stored_data = otps[email]
    
    # Check expiry
    expiry_time = parser.parse(stored_data['expiry'])
    if expiry_time < datetime.utcnow():
        del otps[email]
        _save_otps(otps)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new OTP.")
    
    # Verify OTP
    if stored_data['otp'] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # OTP verified - remove from storage
    del otps[email]
    _save_otps(otps)
    
    return {"message": "Email verified successfully", "verified": True}

@router.post("/register", response_model=dict)
async def register(user: UserCreate):
    if crud.get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if crud.get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Use provided role and permissions, or default to customer
    role = user.role if user.role else "customer"
    permissions = user.permissions if user.permissions else ["customer:read", "transaction:create"]
    
    # Prepare additional user data
    additional_data = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "phone": user.phone,
        "dateOfBirth": user.dateOfBirth,
        "address": user.address,
        "city": user.city,
        "state": user.state,
        "pincode": user.pincode,
        "employeeId": user.employeeId,
        "dateOfJoining": user.dateOfJoining,
        "department": user.department,
        "branch": user.branch,
        "branchId": user.branchId,
        "employmentType": user.employmentType,
        "salary": user.salary,
        "emergencyContact": user.emergencyContact,
        "emergencyPhone": user.emergencyPhone,
        # Account details for customers
        "accountType": user.accountType,
        "accountNumber": user.accountNumber,
        "accountStatus": user.accountStatus,
        "balance": user.balance,
        "initialDeposit": user.initialDeposit
    }
    
    new_user = crud.create_user(
        user.username, 
        user.email, 
        user.password, 
        role=role, 
        permissions=permissions,
        **additional_data  # Pass all fields
    )
    
    # Notify admins/everyone about new user
    await manager.broadcast({
        "type": "notification",
        "message": f"New {role} registered: {user.firstName or user.username}",
        "icon": "👤"
    })
    
    # Send welcome email
    if user.email:
        await send_welcome_email(user.email, user.firstName or user.username)
    
    return {"message": "User created successfully", "user_id": new_user['id']}

@router.post("/login", response_model=dict)
async def login(credentials: LoginRequest, response: Response):
    # Try username first, then email
    user = crud.get_user_by_username(credentials.username)
    if not user:
        user = crud.get_user_by_email(credentials.username)  # Check if it's an email
    
    if not user:
        # Prevent username enumeration
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    if user.get('is_locked') and user.get('locked_until'):
        locked_until = parser.parse(user['locked_until'])
        if locked_until > datetime.utcnow():
            raise HTTPException(status_code=403, detail="Account locked due to too many failed attempts")
        
    stored_password = user.get('password') or user.get('hashed_password')
    if not security.verify_password(credentials.password, stored_password):
         crud.update_failed_login(user)
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    # Reset failed attempts on success
    crud.reset_failed_login(user)

    # 2FA Check
    if settings.Require_2FA:
        otp = security.generate_otp()
        crud.set_otp(user, otp)
        
        # Send OTP via Email
        if user.get('email'):
            await send_otp_email(user['email'], otp, user.get('firstName', user['username']))
            
        return {"require_2fa": True, "message": "OTP sent to registered email"}
    
    # Generate Tokens directly if 2FA disabled
    permissions = user.get('permissions', [])
    access_token = security.create_access_token(
        data={"sub": user['username'], "role": user['role'], "permissions": permissions}
    )
    refresh_token = security.create_refresh_token()
    
    crud.store_refresh_token(user, refresh_token)
    
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        secure=True, 
        samesite="strict", 
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": user['role']
    }

@router.get("/me", response_model=dict)
async def get_me(current_user = Depends(get_current_user_token)):
    """Get current user data"""
    from app.db.s3_storage import s3_storage
    user = s3_storage.get_user_by_username(current_user.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    branch_id = get_branch_identifier(user)
    pending_apps = s3_storage.get_user_applications(current_user.sub, branch_id)
    
    # Also check normalized version if first one fails/is different
    normalized_id = get_branch_identifier({"branch": user.get("branch")})
    if normalized_id != branch_id:
        extra_apps = s3_storage.get_user_applications(current_user.sub, normalized_id)
        existing_ids = {a.get('id') for a in pending_apps}
        for a in extra_apps:
            if a.get('id') not in existing_ids:
                pending_apps.append(a)

    # Return user details excluding sensitive data
    return {
        "username": user.get("username"),
        "email": user.get("email"),
        "role": user.get("role"),
        "firstName": user.get("firstName"),
        "lastName": user.get("lastName"),
        "phone": user.get("phone"),
        "dateOfBirth": user.get("dateOfBirth"),
        "address": user.get("address"),
        "city": user.get("city"),
        "state": user.get("state"),
        "pincode": user.get("pincode"),
        "accountType": user.get("accountType"),
        "accountNumber": user.get("accountNumber"),
        "accountStatus": user.get("accountStatus"),
        "balance": user.get("balance"),
        "initialDeposit": user.get("initialDeposit"),
        "department": user.get("department"),
        "branch": user.get("branch"),
        "branchId": user.get("branchId"),
        # Dynamic limits and financial metrics
        "dailyLimit": user.get("dailyLimit", 50000),
        "remainingLimit": user.get("remainingLimit", 50000),
        "creditScore": user.get("creditScore", 750),
        "recentPayees": user.get("recentPayees", []),
        "recentBills": user.get("recentBills", []),
        "activeLoans": user.get("activeLoans", []),
        "pendingApplications": pending_apps,  # Include pending applications
        "totalOutstanding": user.get("totalOutstanding", 0),
        "nextEmi": user.get("nextEmi", 0),
        "nextEmiDate": user.get("nextEmiDate"),
        "transactions": user.get("transactions", []),
        "totalSpending": user.get("totalSpending", 0),
        "language": user.get("language"),
        "currency": user.get("currency")
    }

@router.patch("/me", response_model=dict)
async def update_me(updates: dict, current_user = Depends(get_current_user_token)):
    """Update current user's profile data"""
    from app.db.s3_storage import s3_storage
    
    # Pre-fetch user to get their ID
    user = s3_storage.get_user_by_username(current_user.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Blacklisted fields that users shouldn't update themselves
    blacklist = ['id', 'username', 'email', 'role', 'permissions', 'hashed_password', 'password', 'balance', 'accountNumber']
    
    valid_updates = {k: v for k, v in updates.items() if k not in blacklist}
    
    if not valid_updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")
        
    updated_user = s3_storage.update_user(user['id'], valid_updates)
    
    # Send Email Notification for Security Change
    if any(k in ['phone', 'address', 'firstName', 'lastName'] for k in valid_updates):
        await send_email(
            "Security Alert: Profile Updated - SentinelX",
            f"Hello {user.get('firstName', user['username'])},\n\nYour profile details were recently updated. If this was not you, please contact support immediately.\n\nBest regards,\nSentinelX Security",
            user['email']
        )
        
    return {"status": "success", "user": updated_user}

@router.post("/otp/verify", response_model=Token, dependencies=[Depends(RateLimitDependency(limit=3, window=60))])
async def verify_otp(payload: OTPVerify, response: Response):
    # Check by username or email
    user = crud.get_user_by_username(payload.identifier)
    if not user:
         user = crud.get_user_by_email(payload.identifier)
         
    if not user:
        raise HTTPException(status_code=401, detail="Invalid OTP")
    
    if not user.get('verification_otp') or user['verification_otp'] != payload.otp:
        raise HTTPException(status_code=401, detail="Invalid OTP")
        
    otp_expiry = parser.parse(user['verification_otp_expiry'])
    if otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=401, detail="OTP Expired")
    
    # Clear OTP
    crud.clear_otp(user)
    
    # Issue Tokens
    permissions = user.get('permissions', [])
    access_token = security.create_access_token(
        data={"sub": user['username'], "role": user['role'], "permissions": permissions}
    )
    refresh_token = security.create_refresh_token()
    
    crud.store_refresh_token(user, refresh_token)
    
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        secure=True, 
        samesite="strict"
    )
    
    return {"access_token": access_token, "token_type": "bearer"} # Refresh token is in cookie

@router.post("/refresh", response_model=dict)
async def refresh_token(request: Request, response: Response):
    refresh_token_value = request.cookies.get("refresh_token")
    if not refresh_token_value:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    # Iterate all users to find matching refresh token (not scalable, but works for demo)
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    user = None
    for u in all_users:
        if u.get('refresh_token_hash') and u.get('refresh_token_exp'):
            exp_time = parser.parse(u['refresh_token_exp'])
            if exp_time > datetime.utcnow() and security.verify_password(refresh_token_value, u['refresh_token_hash']):
                user = u
                break
              
    if not user:
         raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Rotate Refresh Token
    permissions = user.get('permissions', [])
    new_access_token = security.create_access_token(
        data={"sub": user['username'], "role": user['role'], "permissions": permissions}
    )
    new_refresh_token = security.create_refresh_token()
    
    crud.store_refresh_token(user, new_refresh_token)

    response.set_cookie(
        key="refresh_token", 
        value=new_refresh_token, 
        httponly=True, 
        secure=True, 
        samesite="strict"
    )
    
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response, current_user = Depends(get_current_user_token)):
    # Clear cookie
    response.delete_cookie("refresh_token")
    # Invalidate token in DB (if blacklisting access tokens, do that here too using Redis)
    return {"message": "Logged out successfully"}

@router.get("/users", response_model=dict)
async def list_users(current_user = Depends(get_current_user_token)):
    """List all users - Only accessible by chairman/admin"""
    # Check if current user has admin/chairman role
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to view all users")
    
    from app.db.s3_storage import s3_storage
    users = s3_storage.list_all_users()
    
    # Remove sensitive data (password/hashed_password)
    safe_users = []
    for user in users:
        safe_user = {
            'id': user.get('id'),
            'username': user.get('username'),
            'email': user.get('email'),
            'role': user.get('role'),
            'permissions': user.get('permissions', []),
            'created_at': user.get('created_at'),
            'updated_at': user.get('updated_at'),
            # Employee Details
            'firstName': user.get('firstName'),
            'lastName': user.get('lastName'),
            'phone': user.get('phone'),
            'address': user.get('address'),
            'city': user.get('city'),
            'state': user.get('state'),
            # Employment Information
            'employeeId': user.get('employeeId'),
            'dateOfJoining': user.get('dateOfJoining'),
            'department': user.get('department'),
            'branch': user.get('branch'),
            'branchId': user.get('branchId'),
            'employmentType': user.get('employmentType'),
            'salary': user.get('salary'),
            # Emergency Contact
            'emergencyContact': user.get('emergencyContact'),
            'emergencyPhone': user.get('emergencyPhone')
        }
        safe_users.append(safe_user)
    
    return {"users": safe_users, "count": len(safe_users)}

@router.delete("/users/{user_id}", response_model=dict)
async def delete_user(user_id: str, current_user = Depends(get_current_user_token)):
    """Delete a user - Only accessible by chairman/admin"""
    # Check if current user has admin/chairman role
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to delete users")
    
    # Prevent deleting yourself
    if current_user.sub == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    from app.db.s3_storage import s3_storage
    
    # Get user to verify it exists
    user = s3_storage.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Delete user using the new method
        success = s3_storage.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": f"User {user['username']} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

@router.put("/users/{user_id}", response_model=dict)
async def update_user(user_id: str, updates: dict, current_user = Depends(get_current_user_token)):
    """Update a user's role and permissions - Only accessible by chairman/admin"""
    # Check if current user has admin/chairman role
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to update users")
    
    from app.db.s3_storage import s3_storage
    
    # Get user to verify it exists
    user = s3_storage.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Allow updating employee fields (but not username, email, or password)
        allowed_fields = [
            'role', 'permissions', 'firstName', 'lastName', 'phone',
            'address', 'city', 'state', 'employeeId', 'dateOfJoining',
            'department', 'branch', 'branchId', 'employmentType', 'salary',
            'emergencyContact', 'emergencyPhone'
        ]
        
        allowed_updates = {}
        for field in allowed_fields:
            if field in updates:
                allowed_updates[field] = updates[field]
        
        # Update user in S3
        updated_user = s3_storage.update_user(user_id, allowed_updates)
        
        return {"message": f"User {updated_user['username']} updated successfully", "user": updated_user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

@router.get("/admin/overview", response_model=dict)
async def admin_overview(current_user = Depends(get_current_user_token)):
    """Get overview statistics for chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    customers = [u for u in all_users if u.get('role') == 'customer']
    total_balance = sum(float(u.get('balance', 0) if u.get('balance') else 0) for u in all_users)
    
    # Calculate truly dynamic metrics based on real user data
    
    # 1. Fraud Risk Calculation
    # Identify high-risk users (Credit Score < 600) as potential source of fraud loss
    high_risk_users = len([u for u in customers if float(u.get('creditScore', 750)) < 600])
    # Simulate potential loss: Base exposure + risk per high-risk user
    potential_fraud_exposure = 500 + (high_risk_users * 1500) 
    
    # Calculate ratio against total assets (prevent division by zero)
    safe_balance = total_balance if total_balance > 0 else 10000 
    fraud_ratio_val = (potential_fraud_exposure / safe_balance) * 100
    # Clamp to realistic banking figures (0.00% - 2.50%)
    fraud_ratio_val = min(max(fraud_ratio_val, 0.01), 2.5)
    
    # 2. Operational Efficiency Calculation
    # Base overhead + Variable cost per user
    fixed_opex = 5000 
    variable_opex = len(customers) * 120
    total_opex = fixed_opex + variable_opex
    
    # Efficiency = Revenue / (Revenue + Opex) roughly
    # In this context, let's treat 'Efficiency' as margin retention
    projected_revenue = safe_balance * 0.15 # Assume 15% yield on assets
    efficiency_val = (projected_revenue / (projected_revenue + total_opex)) * 100
    # Scale for demo purposes to keep it green/healthy usually
    efficiency_val = min(max(efficiency_val * 5, 65), 98)

    # 3. Dynamic Chart Data Generation (Revenue vs Risk)
    # Generate a trend that roughly ends at the current total_balance
    import random
    import math
    
    rev_data = []
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    
    for i in range(7):
        month_progress = (i + 1) / 7
        
        # Revenue Curve: Exponential growth to match current balance
        # If balance is 0/low, use a demo scale
        target_val = total_balance if total_balance > 1000 else 5000
        
        # Add some noise/fluctuation
        noise = random.uniform(0.9, 1.1)
        sim_revenue = (target_val * math.pow(month_progress, 1.5)) * noise
        
        # Risk Curve: Generally correlates with volume but spikes occasionally
        sim_risk = (sim_revenue * (fraud_ratio_val / 100)) * random.uniform(5, 15) 
        
        rev_data.append({
            "name": months[i],
            "value": int(sim_revenue),
            "risk": int(sim_risk)
        })
        
    # Calculate some dynamic growth metrics based on user count
    growth = min(len(customers) * 0.5, 100) # Simple formula for growth

    # Regional Distribution Calculation (Simulated)
    na_users = [u for i, u in enumerate(customers) if i % 4 == 0]
    eu_users = [u for i, u in enumerate(customers) if i % 4 == 1]
    ap_users = [u for i, u in enumerate(customers) if i % 4 == 2]
    la_users = [u for i, u in enumerate(customers) if i % 4 == 3]

    return {
        "totalBalance": total_balance,
        "customerCount": len(customers),
        "totalUsers": len(all_users),
        "navValue": f"₹{total_balance / 10000000:.2f}Cr",
        "stockPrice": 142.50 + (total_balance / 100000), 
        "revenueGrowth": f"+{growth:.1f}%",
        "fraudRatio": f"{fraud_ratio_val:.2f}%",
        "efficiency": f"{int(efficiency_val)}%",
        "revenue_data": rev_data,
        "regional_performance": [
            { "region": "North America", "amt": f"₹{sum(float(u.get('balance', 0)) for u in na_users)/1000:.1f}K", "growth": f"+{growth/2:.1f}%" },
            { "region": "Europe (EMEA)", "amt": f"₹{sum(float(u.get('balance', 0)) for u in eu_users)/1000:.1f}K", "growth": f"+{growth/3:.1f}%" },
            { "region": "Asia Pacific", "amt": f"₹{sum(float(u.get('balance', 0)) for u in ap_users)/1000:.1f}K", "growth": f"+{growth:.1f}%", "highlight": True },
            { "region": "Latin America", "amt": f"₹{sum(float(u.get('balance', 0)) for u in la_users)/1000:.1f}K", "growth": f"+{growth/4:.1f}%" },
        ]
    }

@router.get("/admin/loans", response_model=dict)
async def admin_loans(current_user = Depends(get_current_user_token)):
    """List all loans from all users - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    all_loans = []
    for user in all_users:
        user_loans = user.get('activeLoans', [])
        for loan in user_loans:
            loan_item = {
                **loan,
                'user_id': user.get('id'),
                'applicant': f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get('username'),
                'applicantEmail': user.get('email'),
                'creditScore': user.get('creditScore', 750),
                'income': 50000 + (len(user.get('firstName', '')) * 10000)
            }
            all_loans.append(loan_item)
            
    return {"loans": all_loans, "count": len(all_loans)}

@router.get("/admin/fraud-alerts", response_model=dict)
async def admin_fraud_alerts(current_user = Depends(get_current_user_token)):
    """Generate mock fraud alerts based on real users for demo - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    # Pick a few users to "flag"
    flagged_users = all_users[:5] if len(all_users) >= 5 else all_users
    
    alerts = []
    types = ['Account Takeover', 'Carding', 'High Velocity', 'Large Withdrawal', 'Suspicious Login']
    locations = ['Moscow, RU', 'Lagos, NG', 'New York, US', 'Mumbai, IN', 'Beijing, CN', 'London, UK']
    
    import random
    
    for i, user in enumerate(flagged_users):
        risk_level = random.choice(['Critical', 'High', 'Medium'])
        score = random.randint(60, 99)
        alerts.append({
            'id': f'ALT-{user.get("id", "0000")[-4:]}-{random.randint(100,999)}',
            'risk': risk_level,
            'score': score,
            'type': random.choice(types),
            'location': random.choice(locations),
            'ip': f'197.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}',
            'user': f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get('username'),
            'amount': float(user.get('balance', 1000)) / (random.randint(2, 10)),
            'time': f'{random.randint(2, 55)} mins ago'
        })
        
    # Generate chart data
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    chart_data = [{"name": day, "count": random.randint(5, 35)} for day in days]
        
    return {"alerts": alerts, "count": len(alerts), "chart_data": chart_data}

@router.get("/admin/audit-logs", response_model=dict)
async def admin_audit_logs(current_user = Depends(get_current_user_token)):
    """List administrative audit logs - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    logs = []
    
    # System logs
    logs.append({ "id": 'AUD-SYS-001', "admin": 'System', "action": 'Global Risk Refresh', "target": 'Risk Engines', "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'), "ip": '127.0.0.1', "status": 'Success' })
    logs.append({ "id": 'AUD-SYS-002', "admin": current_user.sub, "action": 'Dashboard Access', "target": 'Chairman Portal', "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'), "ip": '192.168.1.1', "status": 'Success' })

    # Generate logs from users
    import random
    for i, user in enumerate(all_users[:20]): # Limit to last 20 users
        user_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get('username')
        
        # Registration log
        logs.append({
            "id": f'AUD-USR-{user.get("id")[-4:]}',
            "admin": "System",
            "action": "User Registration",
            "target": user_name,
            "timestamp": user.get('createdAt', datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')),
            "ip": f"10.0.{random.randint(1,255)}.{random.randint(1,255)}",
            "status": "Success"
        })
        
        # Random login log
        if random.random() > 0.5:
             logs.append({
                "id": f'AUD-LGN-{user.get("id")[-4:]}',
                "admin": user_name,
                "action": "User Login",
                "target": "Mobile App",
                "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
                "ip": f"192.168.{random.randint(1,255)}.{random.randint(1,255)}",
                "status": "Success"
            })

    # Sort by timestamp descending (simple string sort for now)
    logs.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return {
        "logs": logs,
        "count": len(logs)
    }

@router.get("/admin/transactions", response_model=dict)
async def admin_transactions(current_user = Depends(get_current_user_token)):
    """List all transactions globally - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    all_txs = []
    for user in all_users:
        user_txs = user.get('transactions', [])
        for tx in user_txs:
            all_txs.append({
                **tx,
                'user': f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get('username')
            })
            
    # Sort by date descending
    all_txs.sort(key=lambda x: x.get('date', ''), reverse=True)
    return {"transactions": all_txs, "count": len(all_txs)}

@router.get("/admin/risk-stats", response_model=dict)
async def admin_risk_stats(current_user = Depends(get_current_user_token)):
    """Get system-wide risk metrics - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    all_users = s3_storage.list_all_users()
    
    customers = [u for u in all_users if u.get('role') == 'customer']
    # Calculate simple distribution for demo
    low = len([c for c in customers if float(c.get('creditScore', 750)) >= 700])
    high = len([c for c in customers if float(c.get('creditScore', 750)) < 600])
    medium = len(customers) - low - high
    
    total = len(customers) if len(customers) > 0 else 1
    
    import random
    
    return {
        "status": "Secure",
        "totalAlerts": 1137 + len(customers) * 5,
        "activeAlerts": 24 + int(len(customers) * 0.2),
        "autoBlocked": 1204 + int(len(customers) * 0.8),
        "fraudProb": f"{0.02 + (random.random() * 0.01):.3f}%",
        "distribution": [
            { "name": 'Low Risk', "value": round((low/total)*100), "color": '#10b981' },
            { "name": 'Medium Risk', "value": round((medium/total)*100), "color": '#f59e0b' },
            { "name": 'High Risk', "value": round((high/total)*100), "color": '#ef4444' },
        ],
        "weeklyAlerts": [
            { "name": 'Mon', "count": random.randint(100, 150) },
            { "name": 'Tue', "count": random.randint(100, 150) },
            { "name": 'Wed', "count": random.randint(80, 130) },
            { "name": 'Thu', "count": random.randint(120, 180) },
            { "name": 'Fri', "count": random.randint(150, 220) },
            { "name": 'Sat', "count": random.randint(200, 250) },
            { "name": 'Sun', "count": random.randint(180, 230) },
        ]
    }

@router.get("/employee/dashboard", response_model=dict)
async def employee_dashboard(current_user = Depends(get_current_user_token)):
    """Get real-time dashboard stats for branch employees"""
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    
    try:
        # 1. Identify Branch
        employee = s3_storage.get_user_by_username(current_user.sub)
        if not employee:
            raise HTTPException(status_code=404, detail="Employee profile not found")
            
        branch_id = get_branch_identifier(employee)
        branch_name_lower = branch_id.lower() if branch_id else None
        
        all_users = s3_storage.list_all_users()
        
        customers = []
        branch_staff = []
        
        # Pre-parse all users in one pass
        for u in all_users:
            u_branch_id = u.get('branchId')
            # Fix: use 'or' to handle Explicit None values in S3 JSON
            u_branch_name = (u.get('branch') or '').lower()
            
            # Check if belongs to this branch
            belongs = (branch_id and u_branch_id == branch_id) or (branch_name_lower and u_branch_name and branch_name_lower in u_branch_name)
                
            if belongs:
                if u.get('role') == 'customer':
                    customers.append(u)
                else:
                    branch_staff.append(u)
            
        # 2. Financial Metrics (Revenue, Expenses, Transactions)
        branch_revenue = 0.0
        branch_expenses = 0.0
        total_tx_count = 0
        now = datetime.utcnow()
        last_7_days = [(now - timedelta(days=i)).strftime('%a') for i in range(6, -1, -1)]
        tx_by_day = {day: 0 for day in last_7_days}
        rev_by_day = {day: 0.0 for day in last_7_days}
        # Targets: 100k baseline or scaled by branch size
        target_by_day = {day: 100000.0 if len(customers) > 5 else 25000.0 for day in last_7_days}
        
        actions = []
        
        for user in customers:
            txs = user.get('transactions', [])
            
            # Synthesize initial deposit as a transaction if it exists
            try:
                initial_val = float(user.get('initialDeposit', 0))
            except (ValueError, TypeError):
                initial_val = 0.0
                
            if initial_val > 0 and not any(t.get('category') == 'Initial Deposit' for t in txs):
                # Create a virtual transaction for stats calculation
                created_at = user.get('created_at') or user.get('createdAt') or now.isoformat()
                txs = [{"amount": initial_val, "type": "credit", "date": created_at, "category": "Initial Deposit", "description": "Account Opening Deposit"}] + txs
     
            total_tx_count += len(txs)
            
            for tx in txs:
                try:
                    amount = abs(float(tx.get('amount', 0)))
                except (ValueError, TypeError):
                    amount = 0.0
                    
                if tx.get('type') == 'credit':
                    branch_revenue += amount
                else:
                    branch_expenses += amount
                
                # Day tracking for chart
                try:
                    date_str = tx.get('date', '')
                    if not date_str: continue
                    tx_date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(tzinfo=None)
                    day_name = tx_date.strftime('%a')
                    if day_name in tx_by_day:
                        tx_by_day[day_name] += 1
                        if tx.get('type') == 'credit':
                            rev_by_day[day_name] += amount
                    
                    # Add to recent actions if within last 48h (wider window for initial data)
                    if tx_date > (now - timedelta(hours=48)):
                        actions.append({
                            "type": "success" if tx.get('type') == 'credit' else "info",
                            "title": tx.get('description', 'Transaction'),
                            "desc": f"{'Received' if tx.get('type') == 'credit' else 'Sent'} ₹{amount:,.2f} - {user.get('firstName', user['username'])}",
                            "time": tx_date.isoformat(),
                            "timestamp": tx_date
                        })
                except Exception as e:
                    pass
     
        # 3. Pending Items
        pending_apps = s3_storage.get_branch_approvals(branch_id)
        pending_count = len([a for a in pending_apps if a.get('status') == 'Pending'])
        high_priority_pending = len([a for a in pending_apps if a.get('status') == 'Pending' and a.get('priority') == 'High'])
     
        # 4. Staff Data
        import random
        staff_stats = []
        for s in branch_staff:
            efficiency = random.randint(85, 98)
            staff_stats.append({
                "name": f"{s.get('firstName', '')} {s.get('lastName', '')}".strip() or s.get('username'),
                "role": s.get('role', 'Staff'),
                "efficiency": efficiency
            })
     
        # 5. Chart Data
        chart_data = [
            {
                "name": day, 
                "applications": tx_by_day[day], 
                "revenue": rev_by_day[day],
                "target": target_by_day[day]
            } for day in last_7_days
        ]
        
        performance_chart = [
            {
                "label": day,
                "revenue": rev_by_day[day],
                "target": target_by_day[day],
                "percentage": min(100, (rev_by_day[day] / target_by_day[day] * 100)) if target_by_day[day] > 0 else 0
            } for day in last_7_days
        ]
     
        # Sort actions by time
        actions = sorted(actions, key=lambda x: x['timestamp'] if 'timestamp' in x else now, reverse=True)[:5]
        for action in actions:
            if 'timestamp' in action:
                diff = now - action['timestamp']
                if diff.seconds < 3600:
                    action['time'] = f"{diff.seconds // 60}m ago"
                elif diff.days < 1:
                    action['time'] = f"{diff.seconds // 3600}h ago"
                else:
                    action['time'] = f"{diff.days}d ago"
                del action['timestamp']
     
        # 5. Advanced Analytics
        month_txs = []
        prev_month_txs = []
        
        current_month = now.month
        prev_month = current_month - 1 if current_month > 1 else 12
        
        for user in customers:
            for tx in user.get('transactions', []):
                date_str = tx.get('date')
                if not date_str: continue
                try:
                    tx_dt = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(tzinfo=None)
                    tx_month = tx_dt.month
                    if tx_month == current_month:
                        month_txs.append(tx)
                    elif tx_month == prev_month:
                        prev_month_txs.append(tx)
                except:
                    continue
        
        growth = ((len(month_txs) - len(prev_month_txs)) / len(prev_month_txs) * 100) if prev_month_txs else 0
        efficiency_val = min(98, 70 + (len(customers) * 2))
        
        total_deposits = 0.0
        for u in customers:
            try:
                total_deposits += float(u.get('balance', 0))
            except (ValueError, TypeError):
                pass
        
        return {
            "activeCustomers": len(customers),
            "branchRevenue": f"₹{branch_revenue / 1000000:.1f}M" if branch_revenue > 1000000 else f"₹{branch_revenue:,.0f}",
            "branchExpenses": f"₹{branch_expenses / 1000000:.1f}M" if branch_expenses > 1000000 else f"₹{branch_expenses:,.0f}",
            "totalTransactions": f"{total_tx_count:,}",
            "pendingApprovals": pending_count,
            "highPriorityPending": high_priority_pending,
            "totalDeposits": f"₹{total_deposits / 1000000:.1f}M" if total_deposits > 1000000 else f"₹{total_deposits:,.0f}",
            "staffPerformance": f"{efficiency_val}%",
            "revenueGrowth": f"{growth:+.1f}%",
            "chartData": chart_data,
            "performanceChart": performance_chart,
            "staff": staff_stats,
            "recentActions": actions if actions else [
                {"type": "info", "title": "Dashboard Sync", "desc": "Branch analytics are up to date", "time": "Just now"}
            ]
        }
    except Exception as e:
        import traceback
        # Only print once to terminal for backend debugging
        print(f"ERROR in dashboard: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(e)}")


@router.get("/admin/branches", response_model=dict)
async def admin_branches(current_user = Depends(get_current_user_token)):
    """List all branches and their employees - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    
    # 1. Get explicitly defined branches from branches.json
    defined_branches = s3_storage.get_branches()
    branches_map = {b['id']: {**b, "employees": [], "staffCount": 0} for b in defined_branches}
    
    # 2. Get all users to enrich branch data and discover unlisted branches
    all_users = s3_storage.list_all_users()
    staff_users = [u for u in all_users if u.get('role') not in ['customer', 'chairman']]
    
    for user in staff_users:
        bid = user.get('branchId', 'Unassigned')
        
        if bid not in branches_map:
            # Dynamically create if not defined in branches.json
            branch_name = user.get('branch') or f"Branch - {bid}"
            city = user.get('city', 'Unknown City')
            state = user.get('state', 'Unknown State')
            location = f"{city}, {state}" if city != 'Unknown City' else "Unknown Location"
            
            branches_map[bid] = {
                "id": bid,
                "name": branch_name,
                "location": location,
                "category": user.get('category', 'Urban'), # Fallback
                "manager": "Vacant",
                "staffCount": 0,
                "status": "Active",
                "employees": []
            }
            
        branches_map[bid]["staffCount"] += 1
        full_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get('username')
        role = user.get('role')
        
        # Update manager if found
        if role in ['branch_manager', 'manager', 'branch_head']:
             branches_map[bid]["manager"] = full_name
        
        branches_map[bid]["employees"].append({
            "id": user.get('id'),
            "name": full_name,
            "role": role,
            "email": user.get('email'),
            "status": "Active" if not user.get('is_locked') else "Locked"
        })

    branch_list = list(branches_map.values())
    total_staff = len(staff_users)
    
    # Ensure at least one demo branch exists if empty
    if not branch_list:
        branch_list.append({
             "id": "BR-DEMO",
             "name": "Demo Branch",
             "location": "Virtual HQ",
             "category": "Metropolitan",
             "manager": "System Admin",
             "staffCount": 0,
             "status": "Setup Required",
             "employees": []
        })

    return {"branches": branch_list, "count": len(branch_list), "totalStaff": total_staff}

@router.post("/admin/branches", response_model=dict)
async def post_admin_branch(branch: dict, current_user = Depends(get_current_user_token)):
    """Create or update a branch - Only accessible by chairman/admin"""
    if current_user.role not in ['chairman', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    new_branch = s3_storage.save_branch(branch)
    return {"status": "success", "branch": new_branch}

@router.get("/employee/administration/staff", response_model=dict)
async def get_admin_staff(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    staff_list = s3_storage.get_admin_staff()
    return {"staff": staff_list, "count": len(staff_list)}

@router.post("/employee/administration/staff", response_model=dict)
async def post_admin_staff(member: dict, current_user = Depends(get_current_user_token)):
    if current_user.role not in ['employee', 'manager', 'chairman', 'admin', 'administration']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    s3_storage.save_admin_staff(member)
    return {"status": "success", "member": member}

@router.get("/employee/administration/leave", response_model=dict)
async def get_admin_leave(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.db.s3_storage import s3_storage
    requests = s3_storage.get_admin_leave()
    
    # Simple aggregation for stats
    pending = len([r for r in requests if r.get('status') == 'Pending'])
    on_leave = len([r for r in requests if r.get('from') == 'Today' and r.get('status') == 'Approved'])
    
    return {
        "stats": [
            { "label": "Pending Requests", "value": str(pending).zfill(2), "color": "indigo" },
            { "label": "On Leave Today", "value": str(on_leave).zfill(2), "color": "emerald" },
            { "label": "Upcoming (Q1)", "value": "28", "color": "amber" },
        ],
        "requests": requests
    }

@router.get("/employee/administration/assets", response_model=dict)
async def get_admin_assets(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    assets = s3_storage.get_admin_assets()
    
    # Calculate counts per category
    cats_count = {}
    for a in assets:
        cat = a.get('category', 'Other')
        cats_count[cat] = cats_count.get(cat, 0) + 1
        
    categories = [{"name": name, "count": count} for name, count in cats_count.items()]
    
    return {
        "categories": categories,
        "assets": assets
    }

@router.get("/employee/administration/vendors", response_model=dict)
async def get_admin_vendors(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    vendors = s3_storage.get_admin_vendors()
    return {"vendors": vendors, "count": len(vendors)}

@router.post("/employee/administration/vendors", response_model=dict)
async def post_admin_vendor(vendor: dict, current_user = Depends(get_current_user_token)):
    if current_user.role not in ['employee', 'manager', 'chairman', 'admin', 'administration']:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    s3_storage.save_admin_vendor(vendor)
    return {"status": "success", "vendor": vendor}

@router.delete("/employee/administration/vendors/{vendor_id}", response_model=dict)
async def delete_admin_vendor(vendor_id: str, current_user = Depends(get_current_user_token)):
    if current_user.role not in ['employee', 'manager', 'chairman', 'admin', 'administration']:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    s3_storage.delete_admin_vendor(vendor_id)
    return {"status": "success", "message": f"Vendor {vendor_id} deleted"}

@router.get("/employee/administration/notices", response_model=dict)
async def get_admin_notices(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    notices = s3_storage.get_admin_notices()
    return {"notices": notices, "count": len(notices)}

@router.post("/employee/administration/notices", response_model=dict)
async def post_admin_notices(notice: dict, current_user = Depends(get_current_user_token)):
    if current_user.role not in ['employee', 'manager', 'chairman', 'admin', 'administration']:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    import uuid
    from datetime import datetime
    
    # Enrich notice data
    if 'id' not in notice:
        notice['id'] = f"NTC-{uuid.uuid4().hex[:4].upper()}"
    if 'date' not in notice:
        notice['date'] = "Today"
    if 'reads' not in notice:
        notice['reads'] = 0
    if 'pinned' not in notice:
        notice['pinned'] = False
        
    s3_storage.save_admin_notice(notice)
    return {"status": "success", "notice": notice}

@router.delete("/employee/administration/notices/{notice_id}", response_model=dict)
async def delete_admin_notice(notice_id: str, current_user = Depends(get_current_user_token)):
    if current_user.role not in ['employee', 'manager', 'chairman', 'admin', 'administration']:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    s3_storage.delete_admin_notice(notice_id)
    return {"status": "success", "message": f"Notice {notice_id} deleted"}

@router.get("/employee/administration/overview", response_model=dict)
async def get_admin_overview(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
        
    from app.db.s3_storage import s3_storage
    
    staff = s3_storage.get_admin_staff()
    leave = s3_storage.get_admin_leave()
    assets = s3_storage.get_admin_assets()
    vendors = s3_storage.get_admin_vendors()
    notices = s3_storage.get_admin_notices()
    
    # Generate Dynamic Chart Data based on actual counts
    # We'll simulate a weekly activity trend that peaks at our current total data points
    import random
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    total_actions = len(staff) + len(leave) + len(notices)
    
    # Calculate some summary stats
    total_staff = len(staff)
    pending_leave = len([l for l in leave if l.get('status') == 'Pending'])
    total_assets_value = sum([float(str(a.get('value', '0')).replace('₹', '').replace(',', '')) for a in assets])
    active_vendors = len([v for v in vendors if 'Active' in str(v.get('status', ''))])
    
    chart_data = []
    base_val = total_actions // 7
    for day in days:
        chart_data.append({
            "name": day,
            "activity": max(1, base_val + random.randint(-2, 3))
        })
    
    return {
        "summary": {
            "staff": total_staff,
            "pendingLeave": pending_leave,
            "totalLeave": len(leave),
            "assetsValue": f"₹{total_assets_value:,.2f}",
            "totalAssets": len(assets),
            "activeVendors": active_vendors,
            "totalVendors": len(vendors),
            "unreadNotices": len(notices)
        },
        "recentStaff": staff[:5],
        "recentNotices": notices[:3],
        "assetCategories": list(set([a.get('category') for a in assets])),
        "chartData": chart_data
    }

# --- Branch Management Routes ---

@router.get("/employee/branch-management/targets", response_model=dict)
async def get_branch_targets(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    targets = s3_storage.get_branch_targets(branch_id)
    return {"targets": targets}

@router.get("/employee/branch-management/customers", response_model=dict)
async def get_branch_customers(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    
    branch_ids = get_branch_identifiers(user_profile)
    all_customers = s3_storage.list_customers()
    
    # Filter by checking if any of the customer's branch identifiers match the manager's
    branch_customers = [
        c for c in all_customers 
        if any(cid in branch_ids for cid in get_branch_identifiers(c))
    ]
    
    return {"customers": branch_customers, "count": len(branch_customers)}

@router.post("/employee/branch-management/targets", response_model=dict)
async def post_branch_target(target: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_target(target, branch_id)
    return {"status": "success", "target": target}

@router.get("/employee/branch-management/reports", response_model=dict)
async def get_branch_reports(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    reports = s3_storage.get_branch_reports(branch_id)
    return {"reports": reports}

@router.post("/employee/branch-management/reports", response_model=dict)
async def post_branch_report(report: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_report(report, branch_id)
    return {"status": "success", "report": report}

@router.get("/employee/branch-management/escalations", response_model=dict)
async def get_branch_escalations(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    escalations = s3_storage.get_branch_escalations(branch_id)
    return {"escalations": escalations}

@router.post("/employee/branch-management/escalations", response_model=dict)
async def post_branch_escalation(escalation: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_escalation(escalation, branch_id)
    return {"status": "success", "escalation": escalation}

@router.get("/employee/branch-management/compliance", response_model=dict)
async def get_branch_compliance(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    compliance = s3_storage.get_branch_compliance(branch_id)
    return {"compliance": compliance}

@router.post("/employee/branch-management/compliance", response_model=dict)
async def post_branch_compliance(compliance: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_compliance(compliance, branch_id)
    return {"status": "success", "compliance": compliance}

@router.get("/employee/branch-management/settings", response_model=dict)
async def get_branch_settings(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    settings = s3_storage.get_branch_settings(branch_id)
    return {"settings": settings}

@router.post("/employee/branch-management/settings", response_model=dict)
async def post_branch_settings(settings: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_settings(settings, branch_id)
    return {"status": "success", "settings": settings}

@router.get("/employee/branch-management/performance", response_model=dict)
async def get_branch_performance(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    perf = s3_storage.get_branch_performance(branch_id)
    return {"performance": perf}

@router.post("/employee/branch-management/performance", response_model=dict)
async def post_branch_performance(perf: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_performance(perf, branch_id)
    return {"status": "success", "performance": perf}

@router.get("/employee/branch-management/approvals", response_model=dict)
async def get_branch_approvals(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    
    branch_ids = get_branch_identifiers(user_profile)
    all_approvals = []
    seen_ids = set()
    
    for b_id in branch_ids:
        try:
            approvals = s3_storage.get_branch_approvals(b_id)
            for app in approvals:
                if app.get('id') and app.get('id') not in seen_ids:
                    all_approvals.append(app)
                    seen_ids.add(app.get('id'))
        except:
            continue
                
    return {"approvals": all_approvals}

@router.post("/employee/branch-management/approvals", response_model=dict)
async def post_branch_approval(approval: dict, background_tasks: BackgroundTasks, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    from app.core.websocket import manager
    import asyncio
    
    # 1. Determine the CORRECT branch ID to save to
    # IMPORTANT: Use the application's own branchId if it exists, otherwise fallback to manager's branch
    target_username = approval.get('username')
    target_profile = s3_storage.get_user_by_username(target_username) if target_username else None
    
    # Get original branch ID from approval object or target user profile
    original_branch_id = approval.get('branchId')
    if not original_branch_id and target_profile:
         original_branch_id = get_branch_identifier(target_profile)
    
    # Final fallback to current manager's branch
    if not original_branch_id:
        user_profile = s3_storage.get_user_by_username(current_user.sub)
        original_branch_id = get_branch_identifier(user_profile)
    
    # Save the initial decision to the CORRECT branch folder
    s3_storage.save_branch_approval(approval, original_branch_id)
    
    async def process_loan_workflow(app_id, b_id, username, app_type):
        """Background task to simulate 3 more approval steps over 2-3 virtual days."""
        stages = [
            {"status": "Credit Scoring", "msg": "Step 2: Manager has initiated Credit Score analysis for your loan."},
            {"status": "Officer Review", "msg": "Step 3: All documents forwarded to the Branch Loan Officer for final verification."},
            {"status": "Authorized", "msg": "Final Step: Loan fully Authorized & Disbursement initiated!"}
        ]
        
        for stage in stages:
            # Simulate "1 day" delay (30 seconds for demo)
            await asyncio.sleep(30)
            
            # Fetch latest app data
            apps = s3_storage.get_user_applications(username, b_id)
            current_app = next((a for a in apps if a.get('id') == app_id), None)
            if not current_app: break
            
            # Update status
            current_app['status'] = stage['status']
            current_app['updated_at'] = datetime.utcnow().isoformat()
            s3_storage.save_branch_approval(current_app, b_id)
            
            # Notify User
            await manager.send_personal_message({
                "type": "notification",
                "message": stage['msg'],
                "icon": "📈" if "Score" in stage['status'] else "�",
                "refresh": True
            }, username)
            
            # Email Notification
            target_p = s3_storage.get_user_by_username(username)
            if target_p and target_p.get('email'):
                await send_status_update_email(
                    target_p['email'],
                    target_p.get('firstName', username),
                    app_type,
                    stage['status']
                )

    # Trigger background workflow ONLY for Loans if Authorized
    if approval.get('status') == 'authorized' and "Loan" in approval.get('type', ''):
        background_tasks.add_task(process_loan_workflow, 
                                 approval.get('id'), 
                                 original_branch_id, 
                                 target_username, 
                                 approval.get('type'))

    # Initial notification
    if target_username:
        await manager.send_personal_message({
            "type": "notification",
            "message": f"Your {approval.get('type', 'request')} has been {approval.get('status', 'processed')}.",
            "icon": "💳" if "Card" in approval.get('type', '') else "📄",
            "refresh": True
        }, target_username)
        
        await manager.send_personal_message({
            "type": "refresh_data",
            "module": "applications"
        }, target_username)
        
        if target_profile and target_profile.get('email'):
            await send_status_update_email(
                target_profile['email'],
                target_profile.get('firstName', target_username),
                approval.get('type', 'request'),
                approval.get('status', 'processed')
            )
        
    return {"status": "success", "approval": approval}

@router.get("/employee/branch-management/staff", response_model=dict)
async def get_branch_staff(current_user = Depends(get_current_user_token)):
    if current_user.role == 'customer':
        raise HTTPException(status_code=403, detail="Not authorized")
    from app.db.s3_storage import s3_storage
    
    # 1. Get the current user's full profile to find their branchIds
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    if not user_profile:
        raise HTTPException(status_code=404, detail="User profile not found")
        
    branch_ids = get_branch_identifiers(user_profile)
    all_employees = s3_storage.list_employees()
    
    # Filter staff by any matching branch identifier
    branch_staff = [
        e for e in all_employees
        if any(eid in branch_ids for eid in get_branch_identifiers(e))
    ]
    
    return {"staff": branch_staff}

@router.post("/employee/branch-management/staff", response_model=dict)
async def post_branch_staff(member: dict, current_user = Depends(get_current_user_token)):
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    branch_id = get_branch_identifier(user_profile)
    s3_storage.save_branch_staff(member, branch_id)
    return {"status": "success", "member": member}

@router.post("/customer/apply", response_model=dict)
async def customer_apply(application: dict, current_user = Depends(get_current_user_token)):
    """Allow customers to submit applications for loans, cards, etc."""
    from app.db.s3_storage import s3_storage
    
    # 1. Get customer branch info
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    if not user_profile:
        raise HTTPException(status_code=404, detail="User not found")
        
    branch_id = get_branch_identifier(user_profile)
    
    # 2. Enrich application data
    application['customer'] = f"{user_profile.get('firstName', '')} {user_profile.get('lastName', '')}".strip() or user_profile.get('username')
    application['username'] = current_user.sub  # Store username for filtering
    application['branchId'] = branch_id # NEW: Store the actual branch it belongs to
    application['priority'] = application.get('priority', 'medium')
    application['score'] = user_profile.get('creditScore')
    application['status'] = 'pending'
    
    # 3. Save to branch approvals queue
    s3_storage.save_customer_application(application, branch_id)
    
    # Send Email Notification to Customer
    if user_profile.get('email'):
        await send_email(
            f"Application Received: {application.get('type')}",
            f"Hello {user_profile.get('firstName', 'User')},\n\nWe have received your application for {application.get('type')}. Our team is reviewing it, and you will be notified once it is processed.\n\nReference ID: {application.get('id')}\n\nBest regards,\nSentinelX Banking",
            user_profile['email']
        )
    
    # 4. Notify Branch Manager via WebSocket
    from app.core.websocket import manager
    await manager.broadcast({
        "type": "notification",
        "module": "approvals",
        "branchId": branch_id,
        "branchIds": get_branch_identifiers(user_profile),
        "message": f"New application: {application.get('type')} from {application.get('customer')}",
        "icon": "📝",
        "refresh": True
    })
    
    return {"status": "success", "application": application}

@router.put("/customer/apply/{app_id}", response_model=dict)
async def update_customer_application(app_id: str, updates: dict, current_user = Depends(get_current_user_token)):
    """Allow customers to edit their application if it's still pending."""
    from app.db.s3_storage import s3_storage
    user_profile = s3_storage.get_user_by_username(current_user.sub)
    if not user_profile:
        raise HTTPException(status_code=404, detail="User not found")
        
    branch_id = get_branch_identifier(user_profile)
    
    # 1. Get existing applications for this user
    apps = s3_storage.get_user_applications(current_user.sub, branch_id)
    app_to_edit = next((a for a in apps if a.get('id') == app_id), None)
    
    if not app_to_edit:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # 2. Check status - only allow edit if pending
    if app_to_edit.get('status') != 'pending':
        raise HTTPException(status_code=400, detail="Cannot edit application after action has been taken")
        
    # 3. Update data
    app_to_edit.update(updates)
    app_to_edit['branchId'] = branch_id # Ensure it's there
    app_to_edit['updated_at'] = datetime.utcnow().isoformat()
    
    # 4. Save back
    s3_storage.save_customer_application(app_to_edit, branch_id)
    
    # 5. Notify Manager
    from app.core.websocket import manager
    await manager.broadcast({
        "type": "notification",
        "module": "approvals",
        "branchId": branch_id,
        "message": f"Application updated: {app_to_edit.get('type')} from {app_to_edit.get('customer')}",
        "icon": "🔄",
        "refresh": True
    })
    
    return {"status": "success", "application": app_to_edit}

@router.post("/customer/transfer", response_model=dict)
async def customer_transfer(tx_data: dict, current_user = Depends(get_current_user_token)):
    """Process a fund transfer between accounts"""
    from app.db.s3_storage import s3_storage
    import uuid
    
    amount = float(tx_data.get('amount', 0))
    recipient_identifier = tx_data.get('recipient') # Can be Account Number or Username
    note = tx_data.get('note', 'Transfer')
    
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
        
    # 1. Get Sender
    sender = s3_storage.get_user_by_username(current_user.sub)
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
        
    sender_balance = float(sender.get('balance', 0))
    if sender_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
        
    # 2. Find Recipient (Try account number first, then username)
    recipient = None
    all_users = s3_storage.list_all_users()
    for u in all_users:
        if u.get('accountNumber') == recipient_identifier or u.get('username') == recipient_identifier:
            recipient = u
            break
            
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
        
    if recipient['id'] == sender['id']:
        raise HTTPException(status_code=400, detail="Cannot transfer to yourself")

    # 3. Process Transaction
    tx_id = f"TRX-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()
    
    # Update Sender
    sender_txs = sender.get('transactions', [])
    sender_txs.insert(0, {
        "id": tx_id,
        "date": timestamp,
        "description": f"Transfer to {recipient.get('firstName', recipient['username'])}",
        "merchant": recipient_identifier,
        "amount": -amount,
        "type": "debit",
        "category": "Transfer",
        "status": "Completed"
    })
    
    s3_storage.update_user(sender['id'], {
        "balance": sender_balance - amount,
        "transactions": sender_txs,
        "totalSpending": float(sender.get('totalSpending', 0)) + amount
    })
    
    # Update Recipient
    recipient_txs = recipient.get('transactions', [])
    recipient_txs.insert(0, {
        "id": tx_id,
        "date": timestamp,
        "description": f"Transfer from {sender.get('firstName', sender['username'])}",
        "merchant": sender.get('accountNumber', sender['username']),
        "amount": amount,
        "type": "credit",
        "category": "Income",
        "status": "Completed"
    })
    
    s3_storage.update_user(recipient['id'], {
        "balance": float(recipient.get('balance', 0)) + amount,
        "transactions": recipient_txs
    })
    
    # 4. Send Emails
    recipient_name = f"{recipient.get('firstName', '')} {recipient.get('lastName', '')}".strip() or recipient['username']
    sender_name = f"{sender.get('firstName', '')} {sender.get('lastName', '')}".strip() or sender['username']
    
    # To Sender
    await send_transaction_email(sender['email'], sender.get('firstName', 'User'), amount, recipient_name, tx_id, is_credit=False)
    
    # To Recipient
    if recipient.get('email'):
        await send_transaction_email(recipient['email'], recipient.get('firstName', 'User'), amount, sender_name, tx_id, is_credit=True)
        
    # 5. Notify via WebSocket
    await manager.send_personal_message({
        "type": "notification",
        "message": f"Sent ₹{amount:,.2f} to {recipient_name}",
        "icon": "💸",
        "refresh": True
    }, sender['username'])
    
    await manager.send_personal_message({
        "type": "notification",
        "message": f"Received ₹{amount:,.2f} from {sender_name}",
        "icon": "💰",
        "refresh": True
    }, recipient['username'])
    
    return {"status": "success", "tx_id": tx_id}
