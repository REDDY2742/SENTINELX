"""
S3-Based Database Seeding Script - Create 300 Indian Employees
Run: python seed_employees_s3.py
"""
import random
from app.db.s3_storage import s3_storage
from app.core import crud_s3
from datetime import datetime
import json
from faker import Faker

# Use generic Faker for addresses/phone/etc, but custom logic for names
fake = Faker('en_IN')

# Combined Indian Names Pool (South + North for variety)
INDIAN_FirstNames_Male = [
    # South
    "Karthik", "Sandeep", "Venkatesh", "Srinivas", "Rajesh", "Suresh", "Ramesh", "Harish", 
    "Praveen", "Naveen", "Manoj", "Sai", "Krishna", "Shiva", "Kumar", "Vinay", "Vijay", 
    "Mahesh", "Ganesh", "Ravi", "Vishnu", "Arjun", "Kiran", "Pradeep", "Raghu", "Mohan", 
    "Nagarjuna", "Brahma", "Chandra", "Surya", "Aditya", "Manikanta", "Pavan", "Kalyan", 
    "Santosh", "Anil", "Sunil", "Prasad", "Narsimha", "Govind", "Swami", "Aravind", "Vikram",
    "Sanjay", "Ajay", "Ashok", "Bhaskar", "Dinesh", "Gopal", "Hari", "Jagadish",
    # North
    "Rahul", "Amit", "Vikash", "Deepak", "Neeraj", "Manish", "Vivek", "Abhishek", "Piyush",
    "Rohan", "Saurabh", "Ankit", "Sumit", "Gaurav", "Varun", "Ishaan", "Arav", "Vihaan",
    "Arnav", "Kabir", "Aryan", "Ayaan", "Ishwar", "Dev", "Yash", "Kartik", "Harsh"
]

INDIAN_FirstNames_Female = [
    # South
    "Lakshmi", "Priya", "Kavya", "Divya", "Anjali", "Meena", "Swathi", "Jyothi", "Shilpa", 
    "Roopa", "Shruthi", "Padmavathi", "Usha", "Geetha", "Sridevi", "Bhavana", "Aruna", "Deepa", 
    "Rekha", "Vani", "Sushma", "Madhavi", "Radha", "Sujatha", "Latha", "Hema", "Indira", 
    "Jaya", "Kalyani", "Lalitha", "Malathi", "Nalini", "Parvathi", "Rajeshwari", "Saraswathi", 
    "Uma", "Varalakshmi", "Vijaya", "Shanti", "Revathi", "Saritha", "Anusha", "Sindhu", 
    "Sirisha", "Swapna", "Sowmya", "Manjula", "Sunitha", "Anita", "Ramya",
    # North
    "Sneha", "Pooja", "Neha", "Aarti", "Riya", "Sakshi", "Megha", "Ishita", "Ananya",
    "Kriti", "Kiara", "Myra", "Saanvi", "Aavya", "Zoya", "Avni", "Tanya", "Navya",
    "Prisha", "Ira", "Sara", "Myra", "Diya", "Vanya", "Pari", "Sia"
]

INDIAN_Surnames = [
    # South
    "Reddy", "Rao", "Naidu", "Chowdary", "Nair", "Menon", "Iyer", "Iyengar", "Pillai", 
    "Goud", "Shetty", "Patil", "Kulkarni", "Deshpande", "Joshi", "Raghavan", "Balasubramanian", 
    "Krishnamurthy", "Chettiar", "Gowda", "Kamath", "Pai", "Hegde", "Bhat", "Acharya", 
    "Murthy", "Sastry", "Sharma", "Varma", "Raju", "Yadav", "Mudaliar", "Gounder", "Nadars",
    "Thevar", "Kamma", "Kapu", "Velama", "Boya", "Kuruba",
    # North
    "Sharma", "Gupta", "Verma", "Singh", "Agarwal", "Malhotra", "Khanna", "Kapoor", "Mehra",
    "Chopra", "Bansal", "Goel", "Mishra", "Trivedi", "Pandey", "Chatterjee", "Mukherjee",
    "Srivastava", "Saxena", "Chauhan", "Rathore", "Pathak", "Kaur", "Grover"
]

ROLES = {
    'branch_manager': ["dashboard:read", "user:read", "user:write", "branch:read", "loan:approve", "transaction:view", "report:generate"],
    'assistant_manager': ["branch:read", "loan:review", "user:read"],
    'teller': ["transaction:create", "transaction:view", "customer:verify", "account:balance"],
    'loan_officer': ["loan:view", "loan:create", "client:assess", "document:verify"],
    'customer_service': ["customer:read", "customer:update", "ticket:create", "ticket:resolve"],
    'operations_staff': ["operation:read", "operation:write"],
    'compliance_officer': ["audit:read", "fraud:view", "compliance:write"],
    'it_support': ["system:read", "user:reset_password"],
    'accountant': ["finance:read", "finance:write", "report:generate"],
    'relationship_manager': ["customer:read", "customer:write", "loan:create"],
    'audit_officer': ["audit:read", "transaction:view", "report:audit"],
    'security_officer': ["logs:view", "access:monitor", "alert:respond"],
    'administration': ["office:manage", "user:read", "report:generate", "inventory:manage"],
    'cashier': ["transaction:create", "cash:manage", "vault:access"]
}

ROLE_DEPARTMENTS = {
    'branch_manager': "Branch Management",
    'assistant_manager': "Branch Management",
    'teller': "Cash & Transactions",
    'cashier': "Cash & Transactions",
    'loan_officer': "Credit & Loans",
    'relationship_manager': "Retail Banking",
    'customer_service': "Customer Relations",
    'operations_staff': "Operations",
    'compliance_officer': "Compliance & Risk",
    'it_support': "Information Technology",
    'accountant': "Accounts & Finance",
    'audit_officer': "Internal Audit",
    'security_officer': "Security",
    'administration': "Administration"
}

EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"]

# Verified Indian States and Major Cities/Locations for Branches
INDIAN_BRANCHES_DATA = {
    "Telangana": ["Hyderabad - Gachibowli", "Hyderabad - Banjara Hills", "Warangal - Main", "Karimnagar - Tower Circle", "Nizamabad - Bus Stand"],
    "Andhra Pradesh": ["Visakhapatnam - MVP Colony", "Vijayawada - MG Road", "Guntur - Brodipet", "Tirupati - Balaji Colony", "Nellore - Trunk Road"],
    "Karnataka": ["Bangalore - Indiranagar", "Bangalore - Whitefield", "Mysore - Palace Road", "Mangalore - Hampankatta", "Hubli - Vidyanagar"],
    "Tamil Nadu": ["Chennai - T Nagar", "Chennai - Adyar", "Coimbatore - Gandhipuram", "Madurai - Anna Nagar", "Salem - Fairlands"],
    "Maharashtra": ["Mumbai - Bandra", "Mumbai - Andheri", "Pune - Hinjewadi", "Nagpur - Dharampeth", "Nashik - College Road"],
    "Delhi": ["New Delhi - Connaught Place", "South Delhi - Saket", "East Delhi - Laxmi Nagar", "North Delhi - Rohini", "West Delhi - Janakpuri"],
    "Gujarat": ["Ahmedabad - Satellite", "Surat - Adajan", "Vadodara - Alkapuri", "Rajkot - Kalavad Road", "Gandhinagar - Sector 21"],
    "West Bengal": ["Kolkata - Salt Lake", "Kolkata - Park Street", "Siliguri - Hill Cart Road", "Durgapur - City Centre", "Asansol - GT Road"],
    "Uttar Pradesh": ["Lucknow - Hazratganj", "Kanpur - The Mall", "Noida - Sector 18", "Ghaziabad - Raj Nagar", "Agra - MG Road"],
    "Kerala": ["Kochi - MG Road", "Thiruvananthapuram - Kowdiar", "Kozhikode - Mavoor Road", "Thrissur - Round North", "Kollam - Chinnakada"],
    "Rajasthan": ["Jaipur - C Scheme", "Udaipur - Chetak Circle", "Jodhpur - Sardarpura", "Kota - Talwandi", "Ajmer - Vaishali Nagar"],
    "Madhya Pradesh": ["Bhopal - MP Nagar", "Indore - Vijay Nagar", "Gwalior - City Centre", "Jabalpur - Napier Town", "Ujjain - Freeganj"]
}

# Generate flat list of branches with structured data
BRANCH_LIST = []
for state, cities in INDIAN_BRANCHES_DATA.items():
    for i, city in enumerate(cities):
        state_code = state[:3].upper()
        branch_id = f"BR-{state_code}-{100 + i}"
        BRANCH_LIST.append({
            "id": branch_id, 
            "name": city,
            "city": city.split(' - ')[0],
            "location": f"{city}, {state}", 
            "state": state
        })

def clear_existing_employees():
    print("🧹 Clearing existing employee data (preserving Admin)...")
    try:
        employees = s3_storage._get_data_from_file(s3_storage.employees_file)
        preserved_users = [u for u in employees if u.get('email') == 'admin@sentinelx.com']
        
        data = {
            'employees': preserved_users,
            'last_updated': datetime.utcnow().isoformat(),
            'total_count': len(preserved_users)
        }
        
        s3_storage.s3_client.put_object(
            Bucket=s3_storage.bucket,
            Key=s3_storage.employees_file,
            Body=json.dumps(data, indent=2),
            ContentType='application/json'
        )
        print(f"✅ Cleared old data. Preserved {len(preserved_users)} admin(s).")
    except Exception as e:
        print(f"⚠️ Warning: Could not clear data: {e}")

def generate_employee_id():
    current_year = datetime.now().strftime('%y')
    random_num = random.randint(1000, 9999)
    return f"{current_year}{random_num}"

def seed_employees(count=300):
    clear_existing_employees()

    num_branches = len(BRANCH_LIST)
    if count < num_branches:
        count = num_branches

    print(f"🚀 Starting employee seeding process for {count} employees...")
    print(f"🌍 Using Expanded Indian context (North & South).")
    
    created_count = 0
    
    # 1. Create Branch Managers
    print("👔 Seeding Branch Managers...")
    for branch in BRANCH_LIST:
        try:
            role = 'branch_manager'
            permissions = ROLES[role]
            
            is_male = random.choice([True, False])
            first_name = random.choice(INDIAN_FirstNames_Male) if is_male else random.choice(INDIAN_FirstNames_Female)
            last_name = random.choice(INDIAN_Surnames)
            
            base_username = f"{first_name.lower()}{last_name.lower()}"
            username = base_username
            
            if crud_s3.get_user_by_username(username):
                 username = f"{base_username}{random.randint(1, 999)}"
            
            email = f"{username}@sentinelx.com"
            if crud_s3.get_user_by_email(email): continue

            additional_data = {
                "firstName": first_name,
                "lastName": last_name,
                "phone": fake.phone_number(),
                "address": fake.address().replace('\n', ', '),
                "city": branch['city'],
                "state": branch['state'],
                "pincode": fake.postcode(),
                "dateOfBirth": fake.date_of_birth(minimum_age=30, maximum_age=55).isoformat(),
                "employeeId": generate_employee_id(),
                "dateOfJoining": fake.date_between(start_date='-10y', end_date='-1y').isoformat(),
                "department": ROLE_DEPARTMENTS.get(role, "Branch Management"),
                "branch": branch["location"],
                "branchId": branch["id"],
                "employmentType": "Full-time",
                "salary": str(random.randint(80000, 250000)),
                "emergencyContact": fake.name(),
                "emergencyPhone": fake.phone_number()
            }
            
            crud_s3.create_user(username=username, email=email, password="Sentinel@123", role=role, permissions=permissions, **additional_data)
            created_count += 1
        except Exception as e:
            print(f"❌ Failed to create manager: {e}")

    print(f"✅ Created {created_count} Branch Managers.")

    # 2. Create Remaining Staff
    remaining_count = count - created_count
    if remaining_count > 0:
        print(f"👥 Seeding {remaining_count} additional staff members...")
        
        staff_roles = [r for r in ROLES.keys() if r not in ['branch_manager', 'admin']]
        
        for i in range(remaining_count):
            try:
                role = random.choice(staff_roles)
                permissions = ROLES[role]
                branch = random.choice(BRANCH_LIST)
                
                is_male = random.choice([True, False])
                first_name = random.choice(INDIAN_FirstNames_Male) if is_male else random.choice(INDIAN_FirstNames_Female)
                last_name = random.choice(INDIAN_Surnames)
                
                base_username = f"{first_name.lower()}{last_name.lower()}"
                username = base_username
                
                if crud_s3.get_user_by_username(username):
                     username = f"{base_username}{random.randint(1, 999)}"
                
                email = f"{username}@sentinelx.com"
                if crud_s3.get_user_by_email(email): continue

                additional_data = {
                    "firstName": first_name,
                    "lastName": last_name,
                    "phone": fake.phone_number(),
                    "address": fake.address().replace('\n', ', '),
                    "city": branch['city'],
                    "state": branch['state'],
                    "pincode": fake.postcode(),
                    "dateOfBirth": fake.date_of_birth(minimum_age=22, maximum_age=45).isoformat(),
                    "employeeId": generate_employee_id(),
                    "dateOfJoining": fake.date_between(start_date='-5y', end_date='today').isoformat(),
                    "department": ROLE_DEPARTMENTS.get(role, "Operations"),
                    "branch": branch["location"],
                    "branchId": branch["id"],
                    "employmentType": random.choice(EMPLOYMENT_TYPES),
                    "salary": str(random.randint(30000, 100000)),
                    "emergencyContact": fake.name(),
                    "emergencyPhone": fake.phone_number()
                }
                
                crud_s3.create_user(username=username, email=email, password="Sentinel@123", role=role, permissions=permissions, **additional_data)
                created_count += 1
                if created_count % 50 == 0:
                    print(f"   ... Total created: {created_count}")
                    
            except Exception as e:
                print(f"❌ Failed to create staff: {e}")

    print(f"\n🎉 Successfully seeded {created_count} Indian employees.")

if __name__ == "__main__":
    seed_employees(300)
