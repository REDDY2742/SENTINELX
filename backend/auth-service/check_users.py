import os
import sys

# Add the project root to sys.path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app.db.s3_storage import s3_storage

def check_users():
    print("👥 Checking Registered Users...")
    employees = s3_storage.list_employees()
    customers = s3_storage.list_customers()
    
    print(f"👷 Employees ({len(employees)}):")
    for e in employees:
        print(f"   - {e.get('username')} (Role: {e.get('role')}, Name: {e.get('firstName')} {e.get('lastName')})")
        
    print(f"👤 Customers ({len(customers)}):")
    for c in customers:
        print(f"   - {c.get('username')} (Role: {c.get('role')}, Name: {c.get('firstName')} {c.get('lastName')})")

if __name__ == "__main__":
    check_users()
