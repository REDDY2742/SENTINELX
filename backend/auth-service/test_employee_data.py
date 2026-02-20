"""
Test script to verify S3 data storage
"""
from app.db.s3_storage import s3_storage
import json

print("=" * 70)
print("CHECKING ALL USERS IN S3 WITH FULL DETAILS")
print("=" * 70)

users = s3_storage.list_all_users()

for idx, user in enumerate(users, 1):
    print(f"\n{'='*70}")
    print(f"USER {idx}: {user.get('username')}")
    print(f"{'='*70}")
    
    # Print all fields
    fields_to_check = [
        'id', 'username', 'email', 'role', 'permissions',
        'firstName', 'lastName', 'phone', 'address', 'city', 'state',
        'employeeId', 'dateOfJoining', 'department', 'branch', 
        'employmentType', 'salary', 'emergencyContact', 'emergencyPhone'
    ]
    
    for field in fields_to_check:
        value = user.get(field)
        if value:
            print(f"  [OK] {field:20s}: {value}")
        else:
            print(f"  [--] {field:20s}: (empty)")
    
print("\n" + "=" * 70)
print(f"TOTAL USERS: {len(users)}")
print("=" * 70)
