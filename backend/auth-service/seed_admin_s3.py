"""
S3-Based Database Seeding Script - Creates Admin User
Run: python seed_admin_s3.py
"""
from app.db.s3_storage import s3_storage
from app.core import crud_s3
import datetime

def seed_admin():
    try:
        # Check if admin already exists
        existing_admin = crud_s3.get_user_by_email("admin@sentinelx.com")
        
        if existing_admin:
            print("✅ Admin user already exists in S3!")
            print(f"   Email: {existing_admin['email']}")
            print(f"   Role: {existing_admin['role']}")
            print(f"   User ID: {existing_admin['id']}")
            return
        
        # Create admin user
        admin_user = crud_s3.create_user(
            username="chairman_admin",
            email="admin@sentinelx.com",
            password="admin@123",
            role="chairman",
            permissions=[
                "system:admin",
                "user:read", "user:write", "user:delete",
                "branch:read", "branch:write",
                "loan:approve", "loan:reject",
                "fraud:view", "fraud:resolve",
                "audit:read"
            ]
        )
        
        print("✅ Admin user created successfully in S3!")
        print(f"   Email: admin@sentinelx.com")
        print(f"   Password: admin@123")
        print(f"   Role: chairman")
        print(f"   User ID: {admin_user['id']}")
        print(f"   S3 Bucket: {s3_storage.bucket}")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed_admin()
