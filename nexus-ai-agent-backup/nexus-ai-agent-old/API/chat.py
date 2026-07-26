from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
import time
import uuid
from datetime import datetime

from backend.app.schemas.chat import ChatRequest, ChatResponse, ChatMessage, ConversationSession
from backend.app.services.n8n_service import n8n_service
from backend.app.services.ai_service import ai_service
from backend.app.core.config import settings

router = APIRouter(prefix="/chat", tags=["AI Chat & Memory"])

# Threaded conversation database
conversations_db: Dict[str, List[ChatMessage]] = {
    "session_default": [
        ChatMessage(
            id="msg_001",
            role="assistant",
            content="Hello! I am **Nexus AI Agent**. Powered by OpenAI & Gemini AI models with n8n workflow orchestration.",
            timestamp=datetime.utcnow()
        )
    ]
}

session_metadata: Dict[str, Dict[str, Any]] = {
    "session_default": {
        "title": "Welcome to Nexus AI Agent",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
}

@router.post("/completions", response_model=ChatResponse)
async def generate_chat_completion(request: ChatRequest):
    """
    Generate AI chat response with OpenAI/Gemini multi-provider support, 
    conversation thread memory, and n8n workflow trigger capability.
    """
    start_time = time.time()
    session_id = request.session_id or f"session_{uuid.uuid4().hex[:8]}"

    if session_id not in conversations_db:
        conversations_db[session_id] = []
        session_metadata[session_id] = {
            "title": request.message[:32] + ("..." if len(request.message) > 32 else ""),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

    # Retrieve conversation thread history for AI memory
    history = [
        {"role": m.role, "content": m.content}
        for m in conversations_db[session_id][-10:]
    ]

    # Save user message
    user_msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    user_msg = ChatMessage(
        id=user_msg_id,
        role="user",
        content=request.message,
        timestamp=datetime.utcnow(),
        n8n_triggered=request.trigger_n8n
    )
    conversations_db[session_id].append(user_msg)

    # Optional n8n trigger
    n8n_result = None
    if request.trigger_n8n:
        try:
            n8n_result = await n8n_service.trigger_n8n_workflow(
                event_type="user_chat",
                payload={"prompt": request.message, "session_id": session_id},
                user_id="chat_user"
            )
        except Exception as e:
            n8n_result = {"status": "failed", "error": str(e)}

    # Call AI Intelligence Layer
    ai_res = await ai_service.generate_chat_response(
        prompt=request.message,
        system_instruction=request.system_prompt or "You are Nexus AI Agent, an autonomous full-stack AI engineering assistant.",
        history=history,
        model=request.model or settings.DEFAULT_AI_MODEL,
        temperature=request.temperature or 0.7
    )

    ai_content = ai_res["content"]
    if request.trigger_n8n and n8n_result:
        ai_content += f"\n\n⚡ **n8n Workflow Dispatched**:\n- Event ID: `{n8n_result.get('event_id')}`\n- Status: `{n8n_result.get('status')}`"

    ai_msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    ai_msg = ChatMessage(
        id=ai_msg_id,
        role="assistant",
        content=ai_content,
        timestamp=datetime.utcnow(),
        metadata={
            "provider": ai_res.get("provider"),
            "model": ai_res.get("model"),
            "n8n_result": n8n_result
        }
    )
    conversations_db[session_id].append(ai_msg)

    session_metadata[session_id]["updated_at"] = datetime.utcnow()
    exec_time = (time.time() - start_time) * 1000

    return ChatResponse(
        session_id=session_id,
        message=ai_msg,
        n8n_response=n8n_result,
        execution_time_ms=round(exec_time, 2)
    )

@router.get("/conversations", response_model=List[ConversationSession])
async def list_conversations():
    """List all active conversation thread sessions."""
    sessions = []
    for sid, meta in session_metadata.items():
        msg_count = len(conversations_db.get(sid, []))
        sessions.append(
            ConversationSession(
                session_id=sid,
                title=meta["title"],
                created_at=meta["created_at"],
                updated_at=meta["updated_at"],
                message_count=msg_count
            )
        )
    return sorted(sessions, key=lambda x: x.updated_at, reverse=True)

@router.get("/history/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(session_id: str):
    """Retrieve chat message history for a specific conversation session."""
    if session_id not in conversations_db:
        return []
    return conversations_db[session_id]

@router.delete("/history/{session_id}")
async def clear_session_history(session_id: str):
    """Delete a conversation session."""
    if session_id in conversations_db:
        del conversations_db[session_id]
    if session_id in session_metadata:
        del session_metadata[session_id]
    return {"status": "deleted", "session_id": session_id}
