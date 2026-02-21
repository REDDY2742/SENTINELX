from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, ws
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Security
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://localhost:5173",
        # Production — Amplify frontend
        "https://main.d56r7szn3zkg.amplifyapp.com",
        # Production — Vercel frontend (actual URL)
        "https://sentinelxbank.vercel.app",
        # Custom domain (if applicable)
        "https://sentinelx.bank",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
