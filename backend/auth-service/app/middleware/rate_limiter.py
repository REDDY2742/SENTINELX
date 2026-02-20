from fastapi import Request, HTTPException
import time
from collections import defaultdict
import redis.asyncio as redis 
from app.core.config import settings

# Mock In-Memory store for fallback
class InMemoryRateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)

    async def check(self, key: str, limit: int, window: int):
        current_time = time.time()
        # Clean old reqs
        self.requests[key] = [t for t in self.requests[key] if t > current_time - window]
        
        if len(self.requests[key]) >= limit:
            return False
        
        self.requests[key].append(current_time)
        return True

# Simple Redis implementation
class RedisRateLimiter:
    def __init__(self, key_prefix: str = "rate_limit"):
        self.key_prefix = key_prefix
        # In prod: use connection pool etc. 
        self.redis = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0, decode_responses=True)

    async def check(self, key: str, limit: int, window: int) -> bool:
        full_key = f"{self.key_prefix}:{key}"
        try:
            # Lua script for atomic check-and-increment (implementation simplified)
            pipeline = self.redis.pipeline()
            current = await self.redis.incr(full_key)
            if current == 1:
                await self.redis.expire(full_key, window)
            
            if current > limit:
                return False
            return True
        except Exception:
            # Fallback if redis fails
            return True 

limiter_store = "memory" # Could be toggled via config

async def rate_limiter(request: Request, limit: int = 5, window_seconds: int = 60):
    client_ip = request.client.host
    endpoint = request.url.path
    key = f"{client_ip}:{endpoint}"
    
    # Logic to select backend
    # For now, simplistic in-memory
    limiter = InMemoryRateLimiter() 
    
    if not await limiter.check(key, limit, window_seconds):
        raise HTTPException(status_code=429, detail="Too Many Requests")

# Decorator factory for easier use
def limit_requests(limit: int, window: int): 
    # This should be implemented as a dependency
    return RateLimitDependency(limit, window)

class RateLimitDependency:
    def __init__(self, limit: int, window: int):
        self.limit = limit
        self.window = window
        self.limiter = InMemoryRateLimiter()

    async def __call__(self, request: Request):
        client_ip = request.client.host
        key = f"{client_ip}:{request.url.path}"
        if not await self.limiter.check(key, self.limit, self.window):
             raise HTTPException(status_code=429, detail="Rate limit exceeded")
