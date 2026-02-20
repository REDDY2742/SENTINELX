# SentinelX Architecture Blueprint

## 1. High-Level System Architecture

SentinelX is designed as an event-driven microservices architecture to handle high-throughput financial transactions and real-time risk assessment.

### System Diagram (Text Representation)

```mermaid
graph TD
    Client[Web/Mobile Client] -->|HTTPS/WSS| APIG[API Gateway (Kong/Nginx)]
    APIG -->|Auth Request| Auth[Auth Service]
    APIG -->|Transaction Data| Trans[Transaction Service]

    subgraph "Core Processing (Async)"
        Trans -->|Produces: tx.created| Kafka{Kafka Message Broker}
        Kafka -->|Consumes: tx.created| Risk[Risk Engine Service]
        Kafka -->|Consumes: tx.created| ML[ML Service]

        Risk -->|Produces: risk.score| Kafka
        ML -->|Produces: ml.prediction| Kafka

        Risk -->|Consumes: ml.prediction| Risk

        Risk -->|Produces: alert.created| Kafka
    end

    subgraph "Downstream Actions"
        Kafka -->|Consumes: alert.created| Alert[Alert Service]
        Kafka -->|Consumes: alert.created| Notif[Notification Service]
        Alert -->|Push Update| Socket[WebSocket Server]
    end

    Socket -->|Real-time Socket| Client

    subgraph "Data Persistence"
        Auth --> AuthDB[(PostgreSQL - Users)]
        Trans --> TransDB[(PostgreSQL - Transactions)]
        Risk --> Redis[(Redis - Rules/Cache)]
        Alert --> AlertDB[(PostgreSQL - Alerts)]
        ML --> ModelStore[(S3/MinIO - Models)]
    end
```

### Key Components

- **API Gateway**: Single entry point. Handles SSL, Rate Limiting, and Authentication Check (via Auth Service sidecar or forward auth).
- **Event Streaming (Kafka)**: Decouples ingestion from processing. Allows the Risk Engine to process transactions at its own pace and replay events for ML training.
- **Synchronous vs Asynchronous**:
  - **Sync (REST/gRPC)**: User login, fetching historical data, dashboard configurations.
  - **Async (Kafka)**: Transaction analysis, scoring, alerting, notifications.

---

## 2. Microservices Breakdown

### A. Auth Service

- **Purpose**: Identity and Access Management (IAM).
- **Tech**: FastAPI, Python, PostgreSQL, Redis (token denylist).
- **Endpoints**:
  - `POST /auth/login`: Returns JWT (Access + Refresh).
  - `POST /auth/register`: Onboard new analysts/admins.
  - `POST /auth/verify`: Verify token validity (internal use).
- **Data**: Users, Roles (Analyst, Admin, System), Permissions.

### B. Transaction Service

- **Purpose**: Ingests financial transactions.
- **Tech**: FastAPI, PostgreSQL (TimescaleDB extension optional for huge scale).
- **Responsibilities**:
  - Validate schema (amount, currency, merchant, geo).
  - Persist raw transaction.
  - Publish `transaction.created` event to Kafka.
- **API (Internal/Ingress)**:
  - `POST /transactions`: Submit new transaction.

### C. Risk Engine Service

- **Purpose**: Deterministic rule-based scoring (e.g., "Amount > $10,000 AND Location != Home").
- **Tech**: Python, Redis (for stateful rules like "velocity checks").
- **Logic**:
  - Consumer of `transaction.created`.
  - Consumer of `ml.prediction` (merges ML score with rule score).
  - Checks static rules (Blacklists).
  - Checks velocity rules (e.g., > 10 tx in 5 mins).
  - Publishes `risk.scored` or `alert.created`.

### D. ML Service

- **Purpose**: Probabilistic fraud detection using trained models.
- **Tech**: Python, Scikit-Learn/PyTorch/XGBoost, ONNX Runtime.
- **Logic**:
  - Consumer of `transaction.created`.
  - Feature Engineering: Extract time of day, category, user history.
  - Inference: Run model.
  - Publishes `ml.prediction` (contains probability score, e.g., 0.95).

### E. Alert Service

- **Purpose**: Case management for fraud analysts.
- **Tech**: FastAPI, PostgreSQL.
- **Logic**:
  - Consumes `alert.created`.
  - Creates a "Case" ticket.
  - API for analysts to review/close cases.
  - Status: `OPEN`, `INVESTIGATING`, `CLOSED_FALSE_POSITIVE`, `CLOSED_FRAUD`.

### F. Notification Service

- **Purpose**: External communication.
- **Tech**: Python, SMTP/Twilio/SendGrid.
- **Logic**:
  - Consumes `alert.created` (filtered by severity).
  - Sends Email/SMS/Webhook depending on user preferences.

---

## 3. Communication Layer

**Why Kafka?**

- **Durability**: We cannot lose transaction data or fraud alerts. Kafka persists logs.
- **Replayability**: We can replay the last month's transactions to test a new ML model or Risk Rule version.
- **Throughput**: Handles millions of events/sec suitable for financial data.

### Topic Taxonomy

1. `transaction.created`: Raw transaction data.
   - Key: `transaction_id`
   - Payload: `{ "id": "uuid", "amount": 500.00, "currency": "USD", "user_id": "u123", "merchant": "Amazon", "timestamp": "ISO8601" }`
2. `ml.prediction`: Output from ML model.
   - Key: `transaction_id`
   - Payload: `{ "transaction_id": "uuid", "fraud_prob": 0.89, "model_version": "v1.2" }`
3. `risk.scored`: Final decision from Risk Engine.
   - Key: `transaction_id`
   - Payload: `{ "transaction_id": "uuid", "total_score": 850, "decision": "REJECT", "rules_triggered": ["VELOCITY_HIGH", "GEO_MISMATCH"] }`
4. `alert.created`: High-priority event for analysts.
   - Key: `alert_id`
   - Payload: `{ "alert_id": "uuid", "transaction_id": "uuid", "severity": "CRITICAL", "timestamp": "ISO8601" }`

---

## 4. Database Strategy

**Pattern**: Database-per-service to ensure loose coupling.

### Schemas (Outlines)

**Transaction DB (Postgres)**

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    merchant_id VARCHAR(50),
    geo_lat DECIMAL(9,6),
    geo_lon DECIMAL(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_user_timestamp ON transactions(user_id, created_at DESC);
```

**Alert DB (Postgres)**

```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id), -- Logical reference only if separate DBs
    severity VARCHAR(20) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(20) DEFAULT 'OPEN',
    assigned_to UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Redis (Risk Engine Cache)**

- Key: `velocity:user:{user_id}:1h` -> Value: `count` (TTL 1 hour)
- Key: `blacklists:ip` -> Set of malicious IPs.

---

## 5. Real-Time Features

- **WebSocket Gateway**: Separate service (or part of API Gateway) that holds WebSocket connections for the Dashboard.
- **Mechanism**:
  - Frontend connects to `wss://api.sentinelx.com/ws`.
  - Auth Service validates JWT in handshake.
  - Alert Service publishes to Redis Pub/Sub channel `alerts_realtime`.
  - WebSocket Server subscribes to Redis channel and pushes messages to connected clients.

---

## 6. Machine Learning Integration

- **Training Pipeline (Offline)**:
  - Airflow/Prefect job extracts data from Data Lake (dumped from Kafka `transaction.created`).
  - Trains XGBoost model.
  - Saves artifacts (`model.joblib`) to S3/MinIO bucket registry.
- **Inference (Online)**:
  - ML Service loads model from S3 on startup (or periodically polling).
  - Code Example:

    ```python
    import joblib
    from pydantic import BaseModel

    class PredictionRequest(BaseModel):
        features: list[float]

    model = joblib.load("latest_model.pkl")

    def predict(features):
        return model.predict_proba([features])[0][1] # Probability of Class 1 (Fraud)
    ```

- **Evaluation**: Compare `ml.prediction` against finalized `alert.status` (feedback loop).

---

## 7. Security Considerations

- **Authentication**: OAuth2 with JWT (RS256 signing). API Gateway validates signature.
- **mTLS**: Service-to-service communication (e.g., API Gateway -> Transaction Service) encrypted via mTLS (Istio or Linkerd logic).
- **Secrets Management**: Vault or AWS Secrets Manager for DB credentials/API keys.
- **PII Protection**: User names/card numbers hashed or encrypted at rest in DB.

---

## 8. Development & Deployment Architecture

### Containerization (Docker)

- Multi-stage builds for Python services (build wheel -> copy to slim image).
- Non-root user in containers.

### Orchestration (Kubernetes/EKS)

- **Namespace**: `sentinelx-prod`
- **Deployments**: One per service.
- **HPA**: Horizontal Pod Autoscaler based on CPU and Kafka Consumer Lag.

### CI/CD (GitHub Actions/GitLab CI)

1. **Lint/Test**: Black, Flake8, Pytest.
2. **Build**: Docker build & push to ECR.
3. **Deploy**: Update Helm chart or K8s manifest in CD repo (GitOps - ArgoCD).

---

## 9. Frontend Requirements (SentinelX Dashboard)

- **Tech**: React, TypeScript, Vite, TailwindCSS (Shadcn/UI).
- **Key Components**:
  - `LiveAlertsFeed`: Subscribes to WebSocket, prepends new alerts.
  - `TransactionMap`: Leaflet/Mapbox showing geo-location of recent fraud.
  - `StatsWidget`: "Fraud attempts blocked in last hour".
  - `CaseDetailView`: Deep dive into a transaction (user history graph).

---

## 10. Testing Strategy

- **Unit**: Pytest for business logic (risk rules, data validation).
- **Integration**: `Testcontainers` (spin up ephemeral Postgres/Kafka/Redis) to test full flow from API -> DB -> Kafka.
- **Load Testing**: `Locust` generating synthetic transaction traffic to benchmark throughput (goal: >1000 TPS).

---

## 11. Performance Optimization

- **Caching**:
  - User profiles cached in Redis (Risk Service reads profile to check "usual location").
- **Async I/O**: FastAPI `async def` for all I/O bound operations.
- **Database Tuning**: Partition `transactions` table by month. Use `JSONB` for flexible metadata but index core columns.

---

## 12. Deployment Checklist

- [ ] **Secrets**: Rotate default credentials.
- [ ] **Indexes**: Verify DB indexes exist.
- [ ] **Rate Limits**: Configure Kong/Nginx limits to prevent DDoS.
- [ ] **Monitoring**: Set up Prometheus alerts for "High Error Rate" or "Consumer Lag > 1 min".
- [ ] **Backup**: Enable point-in-time recovery for RDS.
