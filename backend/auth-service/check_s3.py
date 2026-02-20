import os
import sys

# Add the project root to sys.path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app.db.s3_storage import s3_storage

def check_s3_data():
    categories = ["staff", "leave", "assets", "vendors", "notices"]
    print("🔍 Checking S3 Administration Data...")
    
    for cat in categories:
        items = s3_storage._list_admin_items(cat)
        print(f"📁 Category '{cat}': Found {len(items)} items")
        if items:
            print(f"   First item ID: {items[0].get('id') or items[0].get('name')}")

if __name__ == "__main__":
    check_s3_data()
