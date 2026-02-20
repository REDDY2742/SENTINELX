import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def create_s3_folders():
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION', 'ap-south-1')
    )
    bucket = os.getenv('S3_BUCKET_NAME')
    
    folders = [
        'users/branch_management/',
        'users/branch_management/targets/',
        'users/branch_management/reports/',
        'users/branch_management/escalations/',
        'users/branch_management/compliance/',
        'users/branch_management/performance/',
        'users/branch_management/approvals/',
        'users/branch_management/staff/',
        'users/branch_management/settings/',
        'users/branchmanagers/' # As specifically requested
    ]
    
    for folder in folders:
        try:
            s3.put_object(Bucket=bucket, Key=folder)
            print(f"Created folder: {folder}")
        except Exception as e:
            print(f"Error creating {folder}: {e}")

if __name__ == "__main__":
    create_s3_folders()
