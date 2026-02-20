# SentinelX Auth Service - S3 Storage

## ⚠️ IMPORTANT NOTICE

This authentication service now uses **AWS S3** for data storage instead of a traditional database.

**Note**: This is an unconventional approach. S3 is designed for file storage, not as a database replacement. This setup is for development/testing purposes only.

## Data Storage Structure in S3

Your S3 bucket (`sentinely`) now contains:

```
sentinely/
├── users/
│   └── {user_id}.json          # Each user stored as individual JSON file
├── indexes/
│   ├── email/
│   │   └── admin_at_sentinelx_com.txt  # Email -> user_id mapping
│   └── username/
│       └── chairman_admin.txt   # Username -> user_id mapping
```

## Setup Complete ✅

- **Admin User Created**: admin@sentinelx.com / admin@123
- **Role**: chairman
- **Storage**: AWS S3 bucket `sentinely`

## Start the Backend Server

```bash
python -m uvicorn main:app --reload --port 8000
```

## Testing

1. Go to frontend login page
2. Enter: `admin@sentinelx.com` / `admin@123`
3. You'll be redirected to `/chairman` dashboard

## View Your Data in S3

1. Go to AWS S3 Console
2. Open bucket `sentinely`
3. Navigate to `users/` folder
4. Download any `.json` file to see user data

## Security Notes

- All passwords are hashed with Argon2
- JWTs are used for authentication
- Refresh tokens stored as hashed values
- Rate limiting active on login endpoints

## Limitations of S3 Storage

- **No transactions**: Data changes are not atomic
- **Slow queries**: Must download all files to search
- **No relationships**: Can't join data like SQL
- **Scalability issues**: Will slow down with many users
- **Concurrent writes**: Risk of data conflicts

**Recommendation**: For production, switch to RDS PostgreSQL or DynamoDB.
