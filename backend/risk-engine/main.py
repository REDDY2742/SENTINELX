import json
import os
import redis
from kafka import KafkaConsumer, KafkaProducer
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

# Setup Kafka
consumer = KafkaConsumer(
    'transaction.created',
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Setup Redis
r = redis.Redis.from_url(REDIS_URL)

def process_transaction(tx):
    user_id = tx.get('user_id')
    amount = tx.get('amount')
    tx_id = tx.get('id')
    
    score = 0
    reasons = []

    # Rule 1: High Amount Check
    if amount > 10000:
        score += 50
        reasons.append("HIGH_AMOUNT")
    
    # Rule 2: Velocity Check (N transactions in last minute)
    key = f"velocity:{user_id}"
    count = r.incr(key)
    if count == 1:
        r.expire(key, 60) # 1 minute window
    
    if count > 5:
        score += 100
        reasons.append("HIGH_VELOCITY")

    # Final Decision
    decision = "APPROVE"
    if score >= 100:
        decision = "BS_REJECT" # Business rejected
    elif score >= 50:
        decision = "REVIEW"

    result = {
        "transaction_id": tx_id,
        "score": score,
        "reasons": reasons,
        "decision": decision,
        "timestamp": time.time()
    }

    # Emit Result
    producer.send('risk.scored', result)
    logger.info(f"Processed tx {tx_id}: {decision} (Score: {score})")

    if decision in ["REVIEW", "BS_REJECT"]:
        alert = {
            "transaction_id": tx_id,
            "severity": "CRITICAL" if decision == "BS_REJECT" else "HIGH",
            "message": f"Fraud suspected: {reasons}"
        }
        producer.send('alert.created', alert)

if __name__ == "__main__":
    logger.info("Risk Engine Started...")
    for message in consumer:
        try:
            process_transaction(message.value)
        except Exception as e:
            logger.error(f"Error processing message: {e}")
