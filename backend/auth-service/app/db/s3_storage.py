import boto3
import json
from typing import Optional, List
from app.core.config import settings
from app.models.user import UserInDB
import uuid
from datetime import datetime

class S3Storage:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        self.bucket = settings.S3_BUCKET_NAME
        self.employees_file = "users/employees.json"
        self.customers_file = "users/customers.json"
        self.branches_file = "users/branches.json"
        
        # Simple in-memory cache
        self._cache = {}
        self._cache_expiry = {}
        self._cache_ttl = 60 # seconds (Increased TTL)
        self._indices = {'id': {}, 'username': {}, 'email': {}}
        self._indices_built = False
        
    def _refresh_indices(self):
        """Build fast lookup indices from cached users"""
        all_users = self._get_all_users_flat()
        self._indices['id'] = {u.get('id'): u for u in all_users if u.get('id')}
        self._indices['username'] = {u.get('username'): u for u in all_users if u.get('username')}
        self._indices['email'] = {u.get('email'): u for u in all_users if u.get('email')}
        self._indices_built = True
        print(f"⚡ Indices refreshed: {len(all_users)} users")

    def _get_data_from_file(self, file_key: str, force_refresh: bool = False) -> List[dict]:
        """Get users from a specific JSON file with caching and lazy indexing"""
        now = datetime.utcnow().timestamp()
        
        # Check cache
        if not force_refresh and file_key in self._cache and now < self._cache_expiry.get(file_key, 0):
            return self._cache[file_key]
            
        try:
            print(f"📥 Fetching fresh data from S3: {file_key}")
            response = self.s3_client.get_object(
                Bucket=self.bucket,
                Key=file_key
            )
            data = json.loads(response['Body'].read())
            # Handle various keys for backward compatibility
            result = data.get('employees', data.get('customers', data.get('users', data.get('branches', []))))
            
            # Update cache
            self._cache[file_key] = result
            self._cache_expiry[file_key] = now + self._cache_ttl
            
            # If this was one of the user files, clear indices so they get rebuilt next time they are needed
            if file_key in [self.employees_file, self.customers_file]:
                self._indices_built = False
                
            return result
        except self.s3_client.exceptions.NoSuchKey:
            return []
        except Exception as e:
            print(f"Error reading file {file_key}: {e}")
            return []
    
    def _save_data_to_file(self, file_key: str, users: List[dict], key_name: str) -> None:
        """Save users to a specific JSON file and invalidate cache"""
        data = {
            key_name: users,
            'last_updated': datetime.utcnow().isoformat(),
            'total_count': len(users)
        }
        
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=file_key,
            Body=json.dumps(data, indent=2),
            ContentType='application/json'
        )
        
        # Update cache and indices immediately
        self._cache[file_key] = users
        self._cache_expiry[file_key] = datetime.utcnow().timestamp() + self._cache_ttl
        if file_key in [self.employees_file, self.customers_file]:
            self._refresh_indices()

    def _get_all_users_flat(self) -> List[dict]:
        """Get all users from both files merged"""
        employees = self._get_data_from_file(self.employees_file)
        customers = self._get_data_from_file(self.customers_file)
        return employees + customers

    def create_user(self, user_data: dict) -> dict:
        """Create a new user in the appropriate file"""
        user_id = str(uuid.uuid4())
        user_data['id'] = user_id
        user_data['created_at'] = datetime.utcnow().isoformat()
        user_data['updated_at'] = datetime.utcnow().isoformat()
        
        role = user_data.get('role', 'customer')
        
        if role == 'customer':
            file_key = self.customers_file
            key_name = 'customers'
        else:
            file_key = self.employees_file
            key_name = 'employees'
            
        users = self._get_data_from_file(file_key)
        users.append(user_data)
        self._save_data_to_file(file_key, users, key_name)
        
        return user_data
    
    def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Retrieve user by ID using index"""
        if not self._indices_built: self._refresh_indices()
        return self._indices['id'].get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        """Retrieve user by email using index"""
        if not self._indices_built: self._refresh_indices()
        return self._indices['email'].get(email)
    
    def get_user_by_username(self, username: str) -> Optional[dict]:
        """Retrieve user by username using index"""
        if not self._indices_built: self._refresh_indices()
        return self._indices['username'].get(username)
    
    def update_user(self, user_id: str, updates: dict) -> dict:
        """Update user data in whichever file it lives"""
        # Find which file the user is in from index
        user = self.get_user_by_id(user_id)
        if not user:
             raise ValueError(f"User {user_id} not found")
             
        role = user.get('role', 'customer')
        file_key = self.customers_file if role == 'customer' else self.employees_file
        key_name = 'customers' if role == 'customer' else 'employees'
        
        users = self._get_data_from_file(file_key)
        for i, u in enumerate(users):
            if u.get('id') == user_id:
                u.update(updates)
                u['updated_at'] = datetime.utcnow().isoformat()
                users[i] = u
                self._save_data_to_file(file_key, users, key_name)
                return u
        
        raise ValueError(f"User {user_id} not found in file")
    
    def delete_user(self, user_id: str) -> bool:
        """Delete a user from whichever file it lives"""
        user = self.get_user_by_id(user_id)
        if not user: return False
        
        role = user.get('role', 'customer')
        file_key = self.customers_file if role == 'customer' else self.employees_file
        key_name = 'customers' if role == 'customer' else 'employees'
        
        users = self._get_data_from_file(file_key)
        original_count = len(users)
        users = [u for u in users if u.get('id') != user_id]
        
        if len(users) < original_count:
            self._save_data_to_file(file_key, users, key_name)
            return True
        
        return False
    
    def list_all_users(self) -> List[dict]:
        """List all users from both files"""
        return self._get_all_users_flat()

    def list_customers(self) -> List[dict]:
        """Specifically list only customers"""
        return self._get_data_from_file(self.customers_file)

    def list_employees(self) -> List[dict]:
        """Specifically list only employees"""
        return self._get_data_from_file(self.employees_file)

    # --- New Administration Storage Methods ---

    def _save_admin_item(self, category: str, item_id: str, data: dict) -> None:
        """Save a single administration item to users/administration/{category}/{item_id}.json"""
        key = f"users/administration/{category}/{item_id}.json"
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=json.dumps(data, indent=2),
            ContentType='application/json'
        )

    def _list_admin_items(self, category: str) -> List[dict]:
        """List all items in a specific administration category"""
        prefix = f"users/administration/{category}/"
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket,
                Prefix=prefix
            )
            
            items = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    if obj['Key'].endswith('.json'):
                        obj_data = self.s3_client.get_object(Bucket=self.bucket, Key=obj['Key'])
                        items.append(json.loads(obj_data['Body'].read()))
            return items
        except Exception as e:
            print(f"Error listing admin items for {category}: {e}")
            return []

    def _delete_admin_item(self, category: str, item_id: str) -> None:
        """Delete a single administration item from users/administration/{category}/{item_id}.json"""
        key = f"users/administration/{category}/{item_id}.json"
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=key)
        except Exception as e:
            print(f"Error deleting admin item {item_id} from {category}: {e}")

    def get_admin_staff(self) -> List[dict]:
        return self._list_admin_items("staff")

    def save_admin_staff(self, staff_data: dict) -> None:
        item_id = staff_data.get('id', str(uuid.uuid4()))
        self._save_admin_item("staff", item_id, staff_data)

    def get_admin_leave(self) -> List[dict]:
        return self._list_admin_items("leave")

    def save_admin_leave(self, leave_data: dict) -> None:
        item_id = leave_data.get('id', str(uuid.uuid4()))
        self._save_admin_item("leave", item_id, leave_data)

    def get_admin_notices(self) -> List[dict]:
        return self._list_admin_items("notices")

    def save_admin_notice(self, notice_data: dict) -> None:
        item_id = notice_data.get('id', str(uuid.uuid4()))
        self._save_admin_item("notices", item_id, notice_data)

    def delete_admin_notice(self, notice_id: str) -> None:
        self._delete_admin_item("notices", notice_id)

    def get_admin_assets(self) -> List[dict]:
        return self._list_admin_items("assets")

    def save_admin_asset(self, asset_data: dict) -> None:
        item_id = asset_data.get('id', str(uuid.uuid4()))
        self._save_admin_item("assets", item_id, asset_data)

    def get_admin_vendors(self) -> List[dict]:
        return self._list_admin_items("vendors")

    def save_admin_vendor(self, vendor_data: dict) -> None:
        item_id = vendor_data.get('name', str(uuid.uuid4())).replace(' ', '_')
        self._save_admin_item("vendors", item_id, vendor_data)

    def delete_admin_vendor(self, vendor_id: str) -> None:
        self._delete_admin_item("vendors", vendor_id)

    # --- Branch Management Storage Methods ---

    def _save_branch_item(self, category: str, item_id: str, data: dict, branch_id: str = None) -> None:
        if branch_id:
            key = f"users/branch_management/{category}/{branch_id}/{item_id}.json"
        else:
            key = f"users/branch_management/{category}/{item_id}.json"
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=json.dumps(data, indent=2),
            ContentType='application/json'
        )

    def _list_branch_items(self, category: str, branch_id: str = None) -> List[dict]:
        if branch_id:
            prefix = f"users/branch_management/{category}/{branch_id}/"
        else:
            prefix = f"users/branch_management/{category}/"
            
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket,
                Prefix=prefix
            )
            items = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    if obj['Key'].endswith('.json'):
                        obj_data = self.s3_client.get_object(Bucket=self.bucket, Key=obj['Key'])
                        items.append(json.loads(obj_data['Body'].read()))
            return items
        except Exception as e:
            print(f"Error listing branch items for {category}: {e}")
            return []
            
    def get_staff_by_branch(self, branch_id: str) -> List[dict]:
        """Get staff members from employees.json who belong to the specific branch"""
        employees = self.list_employees()
        if not branch_id:
            return employees
            
        return [e for e in employees if e.get('branchId') == branch_id or e.get('branch') == branch_id]

    def get_branch_targets(self, branch_id: str = None) -> List[dict]:
        return self._list_branch_items("targets", branch_id)

    def save_branch_target(self, target_data: dict, branch_id: str = None) -> None:
        item_id = target_data.get('id', str(uuid.uuid4()))
        self._save_branch_item("targets", item_id, target_data, branch_id)

    def get_branch_reports(self, branch_id: str = None) -> List[dict]:
        return self._list_branch_items("reports", branch_id)

    def save_branch_report(self, report_data: dict, branch_id: str = None) -> None:
        item_id = report_data.get('id', str(uuid.uuid4()))
        self._save_branch_item("reports", item_id, report_data, branch_id)

    def get_branch_escalations(self, branch_id: str = None) -> List[dict]:
        return self._list_branch_items("escalations", branch_id)

    def save_branch_escalation(self, escalation_data: dict, branch_id: str = None) -> None:
        item_id = escalation_data.get('id', str(uuid.uuid4()))
        self._save_branch_item("escalations", item_id, escalation_data, branch_id)

    def get_branch_compliance(self, branch_id: str = None) -> List[dict]:
        return self._list_branch_items("compliance", branch_id)

    def save_branch_compliance(self, compliance_data: dict, branch_id: str = None) -> None:
        item_id = compliance_data.get('id', str(uuid.uuid4()))
        self._save_branch_item("compliance", item_id, compliance_data, branch_id)

    def get_branch_settings(self, branch_id: str = None) -> dict:
        if branch_id:
            key = f"users/branch_management/settings/{branch_id}/config.json"
        else:
            key = "users/branch_management/settings/config.json"
        try:
            response = self.s3_client.get_object(Bucket=self.bucket, Key=key)
            return json.loads(response['Body'].read())
        except Exception:
            return {}

    def save_branch_settings(self, settings_data: dict, branch_id: str = None) -> None:
        if branch_id:
            key = f"users/branch_management/settings/{branch_id}/config.json"
        else:
            key = "users/branch_management/settings/config.json"
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=json.dumps(settings_data, indent=2),
            ContentType='application/json'
        )

    def get_branch_performance(self, branch_id: str = None) -> dict:
        if branch_id:
            key = f"users/branch_management/performance/{branch_id}/stats.json"
        else:
            key = "users/branch_management/performance/stats.json"
        try:
            response = self.s3_client.get_object(Bucket=self.bucket, Key=key)
            return json.loads(response['Body'].read())
        except Exception:
            return {}

    def save_branch_performance(self, perf_data: dict, branch_id: str = None) -> None:
        if branch_id:
            key = f"users/branch_management/performance/{branch_id}/stats.json"
        else:
            key = "users/branch_management/performance/stats.json"
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=json.dumps(perf_data, indent=2),
            ContentType='application/json'
        )

    def get_branch_approvals(self, branch_id: str = None) -> List[dict]:
        # Merge manual approvals and customer-submitted applications
        manual_approvals = self._list_branch_items("approvals", branch_id)
        customer_apps = self._list_branch_items("customer_applications", branch_id)
        return manual_approvals + customer_apps

    def save_branch_approval(self, approval_data: dict, branch_id: str = None) -> None:
        item_id = approval_data.get('id', str(uuid.uuid4()))
        # If it's a customer application, we should update it in the customer_applications folder
        # so it reflects in the user's dashboard
        if item_id.startswith('APP-'):
            self._save_branch_item("customer_applications", item_id, approval_data, branch_id)
        else:
            self._save_branch_item("approvals", item_id, approval_data, branch_id)

    def save_customer_application(self, app_data: dict, branch_id: str = None) -> None:
        item_id = app_data.get('id', f"APP-{uuid.uuid4().hex[:6].upper()}")
        app_data['id'] = item_id
        if 'timestamp' not in app_data:
            app_data['timestamp'] = datetime.utcnow().isoformat()
        app_data['updated_at'] = datetime.utcnow().isoformat()
        self._save_branch_item("customer_applications", item_id, app_data, branch_id)

    def get_branch_staff(self, branch_id: str = None) -> List[dict]:
        return self.get_staff_by_branch(branch_id)

    def save_branch_staff(self, staff_data: dict, branch_id: str = None) -> None:
        # Instead of saving to a separate staff folder, we add them to the main employees list
        staff_data['branchId'] = branch_id
        staff_data['role'] = staff_data.get('role', 'Teller')
        self.create_user(staff_data)
        # Note: create_user handles the employees_file logic internally

    def get_user_applications(self, username: str, branch_id: str = None) -> List[dict]:
        user_profile = self.get_user_by_username(username)
        full_name = f"{user_profile.get('firstName', '')} {user_profile.get('lastName', '')}".strip() if user_profile else None
        
        all_apps = self._list_branch_items("customer_applications", branch_id)
        return [
            app for app in all_apps 
            if app.get('username') == username or (not app.get('username') and app.get('customer') == full_name)
        ]

    def get_branches(self) -> List[dict]:
        """List all branches from branches.json"""
        return self._get_data_from_file(self.branches_file)

    def save_branch(self, branch_data: dict) -> dict:
        """Add or update a branch in branches.json"""
        branches = self.get_branches()
        
        if 'id' not in branch_data:
            branch_data['id'] = f"BR-{uuid.uuid4().hex[:6].upper()}"
            branch_data['created_at'] = datetime.utcnow().isoformat()
            branch_data['status'] = branch_data.get('status', 'Active')
            branches.append(branch_data)
        else:
            # Update existing
            for i, b in enumerate(branches):
                if b.get('id') == branch_data['id']:
                    branches[i].update(branch_data)
                    break
            else:
                # If ID was provided but not found, add it
                branches.append(branch_data)
                
        self._save_data_to_file(self.branches_file, branches, 'branches')
        return branch_data

# Singleton instance
s3_storage = S3Storage()
