import requests
import json

def debug():
    base_url = "http://localhost:8000"
    
    # 1. Login to get token
    login_data = {
        "username": "anjaliverma89",
        "password": "Sentinel@123"
    }
    print(f"Logging in as {login_data['username']}...")
    res = requests.post(f"{base_url}/api/v1/auth/login", json=login_data)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code} - {res.text}")
        return
    
    token = res.json()["access_token"]
    print("Login successful.")
    
    # 2. Call dashboard
    print("Calling employee dashboard...")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{base_url}/api/v1/auth/employee/dashboard", headers=headers)
    
    print(f"Status: {res.status_code}")
    try:
        data = res.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print(f"Response (text): {res.text}")

if __name__ == "__main__":
    debug()
