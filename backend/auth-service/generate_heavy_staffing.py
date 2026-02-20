import sys
import os
import uuid
import random
from datetime import datetime

# Add the app directory to the path so we can import from app
sys.path.append(os.getcwd())

from app.db.s3_storage import s3_storage
from app.core.security import get_password_hash

# Role-based Permissions Mapping
ROLE_PERMISSIONS = {
    "branch_manager": ["branch:manage", "staff:manage", "loan:approve", "loan:reject", "reports:view", "auth:full"],
    "assistant_manager": ["branch:view", "staff:view", "loan:review", "reports:view", "auth:partial"],
    "teller": ["transaction:create", "account:view", "cash:manage", "auth:login"],
    "cashier": ["transaction:create", "cash:manage", "auth:login"],
    "loan_officer": ["loan:create", "loan:review", "customer:view", "auth:login"],
    "relationship_manager": ["customer:view", "customer:edit", "account:view", "auth:login"],
    "customer_service": ["customer:view", "tickets:manage", "auth:login"],
    "operations_staff": ["ops:view", "ops:edit", "auth:login"],
    "compliance_officer": ["audit:view", "compliance:check", "auth:login"],
    "it_support": ["system:view", "support:manage", "auth:login"],
    "accountant": ["finance:view", "finance:edit", "auth:login"],
    "audit_officer": ["audit:view", "audit:create", "auth:login"],
    "security_officer": ["security:monitor", "auth:login"],
    "administration": ["admin:read", "admin:write", "auth:login"]
}
ROLES = list(ROLE_PERMISSIONS.keys())

FIRST_NAMES = ["Aryan", "Aditya", "Arjun", "Ananya", "Ishaan", "Kavya", "Vihaan", "Saanvi", "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Rohan", "Anjali", "Siddharth", "Tanvi", "Akshay", "Pooja"]
LAST_NAMES = ["Sharma", "Verma", "Gupta", "Malhotra", "Kapoor", "Reddy", "Patel", "Singh", "Iyer", "Joshi", "Bose", "Mehta", "Chopra", "Das", "Yadav", "Nair", "Mishra", "Kulkarni", "Deshmukh", "Pillai"]

# State-wise City Mapping
CITY_DATA = {
    "Telangana": [
        ("Hyderabad", "Metropolitan", 3),
        ("Warangal", "Urban", 2),
        ("Nizamabad", "Urban", 2),
        ("Khammam", "Urban",1),
        ("Karimnagar", "Urban", 1),
        ("Mahbubnagar", "Urban", 1),
        ("Suryapet", "Urban", 1),
        ("Nalgonda", "Urban", 1),
        ("Adilabad", "Urban", 1),
        ("Bhadrachalam", "Urban", 1),
        ("Jagtial", "Rural", 1),
        ("Kamareddy", "Rural", 1),
        ("Mancherial", "Rural", 1),
        ("Medak", "Rural", 1),
        ("Nagarkurnool", "Rural", 1),
        ("Peddapalli", "Rural", 1),
        ("Siddipet", "Rural", 1),
        ("Wanaparthy", "Rural", 1),
        ("Yadadri Bhuvanagiri", "Rural", 1),
    ],
    "Andhra Pradesh": [
        ("Visakhapatnam", "Urban", 1), ("Vijayawada", "Urban", 1), ("Guntur", "Urban", 1), 
        ("Nellore", "Rural", 1), ("Kurnool", "Rural", 1), ("Rajahmundry", "Urban", 1), 
        ("Tirupati", "Urban", 1), ("Kakinada", "Urban", 1)
    ],
    "Karnataka": [
        ("Bengaluru", "Metropolitan", 1), ("Mysuru", "Urban", 1), ("Hubli", "Urban", 1), 
        ("Belagavi", "Rural", 1), ("Mangaluru", "Urban", 1), ("Davanagere", "Urban", 1), 
        ("Ballari", "Urban", 1), ("Shivamogga", "Rural", 1)
    ],
    "Tamil Nadu": [
        ("Chennai", "Metropolitan", 1), ("Coimbatore", "Urban", 1), ("Madurai", "Urban", 1), 
        ("Tiruchirappalli", "Urban", 1), ("Salem", "Urban", 1), ("Tiruppur", "Urban", 1), 
        ("Erode", "Rural", 1), ("Vellore", "Rural", 1)
    ],
    "Maharashtra": [
        ("Mumbai", "Metropolitan", 1), ("Pune", "Metropolitan", 1), ("Nagpur", "Urban", 1), 
        ("Nashik", "Urban", 1), ("Aurangabad", "Urban", 1), ("Solapur", "Urban", 1), 
        ("Amravati", "Rural", 1), ("Kolhapur", "Urban", 1)
    ],
    "Gujarat": [
        ("Ahmedabad", "Metropolitan", 1), ("Surat", "Metropolitan", 1), ("Vadodara", "Urban", 1), 
        ("Rajkot", "Urban", 1), ("Bhavnagar", "Urban", 1), ("Jamnagar", "Rural", 1), 
        ("Junagadh", "Rural", 1), ("Gandhinagar", "Urban", 1)
    ],
    "Delhi": [
        ("New Delhi Zone 1", "Metropolitan", 1), ("New Delhi Zone 2", "Metropolitan", 1), 
        ("New Delhi Zone 3", "Metropolitan", 1), ("New Delhi Zone 4", "Metropolitan", 1), 
        ("New Delhi Zone 5", "Metropolitan", 1), ("New Delhi Zone 6", "Metropolitan", 1), 
        ("New Delhi Zone 7", "Metropolitan", 1), ("New Delhi Zone 8", "Metropolitan", 1)
    ],
    "West Bengal": [
        ("Kolkata", "Metropolitan", 1), ("Asansol", "Urban", 1), ("Siliguri", "Urban", 1), 
        ("Durgapur", "Urban", 1), ("Bardhaman", "Rural", 1), ("Malda", "Rural", 1), 
        ("Baharampur", "Rural", 1), ("Habra", "Rural", 1)
    ],
    "Uttar Pradesh": [
        ("Lucknow", "Metropolitan", 1), ("Kanpur", "Metropolitan", 1), ("Agra", "Urban", 1), 
        ("Varanasi", "Urban", 1), ("Meerut", "Urban", 1), ("Prayagraj", "Urban", 1), 
        ("Bareilly", "Rural", 1), ("Aligarh", "Rural", 1)
    ],
    "Rajasthan": [
        ("Jaipur", "Metropolitan", 1), ("Jodhpur", "Urban", 1), ("Kota", "Urban", 1), 
        ("Bikaner", "Urban", 1), ("Ajmer", "Urban", 1), ("Udaipur", "Rural", 1), 
        ("Bhilwara", "Rural", 1), ("Alwar", "Rural", 1)
    ],
    "Madhya Pradesh": [
        ("Indore", "Metropolitan", 1), ("Bhopal", "Metropolitan", 1), ("Jabalpur", "Urban", 1), 
        ("Gwalior", "Urban", 1), ("Ujjain", "Urban", 1), ("Sagar", "Rural", 1), 
        ("Dewas", "Rural", 1), ("Satna", "Rural", 1)
    ],
    "Kerala": [
        ("Thiruvananthapuram", "Urban", 1), ("Kochi", "Metropolitan", 1), ("Kozhikode", "Urban", 1), 
        ("Kollam", "Urban", 1), ("Thrissur", "Urban", 1), ("Alappuzha", "Rural", 1), 
        ("Palakkad", "Rural", 1), ("Malappuram", "Rural", 1)
    ]
}

def generate_data():
    print("Starting heavy staffing generation...")
    
    hashed_password = get_password_hash("SentinelX@2026")
    
    # 1. Generate Branches
    branches = []
    for state, cities in CITY_DATA.items():
        for city_name, category, count in cities:
            for i in range(count):
                b_id = f"BR-{len(branches) + 1001}"
                suffix = f" {i+1}" if count > 1 else ""
                b_name = f"{city_name}{suffix} {random.choice(['Main', 'City', 'South', 'North', 'Hub'])} Branch"
                
                # Calculate realistic demo metrics based on branch scale
                is_metro = category == "Metropolitan"
                base_rev = random.uniform(1.2, 2.5) if is_metro else random.uniform(0.4, 0.9)
                rev_suffix = "Cr"
                
                base_maint = random.uniform(4.0, 8.5) if is_metro else random.uniform(1.5, 3.5)
                maint_suffix = "L"
                
                perf_score = random.randint(88, 97)
                
                branches.append({
                    "id": b_id,
                    "name": b_name,
                    "location": f"{city_name}, {state}",
                    "category": category,
                    "manager": "Vacant",
                    "status": "Active",
                    "staffCount": 0,
                    "revenue": f"₹{base_rev:.1f}{rev_suffix}",
                    "maintenanceCost": f"₹{base_maint:.1f}{maint_suffix}",
                    "performanceScore": f"{perf_score}/100"
                })
    
    print(f"Generated {len(branches)} total branches across multiple states.")

    # 2. Load existing employees to preserve administration
    existing_employees = s3_storage.list_employees()
    # Keep only chairmen/high-level admins to avoid duplicates of branch staff
    employees = [u for u in existing_employees if u.get('role') == 'chairman']
    
    print(f"Preserving {len(employees)} administrative accounts.")

    used_usernames = {u['username'] for u in existing_employees}
    used_emails = {u['email'] for u in existing_employees}

    for branch in branches:
        # Increased base counts to reach 3000+ total
        staff_needed = 32 if branch["category"] == "Metropolitan" else 27
        # Add a bit of randomness to exceed the minimum
        staff_needed += random.randint(3, 10)
        
        branch_staff_count = 0
        
        # Every branch needs 1 Branch Manager and 1 Assistant Manager
        required_roles = ["branch_manager", "assistant_manager"]
        for role in required_roles:
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            name = f"{first} {last}"
            username = f"{first.lower()}.{last.lower()}{random.randint(10, 99)}"
            while username in used_usernames:
                username = f"{first.lower()}.{last.lower()}{random.randint(100, 999)}"
            used_usernames.add(username)
            
            email = f"{username}@sentinelbank.com"
            used_emails.add(email)
            
            emp = {
                "id": str(uuid.uuid4()),
                "username": username,
                "hashed_password": hashed_password,
                "firstName": first,
                "lastName": last,
                "email": email,
                "role": role,
                "permissions": ROLE_PERMISSIONS.get(role, ["auth:login"]),
                "branchId": branch["id"],
                "branch": branch["name"],
                "status": "active",
                "employeeId": f"EMP-{random.randint(10000, 99999)}",
                "department": "Banking Ops" if role not in ["it_support", "security_officer"] else "Support",
                "salary": random.randint(60000, 150000),
                "joinDate": "2023-01-15",
                "phone": f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
                "address": f"{random.randint(1, 999)}, {random.choice(['Park Avenue', 'MG Road', 'Station Road', 'Garden Street'])}",
                "city": branch["location"].split(",")[0],
                "state": branch["location"].split(",")[1].strip(),
                "emergencyContact": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
                "emergencyPhone": f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
                "employmentType": "full-time",
                "creditScore": random.randint(650, 850),
                "balance": 0.0
            }
            employees.append(emp)
            branch_staff_count += 1
            if role == "branch_manager":
                branch["manager"] = name

        # Remaining 12 roles need 1+ employees
        remaining_12 = [r for r in ROLES if r not in required_roles]
        for role in remaining_12:
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            username = f"{first.lower()}.{last.lower()}{random.randint(10, 99)}"
            while username in used_usernames:
                username = f"{first.lower()}.{last.lower()}{random.randint(100, 999)}"
            used_usernames.add(username)
            
            email = f"{username}@sentinelbank.com"
            
            emp = {
                "id": str(uuid.uuid4()),
                "username": username,
                "hashed_password": hashed_password,
                "firstName": first,
                "lastName": last,
                "email": email,
                "role": role,
                "permissions": ROLE_PERMISSIONS.get(role, ["auth:login"]),
                "branchId": branch["id"],
                "branch": branch["name"],
                "status": "active",
                "employeeId": f"EMP-{random.randint(10000, 99999)}",
                "department": "Banking Ops",
                "salary": random.randint(30000, 80000),
                "joinDate": "2023-05-10",
                "phone": f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
                "address": f"{random.randint(1, 999)}, {random.choice(['Main Road', 'Market Street', 'High Road'])}",
                "city": branch["location"].split(",")[0],
                "state": branch["location"].split(",")[1].strip(),
                "emergencyContact": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
                "emergencyPhone": f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
                "employmentType": "full-time"
            }
            employees.append(emp)
            branch_staff_count += 1

        # Fill the rest to reach the target staff count
        while branch_staff_count < staff_needed:
            role = random.choice(remaining_12)
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            username = f"{first.lower()}.{last.lower()}{random.randint(10, 99)}"
            while username in used_usernames:
                username = f"{first.lower()}.{last.lower()}{random.randint(100, 999)}"
            used_usernames.add(username)
            
            email = f"{username}@sentinelbank.com"
            
            emp = {
                "id": str(uuid.uuid4()),
                "username": username,
                "hashed_password": hashed_password,
                "firstName": first,
                "lastName": last,
                "email": email,
                "role": role,
                "permissions": ROLE_PERMISSIONS.get(role, ["auth:login"]),
                "branchId": branch["id"],
                "branch": branch["name"],
                "status": "active",
                "employeeId": f"EMP-{random.randint(10000, 99999)}",
                "department": "Banking Ops",
                "salary": random.randint(25000, 70000),
                "joinDate": datetime.utcnow().strftime("%Y-%m-%d"),
                "phone": f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
                "address": f"{random.randint(1, 999)}, {random.choice(['City Lane', 'Green View', 'Church Street'])}",
                "city": branch["location"].split(",")[0],
                "state": branch["location"].split(",")[1].strip(),
                "emergencyContact": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
                "emergencyPhone": f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}",
                "employmentType": "full-time"
            }
            employees.append(emp)
            branch_staff_count += 1
            
        branch["staffCount"] = branch_staff_count

    print(f"Generated {len(employees)} total employees.")

    # 3. Save to S3
    s3_storage._save_data_to_file("users/branches.json", branches, "branches")
    s3_storage._save_data_to_file("users/employees.json", employees, "employees")
    
    print("Successfully updated S3 storage with 100 branches and 3000+ employees.")

if __name__ == "__main__":
    generate_data()
