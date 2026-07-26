import os
import time
import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.api.webhooks import router as n8n_webhook_router
from backend.app.api.chat import router as chat_router
from backend.app.api.settings import router as settings_router
from backend.app.api.auth import router as auth_router

# Configure centralized logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("nexus_fastapi")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Nexus AI Agent Platform - FastAPI High-Performance Backend with AI Intelligence & Auth Layer",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Request Logging & Performance Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = (time.time() - start_time) * 1000
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration:.2f}ms")
    return response

# Centralized Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception caught at {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal System Error",
            "detail": str(exc),
            "path": request.url.path
        }
    )

# Include API Routers
app.include_router(n8n_webhook_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "phase": "Phase 3 - AI Intelligence & Security Layer Active"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "fastapi": "operational",
            "auth_jwt": "active",
            "ai_intelligence_layer": "online",
            "n8n_webhooks": "configured",
            "chat_engine": "online",
            "settings_store": "active"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
