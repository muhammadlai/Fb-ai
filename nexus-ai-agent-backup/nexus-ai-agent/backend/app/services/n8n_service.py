import hmac
import hashlib
import time
import uuid
import httpx
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.app.core.config import settings

logger = logging.getLogger("nexus.n8n_service")

# In-memory log store for webhook activities
webhook_logs_db: List[Dict[str, Any]] = []

class N8nWebhookService:
    def __init__(self):
        self.webhook_url = settings.N8N_WEBHOOK_URL
        self.webhook_secret = settings.N8N_WEBHOOK_SECRET

    def generate_signature(self, payload_str: str) -> str:
        """Generate HMAC-SHA256 signature for payload validation."""
        return hmac.new(
            self.webhook_secret.encode('utf-8'),
            payload_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

    def verify_signature(self, payload_str: str, received_signature: str) -> bool:
        """Verify incoming HMAC signature from n8n."""
        expected_sig = self.generate_signature(payload_str)
        return hmac.compare_digest(expected_sig, received_signature)

    async def trigger_n8n_workflow(self, event_type: str, payload: Dict[str, Any], user_id: str = "system") -> Dict[str, Any]:
        """Send production webhook event to n8n with retries and verification."""
        event_id = f"evt_{uuid.uuid4().hex[:12]}"
        timestamp = datetime.utcnow().isoformat()
        
        full_body = {
            "event_id": event_id,
            "source": "nexus_fastapi",
            "event_type": event_type,
            "user_id": user_id,
            "timestamp": timestamp,
            "payload": payload
        }

        body_str = str(full_body)
        signature = self.generate_signature(body_str)
        headers = {
            "Content-Type": "application/json",
            "X-Nexus-Signature": signature,
            "X-Nexus-Event-ID": event_id
        }

        # Record outgoing log
        log_entry = {
            "event_id": event_id,
            "direction": "outbound",
            "event_type": event_type,
            "target_url": self.webhook_url,
            "timestamp": timestamp,
            "status": "pending",
            "retries": 0,
            "payload": payload
        }
        webhook_logs_db.insert(0, log_entry)

        # Execute HTTP call with backoff retries
        max_retries = 3
        backoff = 1.0
        response_data = None
        status_code = 500

        async with httpx.AsyncClient(timeout=10.0) as client:
            for attempt in range(max_retries):
                try:
                    logger.info(f"Triggering n8n webhook attempt {attempt + 1} for event {event_id}")
                    response = await client.post(self.webhook_url, json=full_body, headers=headers)
                    status_code = response.status_code
                    
                    if response.status_code in (200, 201, 202):
                        try:
                            response_data = response.json()
                        except Exception:
                            response_data = {"raw_text": response.text}
                        
                        log_entry["status"] = "success"
                        log_entry["n8n_status_code"] = status_code
                        log_entry["response"] = response_data
                        logger.info(f"Successfully triggered n8n webhook {event_id}")
                        break
                    else:
                        logger.warning(f"n8n returned status {status_code}: {response.text}")
                        log_entry["status"] = f"failed_http_{status_code}"
                except Exception as e:
                    logger.error(f"Error calling n8n webhook: {str(e)}")
                    log_entry["status"] = f"error: {str(e)}"
                    log_entry["retries"] = attempt + 1
                    
                time.sleep(backoff)
                backoff *= 2

        if log_entry["status"] == "pending":
            log_entry["status"] = "failed_timeout"

        return {
            "event_id": event_id,
            "status": log_entry["status"],
            "n8n_status_code": status_code,
            "timestamp": timestamp,
            "data": response_data or {"message": "Webhook processed or queued in background"}
        }

    def process_incoming_callback(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming result/callback sent from n8n back to FastAPI."""
        event_id = data.get("event_id", f"evt_cb_{uuid.uuid4().hex[:8]}")
        timestamp = datetime.utcnow().isoformat()

        log_entry = {
            "event_id": event_id,
            "direction": "inbound",
            "event_type": data.get("event_type", "n8n_callback"),
            "timestamp": timestamp,
            "status": data.get("status", "processed"),
            "payload": data
        }
        webhook_logs_db.insert(0, log_entry)

        return {
            "status": "acknowledged",
            "event_id": event_id,
            "received_at": timestamp
        }

    def get_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        return webhook_logs_db[:limit]

n8n_service = N8nWebhookService()
