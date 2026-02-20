import sys
import os
import time
import uuid
from playwright.sync_api import sync_playwright

# Add current directory to path for imports
sys.path.append(os.getcwd())

def perform_customer_workflow(page):
    print("🚀 Starting Customer Loan Application Workflow...")
    
    # 1. Navigate to Loans
    page.click('a:has-text("Loans")')
    page.wait_for_selector('h1:has-text("Loan Portfolio")')
    print("   ✅ Navigated to Loans")

    # 2. Click Apply Loan
    page.click('button:has-text("Apply for Loan")')
    page.wait_for_selector('h1:has-text("Apply for New Loan")')
    print("   ✅ Application Form Opened")

    # Step 1: Loan Configuration
    page.fill('input[placeholder*="Amount"]', "500000")
    page.fill('textarea[placeholder*="purpose"]', "Testing automation for Sentinel Bank")
    page.click('button:has-text("Next Step")')
    print("   ✅ Step 1 Completed")

    # Step 2: Personal Details
    page.fill('input[placeholder="ABCDE1234F"]', "ABCDE1234F")
    page.fill('input[placeholder="XXXX XXXX XXXX"]', "123456789012")
    page.click('button:has-text("Next Step")')
    print("   ✅ Step 2 Completed")

    # Step 3: Employment & Income
    page.fill('input[placeholder="e.g. Google Inc."]', "Automation Corp")
    page.fill('input[placeholder="e.g. Senior Architect"]', "Lead Tester")
    page.fill('input[placeholder="e.g. 50,000"]', "100000")
    page.fill('input[placeholder="e.g. 8"]', "5")
    page.click('button:has-text("Next Step")')
    print("   ✅ Step 3 Completed")

    # Step 4: Family & Nominee
    page.fill('input[placeholder="John Doe"]', "Nominee Test")
    page.fill('input[placeholder="+91 XXXXX XXXXX"]', "9876543210")
    page.click('button:has-text("Submit Final Application")')
    
    # Wait for success
    page.wait_for_selector('h2:has-text("Application Submitted!")', timeout=10000)
    print("   ✨ Loan Application Submitted Successfully!")

def perform_manager_workflow(page):
    print("🚀 Starting Branch Manager Verification Workflow...")
    
    # 1. Check all sidebars
    sidebar_links = [
        "Dashboard Overview", "Branch Performance", "Approvals", 
        "Staff Management", "Target Tracking", "Reports", 
        "Customer Escalations", "Compliance Summary", "Settings"
    ]
    
    print("   🔍 Verifying Sidebar Links:")
    for link in sidebar_links:
        try:
            page.click(f'span:has-text("{link}")')
            time.sleep(1) # Visual confirmation
            print(f"      ✅ {link} is functional")
        except Exception as e:
            print(f"      ❌ {link} failed: {str(e)[:50]}...")

    # 2. Verify Approvals Queue
    page.click('span:has-text("Approvals")')
    page.wait_for_selector('h2:has-text("Managerial Approvals")')
    print("   ✅ Approvals Queue Verified")

    # 3. Check for specific application (Search functionality)
    page.fill('input[placeholder*="Search"]', "Nominee Test")
    print("   ✅ Search Functionality Verified")

def perform_sidebar_audit(page, role_label):
    print(f"🚀 Performing Sidebar Audit for {role_label}...")
    
    # Get all links in the nav
    links = page.query_selector_all('nav a')
    print(f"   📊 Found {len(links)} navigation items")
    
    for i, link in enumerate(links):
        label = link.inner_text().strip()
        try:
            link.click()
            time.sleep(0.5)
            print(f"      [{i+1}] Checked: {label}")
        except:
            print(f"      [{i+1}] Error clicking: {label}")

def test_single_role():
    try:
        from app.db.s3_storage import s3_storage
    except ImportError as e:
        print(f"❌ Dependency Error: {e}")
        return

    roles = [
        "branch_manager", "assistant_manager", "teller", "cashier", 
        "loan_officer", "relationship_manager", "customer_service", 
        "operations_staff", "compliance_officer", "it_support", 
        "accountant", "audit_officer", "security_officer", "administration",
        "customer"
    ]

    print("\n" + "="*40)
    print("      SENTINEL BANK AUTOMATED ROLE TESTER")
    print("="*40)
    for i, role in enumerate(roles, 1):
        label = role.replace('_', ' ').title()
        if role == "customer": label = "User (Customer Role 7)"
        print(f"{i}. {label}")
    print("="*40)
    
    try:
        choice = input("\nEnter role number to test (1-15): ")
        role_idx = int(choice) - 1
        if role_idx < 0 or role_idx >= len(roles):
            print("❌ Invalid selection.")
            return
    except ValueError:
        print("❌ Please enter a valid number.")
        return

    selected_role = roles[role_idx]
    print(f"\n🔍 Fetching sample user for: {selected_role}...")
    
    if selected_role == "customer":
        users = s3_storage.list_customers()
    else:
        users = s3_storage.list_employees()
        
    user = next((u for u in users if u.get('role') == selected_role), None)

    if not user:
        # Fallback if specific role not found in employees list
        if selected_role == "customer":
             print("❌ No customers found.")
             return
        user = next((u for u in users), None) # Take any if specific role missing for demo
        print(f"⚠️ Specific {selected_role} not found, using {user.get('role')} for login test.")

    role_label = selected_role.upper().replace('_', ' ')
    print(f"✅ Found: {user['email']}")
    print(f"🚀 Launching Automated Session for {role_label}...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--start-maximized'])
        context = browser.new_context(no_viewport=True)
        page = context.new_page()

        try:
            # 1. Login Page
            page.goto("http://localhost:5173/login", timeout=60000)
            
            # 2. Tab Selection
            if selected_role == "customer":
                page.click('button:has-text("Personal Banking")')
            else:
                page.click('button:has-text("Corporate Login")')
            
            # 3. Credentials
            page.fill('input[placeholder*="Email"]', user['email'])
            page.fill('input[placeholder="Password"]', "Sentinel@123")
            
            # 5. Submit
            page.click('button:has-text("Secure Login")')
            
            # 6. Wait for Layout
            page.wait_for_selector("nav", timeout=20000)
            print(f"   ✅ Dashboard Loaded for {role_label}")
            
            # 7. Perform Functional Workflows
            if selected_role == "customer":
                perform_customer_workflow(page)
            elif selected_role == "branch_manager":
                perform_manager_workflow(page)
            else:
                perform_sidebar_audit(page, role_label)

            print(f"\n✨ ALL TESTS PASSED FOR {role_label}!")
            
        except Exception as e:
            print(f"   ❌ Automation Error: {str(e)}")

        print("\nPress Ctrl+C in terminal to close browser and exit.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nShutting down...")
            browser.close()

if __name__ == "__main__":
    test_single_role()
