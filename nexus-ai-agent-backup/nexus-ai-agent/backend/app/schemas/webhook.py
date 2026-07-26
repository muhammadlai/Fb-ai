from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime

class WebhookTriggerRequest(BaseModel):
    event_type: str = Field(..., description="Type of event, e.g., 'user_chat', 'data_ingest', 'cron_trigger'")
    workflow_id: Optional[str] = Field("nexus_main_workflow", description="Target n8n workflow ID or slug")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary payload sent to n8n")
    user_id: Optional[str] = Field("default_user", description="Identifier of requesting user")

class WebhookResponse(BaseModel):
    status: str
    message: str
    event_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    n8n_status_code: Optional[int] = None
    data: Optional[Dict[str, Any]] = None

class IncomingN8nWebhook(BaseModel):
    event_id: str
    source: str = "n8n"
    event_type: str
    status: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[str] = None
    signature: Optional[str] = None
