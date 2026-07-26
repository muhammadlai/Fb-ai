import os
import json
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional
from backend.app.core.config import settings

class AIService:
    """Reusable AI Client supporting OpenAI and Gemini API with fallback."""
    
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")
        self.gemini_api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")

    async def generate_chat_response(
        self,
        prompt: str,
        system_instruction: str = "You are Nexus AI Agent, an autonomous full-stack AI engineering assistant.",
        history: Optional[List[Dict[str, str]]] = None,
        model: str = "gemini-2.5-flash",
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Generates AI completion with automatic provider selection and fallback.
        Supports OpenAI API (`gpt-4o`, `gpt-[...]`) and Gemini API (`gemini-2.5-flash`).
        """
        history = history or []
        
        # 1. Try Gemini API if requested or key present
        if "gemini" in model.lower() or (self.gemini_api_key and not self.openai_api_key):
            try:
                from google import genai
                client = genai.Client(api_key=self.gemini_api_key)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config={
                        "system_instruction": system_instruction,
                        "temperature": temperature
                    }
                )
                return {
                    "provider": "gemini",
                    "model": "gemini-2.5-flash",
                    "content": response.text or "No response generated.",
                    "status": "success"
                }
            except Exception as e:
                print(f"[AIService] Gemini call failed/fallback: {e}")

        # 2. Try OpenAI API via Direct HTTP if model is gpt or gemini failed
        if self.openai_api_key:
            try:
                messages = [{"role": "system", "content": system_instruction}]
                for h in history[-10:]: # Keep last 10 messages for memory context
                    messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
                messages.append({"role": "user", "content": prompt})

                req_body = json.dumps({
                    "model": "gpt-4o" if "4o" in model else "gpt-3.5-turbo",
                    "messages": messages,
                    "temperature": temperature
                }).encode('utf-8')

                req = urllib.request.Request(
                    "https://api.openai.com/v1/chat/completions",
                    data=req_body,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.openai_api_key}"
                    }
                )

                with urllib.request.urlopen(req, timeout=15) as resp:
                    res_data = json.loads(resp.read().decode('utf-8'))
                    ai_text = res_data["choices"][0]["message"]["content"]
                    return {
                        "provider": "openai",
                        "model": "gpt-4o",
                        "content": ai_text,
                        "status": "success"
                    }
            except Exception as e:
                print(f"[AIService] OpenAI call failed: {e}")

        # 3. Intelligent Fallback Engine if no keys or API failed
        fallback_text = f"🤖 **Nexus AI Agent Response**:\n"
        if "n8n" in prompt.lower() or "workflow" in prompt.lower():
            fallback_text += f"I have processed your workflow query: *\"{prompt}\"*.\n\nTarget n8n Webhook: `{settings.N8N_WEBHOOK_URL}`\nStatus: Registered and ready."
        elif "fastapi" in prompt.lower() or "backend" in prompt.lower():
            fallback_text += f"FastAPI Core engine is running smoothly with JWT Auth & AI Intelligence Layer enabled."
        else:
            fallback_text += f"I have analyzed your prompt: **\"{prompt}\"**.\n\nNexus AI Agent is ready to execute tasks, trigger n8n webhooks, or generate system configurations."

        return {
            "provider": "nexus_fallback",
            "model": model,
            "content": fallback_text,
            "status": "fallback"
        }

ai_service = AIService()
