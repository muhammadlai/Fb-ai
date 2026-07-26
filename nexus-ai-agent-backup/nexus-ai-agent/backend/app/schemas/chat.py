from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class ChatMessage(BaseModel):
    id: str
    role: str = Field(..., description="'user' or 'assistant' or 'system'")
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    n8n_triggered: Optional[bool] = False
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    session_id: Optional[str] = "default_session"
    message: str
    model: Optional[str] = "gemini-2.5-flash"
    temperature: Optional[float] = 0.7
    system_prompt: Optional[str] = "You are Nexus AI Agent, an advanced autonomous AI assistant."
    trigger_n8n: Optional[bool] = False

class ChatResponse(BaseModel):
    session_id: str
    message: ChatMessage
    n8n_response: Optional[Dict[str, Any]] = None
    execution_time_ms: float

class ConversationSession(BaseModel):
    session_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int
