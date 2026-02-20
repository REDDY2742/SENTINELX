from app.db.s3_storage import s3_storage
from datetime import datetime, timedelta

def test_logic():
    # Simulate Ishaan Sharma
    employee = s3_storage.get_user_by_username('ishaansharma')
    branch_id = employee.get('branchId')
    branch_name = employee.get('branch', '').split('-')[0].split(',')[0].strip()
    print(f"Manager Branch Search: ID={branch_id}, Name={branch_name}")
    
    all_users = s3_storage.list_all_users()
    
    def is_in_branch(u):
        if u.get('role') != 'customer': return False
        uid = u.get('branchId')
        uname = u.get('branch', '') # Use empty string as default
        if not uname: uname = ''
        if branch_id and uid == branch_id: return True
        if branch_name and branch_name.lower() in uname.lower(): return True
        return False

    customers = [u for u in all_users if is_in_branch(u)]
    print(f"Found {len(customers)} customers for this branch.")
    
    total_deposits = sum(float(u.get('balance', 0)) for u in customers)
    print(f"Total Deposits: {total_deposits}")
    
    revenue = 0
    for u in customers:
        txs = u.get('transactions', [])
        for tx in txs:
            if tx.get('type') == 'credit':
                revenue += abs(float(tx.get('amount', 0)))
    print(f"Total Revenue (from txs): {revenue}")

if __name__ == "__main__":
    test_logic()
