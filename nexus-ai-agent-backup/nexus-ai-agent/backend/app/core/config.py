import os
from pydantic import BaseModel, Field
from typing import Optional

class Settings:
    PROJECT_NAME: str = "Nexus AI Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # n8n Integration Settings
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/nexus-agent")
    N8N_WEBHOOK_SECRET: str = os.getenv("N8N_WEBHOOK_SECRET", "nexus_secret_key_2026")
    N8N_API_KEY: str = os.getenv("N8N_API_KEY", "")
    
    # Security & JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "nexus-super-secret-jwt-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_AI_MODEL: str = os.getenv("DEFAULT_AI_MODEL", "gemini-2.5-flash")

settings = Settings()
