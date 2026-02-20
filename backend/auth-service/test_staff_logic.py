from app.db.s3_storage import s3_storage
from datetime import datetime, timedelta

def test_logic():
    # Simulate Ishaan Sharma
    employee = s3_storage.get_user_by_username('ishaansharma')
    branch_id = employee.get('branchId')
    branch_name = employee.get('branch', '').split('-')[0].split(',')[0].strip()
    print(f"Manager Branch Search: ID={branch_id}, Name={branch_name}")
    
    all_users = s3_storage.list_all_users()
    
    def is_staff_in_branch(u):
        if u.get('role') == 'customer': return False
        uid = u.get('branchId')
        uname = u.get('branch', '') or ''
        if branch_id and uid == branch_id: return True
        if branch_name and uname and branch_name.lower() in uname.lower(): return True
        return False

    staff = [u for u in all_users if is_staff_in_branch(u)]
    print(f"Found {len(staff)} staff members for this branch.")
    for s in staff:
        print(f"- {s.get('username')} ({s.get('role')})")

if __name__ == "__main__":
    test_logic()
