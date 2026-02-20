from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, ws
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://sentinelx.bank"], # Add frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ws.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "SentinelX Auth Service Operational", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
