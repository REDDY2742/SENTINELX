import sys
import os
import time
from playwright.sync_api import sync_playwright

# Add current directory to path for imports
sys.path.append(os.getcwd())

def test_all_roles_login():
    print(f"🐍 Python Executable: {sys.executable}")
    
    try:
        from app.db.s3_storage import s3_storage
    except ImportError as e:
        print(f"❌ Dependency Error: {e}")
        return

    print("🔍 Fetching sample employees for all 14 roles...")
    employees = s3_storage.list_employees()
    
    roles_to_test = [
        "branch_manager", "assistant_manager", "teller", "cashier", 
        "loan_officer", "relationship_manager", "customer_service", 
        "operations_staff", "compliance_officer", "it_support", 
        "accountant", "audit_officer", "security_officer", "administration"
    ]
    
    test_set = []
    for role in roles_to_test:
        user = next((u for u in employees if u.get('role') == role), None)
        if user:
            test_set.append(user)

    if not test_set:
        print("❌ No employees found.")
        return

    print(f"✅ Found {len(test_set)} roles. Launching Automated Browser...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--start-maximized'])
        
        # Single context for all tabs in one window
        context = browser.new_context(no_viewport=True)
        pages = []
        
        for user in test_set:
            role_label = user['role'].upper().replace('_', ' ')
            print(f"🔑 [{role_label}] Opening new tab for: {user['email']}")
            
            try:
                # Open in a new tab
                page = context.new_page()
                pages.append(page)
                
                page.goto("http://localhost:5173/login", timeout=60000)
                page.click('button:has-text("Corporate Login")')
                page.fill('input[placeholder*="Email"]', user['email'])
                page.fill('input[placeholder="Password"]', "Sentinel@123")
                
                page.click('button:has-text("Secure Login")')
                print(f"   ⏳ [{role_label}] Logging in...")
                
                try:
                    page.wait_for_selector("nav", timeout=15000)
                    print(f"   🎉 [{role_label}] Success!")
                except:
                    print(f"   ⚠️ [{role_label}] Dashboard wait timed out.")
                
                # Small pause between tab creations
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ [{role_label}] Error: {str(e)}")

        print("\n" + "="*50)
        print("✨ MULTI-TAB LOGIN COMPLETE")
        print(f"   Total Tabs: {len(pages)}")
        print("="*50)
        print("\nPress Ctrl+C to close.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            browser.close()

if __name__ == "__main__":
    test_all_roles_login()
