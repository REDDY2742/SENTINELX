# SentinelX Auth Service Setup Guide

## Prerequisites

- Python 3.9+
- AWS RDS PostgreSQL instance (configured in `.env`)

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Update `.env` file with your AWS RDS credentials:

```env
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
```

### 3. Create Database Tables & Seed Admin User

```bash
python seed_admin.py
```

This will:

- Create all database tables
- Create the chairman admin user with:
  - Email: `admin@sentinelx.com`
  - Password: `admin@123`
  - Role: `chairman`

### 4. Run the Auth Service

```bash
uvicorn main:app --reload --port 8000
```

The service will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## Testing Login

### Frontend Login

1. Navigate to the frontend login page
2. Enter credentials:
   - Email: `admin@sentinelx.com`
   - Password: `admin@123`
3. You will be redirected to `/chairman` dashboard

### API Testing (cURL)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@sentinelx.com", "password": "admin@123"}'
```

## Security Notes

- Change the `SECRET_KEY` in production
- Never commit `.env` file to version control
- Use strong passwords in production
- Enable 2FA for sensitive accounts
