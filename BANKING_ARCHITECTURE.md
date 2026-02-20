# Sentinel Bank - Enterprise Banking System Architecture

## 1. High-Level System Architecture

Sentinel Bank adopts a **Hybrid Microservices Architecture**. Core banking functions are decoupled from the user-facing gateways, ensuring security, scalability, and independent deployment.

### System Diagram

```mermaid
graph TD
    User[Customer] -->|HTTPS| CDN[CloudFront CDN]
    CDN -->|Static Assets| S3[S3 Bucket (React App)]
    User -->|API Calls (HTTPS)| LB[AWS Application Load Balancer]

    LB -->|/api/v1| Gateway[API Gateway (Kong/Nginx)]

    subgraph "Frontend Layer (React)"
        Public[Public Website]
        Portal[Customer Portal]
        AdminUI[Admin Panel]
    end

    subgraph "Service Layer (Backend)"
        AuthService[Auth Service (Identity, JWT, OTP)]
        CoreService[Core Banking Service (Accounts, Transfers, Beneficiaries)]
        LoanService[Loan Service (Applications, EMI, Approvals)]
        FraudService[Fraud/Risk Engine (SentinelX Legacy)]
        NotifService[Notification Service (Email, SMS)]
    end

    subgraph "Data Layer"
        UserDB[(Users & Roles DB)]
        CoreDB[(Core Banking DB - ACID)]
        LoanDB[(Loans DB)]
        RiskDB[(Risk Analysis DB)]
        Redis[(Redis Cache - Sessions/OTP)]
    end

    Gateway --> AuthService
    Gateway --> CoreService
    Gateway --> LoanService

    CoreService -->|Async Event| Kafka{Kafka Event Bus}
    LoanService -->|Async Event| Kafka

    Kafka --> FraudService
    Kafka --> NotifService

    AuthService --> UserDB
    CoreService --> CoreDB
    LoanService --> LoanDB
    FraudService --> RiskDB
```

---

## 2. Microservices & API Design (REST)

We utilize **FastAPI (Python)** for high-performance, async I/O services.

### A. Auth Service (`/auth`)

- **Login**: `POST /auth/login` (Returns JWT Access + Refresh Token)
- **Register**: `POST /auth/register` (Customer onboarding)
- **OTP**: `POST /auth/otp/generate`, `POST /auth/otp/verify`

### B. Core Banking Service (`/core`)

- **Accounts**: `GET /accounts/{id}/balance`
- **Transactions**: `GET /accounts/{id}/transactions?limit=50`
- **Transfer**: `POST /transfers` (Internal & External)
  - Payload: `{ "from_account": "ACC1", "to_account": "ACC2", "amount": 500, "otp": "123456" }`
- **Beneficiaries**: `POST /beneficiaries`

### C. Loan Service (`/loans`)

- **Apply**: `POST /loans/apply`
- **Status**: `GET /loans/{id}/status`
- **EMI**: `POST /loans/calculate-emi`

### D. Fraud/Risk Service (`/risk`)

- **Score Transaction**: `POST /risk/score` (Internal Only)
- **Webhooks**: Consumes Kafka `transaction.created` events.

---

## 3. Database Design (PostgreSQL Schemas)

### Users Table (Auth Service)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('USER', 'MANAGER', 'CHAIRMAN', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Accounts Table (Core Service)

```sql
CREATE TABLE accounts (
    account_number VARCHAR(20) PRIMARY KEY,
    user_id UUID NOT NULL, -- Reference to User ID from Auth Service (Logical FK)
    type VARCHAR(20) CHECK (type IN ('SAVINGS', 'CURRENT', 'CREDIT')),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency CHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

### Transactions Table (Core Service)

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_account VARCHAR(20) NOT NULL REFERENCES accounts(account_number),
    dest_account VARCHAR(20), -- Can be external
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('CREDIT', 'DEBIT')),
    category VARCHAR(50),
    reference_id VARCHAR(50), -- For external bank ref
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Loans Table (Loan Service)

```sql
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('PERSONAL', 'HOME', 'AUTO')),
    interest_rate DECIMAL(5, 2),
    tenure_months INT,
    status VARCHAR(20) DEFAULT 'PENDING_APPROVAL',
    approved_by UUID -- Reference to Manager ID
);
```

---

## 4. Security Architecture

1.  **JWT Authentication**: Stateless authentication. Access tokens expire in 15 mins; Refresh tokens in 7 days.
2.  **Role-Based Access Control (RBAC)**:
    - `USER`: Access own accounts/loans.
    - `MANAGER`: Access branch approvals, customer search.
    - `CHAIRMAN`: Read-only access to global stats.
3.  **OTP System**:
    - Simulated Generator: `HMAC(secret + timestamp)`
    - Required for high-value transfers (> $1000) and adding beneficiaries.
4.  **Encryption**:
    - TLS 1.3 for all data in transit.
    - AES-256 for sensitive data at rest (SSN, Tax ID) in the database.
5.  **Rate Limiting**:
    - 100 req/min for general APIs.
    - 5 req/min for Login/OTP endpoints (Prevent Brute Force).

---

## 5. Deployment Plan (AWS + Docker)

### Containerization

Each service has its own `Dockerfile`.

- **Wrapper**: `docker-compose.yml` for local dev.
- **Production**: Amazon EKS (Kubernetes).

### Pipeline (GitHub Actions)

1.  **Build**: Lint code -> Run Unit Tests -> Build Docker Image.
2.  **Push**: Push image to Amazon ECR.
3.  **Deploy**: Update EKS Deployment manifest -> Rollout Restart.

### Infrastructure

- **EC2 / Fargate**: Compute nodes for containers.
- **RDS (Postgres)**: Managed database with automated backups.
- **ElastiCache (Redis)**: For session management and caching API responses.
- **MSK (Managed Kafka)**: For event streaming.

---

## 6. Frontend Folder Structure (React)

```
src/
├── components/         # Reusable UI (Buttons, Inputs, Cards)
├── layouts/            # Layout wrappers (AuthLayout, DashboardLayout)
├── pages/
│   ├── public/         # Public Website
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Login.tsx
│   │   └── EMICalculator.tsx
│   ├── user/           # Customer Portal
│   │   ├── UserDashboard.tsx
│   │   ├── Transfers.tsx
│   │   └── Profile.tsx
│   ├── manager/        # Admin Panel
│   │   ├── ManagerDashboard.tsx
│   │   └── LoanApprovals.tsx
│   └── chairman/       # Executive Panel
│       └── ChairmanDashboard.tsx
├── services/           # API Integration (Axios)
└── context/            # AuthContext, ThemeContext
```

## 7. Extra Features Implementation

### AI Spending Insights

- **Logic**: Run clustering (K-Means) on user transaction history.
- **Output**: "You spend 40% more on Coffee than the average user."
- **Tech**: Python `scikit-learn` in a background worker.

### Fraud Detection

- **Logic**: Rules Engine + ML Model (XGBoost) scoring every transaction.
- **Action**: If Score > 80, Block Transaction & Alert Manager.
