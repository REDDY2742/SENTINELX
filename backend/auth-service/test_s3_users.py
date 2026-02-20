"""
Test script to check if S3 storage is working and list all users
"""
from app.db.s3_storage import s3_storage
import json

print("=" * 50)
print("Testing S3 Storage - List All Users")
print("=" * 50)

try:
    users = s3_storage.list_all_users()
    print(f"\n✅ Found {len(users)} users in S3:\n")
    
    for idx, user in enumerate(users, 1):
        print(f"{idx}. Username: {user.get('username')}")
        print(f"   Email: {user.get('email')}")
        print(f"   Role: {user.get('role')}")
        print(f"   ID: {user.get('id')}")
        print(f"   Permissions: {user.get('permissions', [])}")
        print(f"   Created: {user.get('created_at')}")
        print("-" * 50)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
