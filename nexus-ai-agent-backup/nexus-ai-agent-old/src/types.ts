export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  n8n_triggered?: boolean;
  metadata?: Record<string, any>;
}

export interface ConversationSession {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface SystemSettings {
  system_prompt: string;
  temperature: number;
  selected_model: string;
  n8n_webhook_url: string;
  n8n_webhook_secret: string;
  openai_api_key_set: boolean;
  gemini_api_key_set: boolean;
}

export interface WebhookLog {
  event_id: string;
  direction: 'outbound' | 'inbound';
  event_type: string;
  target_url?: string;
  timestamp: string;
  status: string;
  n8n_status_code?: number;
  payload: Record<string, any>;
  response?: Record<string, any>;
}

export interface SystemHealth {
  status: string;
  services: {
    fastapi: string;
    auth_jwt?: string;
    ai_intelligence_layer?: string;
    n8n_webhooks: string;
    chat_engine?: string;
    express_proxy?: string;
  };
  timestamp?: string;
}

export interface N8nStatus {
  n8n_integration: string;
  webhook_url: string;
  signature_verification: string;
  api_version: string;
  active_connections?: number;
}
