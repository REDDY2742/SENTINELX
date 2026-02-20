# SentinelX 

This is the architectural blueprint and reference implementation for **SentinelX**.

## 📚 Documentation

Please read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## 🚀 Local Development Setup (Manual)

### Prerequisites

To run SentinelX locally without Docker, you must install and run these infrastructure components yourself:

1.  **PostgreSQL** (Port 5432) - Create a database named `sentinelx_db`.
2.  **Redis** (Port 6379)
3.  **Apache Kafka** (Port 9092) & **Zookeeper** (Port 2181)
4.  **Python 3.9+**
5.  **Node.js 18+**

### 1. Install Dependencies

You need to install dependencies for each microservice separately.

**Backend (Auth Service)**

```bash
cd backend/auth-service
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
```

**Backend (Transaction Service)**

```bash
cd backend/transaction-service
# (Activate venv if shared, or create new one)
pip install -r requirements.txt
```

**Backend (Risk Engine)**

```bash
cd backend/risk-engine
pip install -r requirements.txt
```

**Frontend**

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

You may need to set environment variables for database connections if they differ from defaults (localhost).

- `DATABASE_URL`: `postgresql://user:password@localhost:5432/sentinelx_db`
- `REDIS_URL`: `redis://localhost:6379/0`
- `KAFKA_BOOTSTRAP_SERVERS`: `localhost:9092`

### 3. Run the Services

You must run each service in a separate terminal window.

**Auth Service** (Port 8001)

```bash
cd backend/auth-service
uvicorn main:app --port 8001 --reload
```

**Transaction Service** (Port 8002)

```bash
cd backend/transaction-service
uvicorn main:app --port 8002 --reload
```

**Risk Engine Worker**

```bash
cd backend/risk-engine
python main.py
```

**Frontend Dashboard** (Port 3000)

```bash
cd frontend
npm run dev
```

## 🏗 Project Structure

- `backend/`: Microservices (FastAPI + Python)
- `frontend/`: Real-time Dashboard (React + Vite + Tailwind)
- `ARCHITECTURE.md`: Full Technical Specification
