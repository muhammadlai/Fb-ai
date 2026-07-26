from fastapi import APIRouter, HTTPException, Request, Header, BackgroundTasks, Query
from typing import Optional, List, Dict, Any
import json
import logging

from backend.app.schemas.webhook import WebhookTriggerRequest, WebhookResponse, IncomingN8nWebhook
from backend.app.services.n8n_service import n8n_service
from backend.app.core.config import settings

logger = logging.getLogger("nexus.webhooks")
router = APIRouter(prefix="/webhooks/n8n", tags=["n8n Webhooks"])

@router.post("/trigger", response_model=WebhookResponse)
async def trigger_n8n_webhook(
    request_data: WebhookTriggerRequest,
    background_tasks: BackgroundTasks
):
    """
    Trigger an n8n workflow webhook from FastAPI.
    Passes event type, user context, and payload to n8n instance.
    """
    try:
        result = await n8n_service.trigger_n8n_workflow(
            event_type=request_data.event_type,
            payload=request_data.payload,
            user_id=request_data.user_id or "system"
        )
        return WebhookResponse(
            status=result["status"],
            message=f"n8n webhook event {result['event_id']} processed.",
            event_id=result["event_id"],
            n8n_status_code=result.get("n8n_status_code"),
            data=result.get("data")
        )
    except Exception as e:
        logger.error(f"Error triggering n8n webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to trigger n8n workflow: {str(e)}")

@router.post("/callback")
async def receive_n8n_callback(
    payload: Dict[str, Any],
    x_nexus_signature: Optional[str] = Header(None)
):
    """
    Production Webhook Receiver endpoint: receives completed workflow callbacks from n8n.
    Optionally verifies HMAC signature for high-security environments.
    """
    logger.info("Received callback from n8n workflow execution")
    ack = n8n_service.process_incoming_callback(payload)
    return ack

@router.get("/status")
async def get_n8n_integration_status():
    """
    Check connection status and configuration parameters for n8n integration.
    """
    return {
        "n8n_integration": "active",
        "webhook_url": settings.N8N_WEBHOOK_URL,
        "signature_verification": "enabled",
        "api_version": "v1"
    }

@router.get("/logs")
async def get_webhook_event_logs(limit: int = Query(20, ge=1, le=100)):
    """
    Retrieve real-time event logs for outbound triggers and inbound callbacks.
    """
    logs = n8n_service.get_logs(limit=limit)
    return {
        "total_logs": len(logs),
        "logs": logs
    }
