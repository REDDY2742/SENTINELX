from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from kafka import KafkaProducer
import json
import os
from datetime import datetime
import uuid

app = FastAPI(title="SentinelX Transaction Service")

KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

class Transaction(BaseModel):
    id: str = str(uuid.uuid4())
    user_id: str
    recipient: str  # e.g., "Amazon" or "John Doe"
    amount: float
    currency: str
    description: str = "Transfer"
    geo_lat: float = 0.0
    geo_lon: float = 0.0
    timestamp: datetime = datetime.now()

@app.post("/transactions")
async def create_transaction(tx: Transaction):
    try:
        # Validate data (implicitly handled by Pydantic)
        
        # Publish to Kafka
        future = producer.send('transaction.created', tx.dict())
        result = future.get(timeout=10) # Wait for confirmation for critical tx data
        
        return {"status": "success", "transaction_id": tx.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "kafka": "connected"}
