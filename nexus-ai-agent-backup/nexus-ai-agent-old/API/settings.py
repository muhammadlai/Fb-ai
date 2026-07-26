from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import os

from backend.app.core.config import settings

router = APIRouter(prefix="/settings", tags=["System Settings"])

class SettingsSchema(BaseModel):
    system_prompt: str = "You are Nexus AI Agent, an autonomous full-stack engineering assistant."
    temperature: float = 0.7
    selected_model: str = "gemini-2.5-flash"
    n8n_webhook_url: str = settings.N8N_WEBHOOK_URL
    n8n_webhook_secret: str = settings.N8N_WEBHOOK_SECRET
    openai_api_key_set: bool = False
    gemini_api_key_set: bool = False

current_settings = SettingsSchema(
    openai_api_key_set=bool(os.getenv("OPENAI_API_KEY")),
    gemini_api_key_set=bool(os.getenv("GEMINI_API_KEY"))
)

@router.get("")
async def get_settings():
    return current_settings

@router.post("")
async def update_settings(new_settings: SettingsSchema):
    global current_settings
    current_settings.system_prompt = new_settings.system_prompt
    current_settings.temperature = new_settings.temperature
    current_settings.selected_model = new_settings.selected_model
    current_settings.n8n_webhook_url = new_settings.n8n_webhook_url
    current_settings.n8n_webhook_secret = new_settings.n8n_webhook_secret
    settings.N8N_WEBHOOK_URL = new_settings.n8n_webhook_url
    settings.N8N_WEBHOOK_SECRET = new_settings.n8n_webhook_secret
    return {"status": "updated", "settings": current_settings}
