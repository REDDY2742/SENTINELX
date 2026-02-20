import os
import sys

# Add the project root to sys.path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.s3_storage import s3_storage

def seed_administration_data():
    print("🚀 Starting Administration Data Seeding to AWS S3...")

    # 1. Seed Staff Records
    staff_data = [
        { "id": "EMP-1021", "name": "Suhasini Reddy", "role": "Head Cashier", "dept": "Cash & Vault", "joining": "2018-01-15", "appraisal": "Excellent" },
        { "id": "EMP-1025", "name": "Arun Kumar", "role": "Loan Officer", "dept": "Credit & Loans", "joining": "2020-03-10", "appraisal": "Good" },
        { "id": "EMP-1028", "name": "Priya Mehta", "role": "Relationship Manager", "dept": "Retail Banking", "joining": "2019-07-22", "appraisal": "Outstanding" },
        { "id": "EMP-1032", "name": "Vikas Khanna", "role": "Teller", "dept": "Cash & Vault", "joining": "2021-11-05", "appraisal": "Average" },
        { "id": "EMP-1035", "name": "Neha Singh", "role": "Customer Service", "dept": "Customer Relations", "joining": "2021-02-18", "appraisal": "Good" },
    ]
    for s in staff_data:
        s3_storage.save_admin_staff(s)
    print(f"✅ Seeded {len(staff_data)} Staff Records")

    # 2. Seed Leave Requests
    leave_data = [
        { "id": "LR-101", "staff": "Vikas Khanna", "type": "Annual Leave", "duration": "3 Days", "from": "20 Feb", "status": "Pending" },
        { "id": "LR-102", "staff": "Anjali Gupta", "type": "Sick Leave", "duration": "1 Day", "from": "Today", "status": "Approved" },
        { "id": "LR-103", "staff": "Rahul Sharma", "type": "Casual Leave", "duration": "2 Days", "from": "25 Feb", "status": "Pending" },
        { "id": "LR-105", "staff": "Priya Mehta", "type": "Privilege Leave", "duration": "5 Days", "from": "15 Mar", "status": "Pending" },
    ]
    for l in leave_data:
        s3_storage.save_admin_leave(l)
    print(f"✅ Seeded {len(leave_data)} Leave Requests")

    # 3. Seed Assets
    asset_data = [
        { "id": "AST-201", "name": "Dell Precision 3660", "category": "IT Hardware", "status": "Operational", "assignee": "Vikas Khanna", "value": "₹1,24,000" },
        { "id": "AST-202", "name": "HP LaserJet Enterprise", "category": "Printers", "status": "Repair", "assignee": "Shared (Front Desk)", "value": "₹45,500" },
        { "id": "AST-203", "name": "Glory Cash Sorter GFS-220", "category": "Cash Tech", "status": "Operational", "assignee": "Suhasini Reddy", "value": "₹3,15,000" },
        { "id": "AST-204", "name": "Ergonomic Mesh Chair", "category": "Furniture", "status": "Operational", "assignee": "Arun Kumar", "value": "₹14,200" },
    ]
    for a in asset_data:
        s3_storage.save_admin_asset(a)
    print(f"✅ Seeded {len(asset_data)} Assets")

    # 4. Seed Vendors
    vendor_data = [
        { "name": "Global Logistics Solutions", "category": "Courier & Cash Transit", "rating": 4.8, "contact": "Sanjay Gupta", "status": "Active Contract", "email": "sanjay@globallogistics.in" },
        { "name": "Nexus IT Services", "category": "Software & Cloud Support", "rating": 4.5, "contact": "Neha Verma", "status": "Renewal Pending", "email": "support@nexusit.com" },
        { "name": "Sentinel Security Force", "category": "Physical Security", "rating": 4.9, "contact": "Maj. Singh", "status": "Active Contract", "email": "operations@sentinelsecurity.in" },
    ]
    for v in vendor_data:
        s3_storage.save_admin_vendor(v)
    print(f"✅ Seeded {len(vendor_data)} Vendors")

    # 5. Seed Notices
    notice_data = [
        { "id": "NTC-801", "title": "System Maintenance Cycle - Q1", "category": "IT Support", "date": "Today", "pinned": True, "reads": 42, "priority": "High" },
        { "id": "NTC-802", "title": "Updated AML Policy Guidelines", "category": "Compliance", "date": "Yesterday", "pinned": True, "reads": 128, "priority": "Critical" },
        { "id": "NTC-803", "title": "Branch Visit: Regional Manager", "category": "General", "date": "Yesterday", "pinned": False, "reads": 56, "priority": "Medium" },
    ]
    for n in notice_data:
        s3_storage.save_admin_notice(n)
    print(f"✅ Seeded {len(notice_data)} Internal Notices")

    print("\n🎉 Seeding complete! All folders under users/administration/ are now populated on S3.")

if __name__ == "__main__":
    seed_administration_data()
