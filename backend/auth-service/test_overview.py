import requests

def test_overview():
    print("🧪 Testing Administration Overview Endpoint...")
    url = "http://localhost:8000/api/v1/auth/employee/administration/overview"
    
    # We need a token. Let's find a user and get a token.
    # For testing, we can use the 'admin' or 'chairman_admin' account if we can find the password.
    # Actually, let's just use a script that imports the app and calls the function directly to see the error.
    
    try:
        import os
        import sys
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))
        from app.db.s3_storage import s3_storage
        
        staff = s3_storage.get_admin_staff()
        leave = s3_storage.get_admin_leave()
        assets = s3_storage.get_admin_assets()
        vendors = s3_storage.get_admin_vendors()
        notices = s3_storage.get_admin_notices()
        
        print(f"📦 Data counts: Staff={len(staff)}, Leave={len(leave)}, Assets={len(assets)}, Vendors={len(vendors)}, Notices={len(notices)}")
        
        # Test the sum calculation which is the most likely failure point
        try:
            total_assets_value = sum([float(str(a.get('value', '0')).replace('₹', '').replace(',', '')) for a in assets])
            print(f"💰 Total Assets Value: {total_assets_value}")
        except Exception as e:
            print(f"❌ Error calculating asset value: {e}")
            for a in assets:
                print(f"   Asset: {a.get('name')}, Value: {a.get('value')}")

    except Exception as e:
        print(f"🔥 Critical Error: {e}")

if __name__ == "__main__":
    test_overview()
