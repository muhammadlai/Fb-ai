export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
  avatar_url?: string;
  plan?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'doc' | 'code' | 'audio' | 'csv';
  size: string;
  url?: string;
}

export interface ThinkingStep {
  id: string;
  title: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'completed';
  time_ms?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  n8n_triggered?: boolean;
  metadata?: {
    provider?: string;
    model?: string;
    tokens_used?: number;
    latency_ms?: number;
    n8n_response?: any;
    thinking_steps?: ThinkingStep[];
    attachments?: MessageAttachment[];
    liked?: boolean;
    disliked?: boolean;
  };
}

export interface ConversationSession {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  is_favorite?: boolean;
  model_used?: string;
  category?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Google' | 'Anthropic' | 'DeepSeek' | 'Meta' | 'Mistral' | 'OpenRouter';
  description: string;
  context_window: string;
  speed: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Reasoning';
  cost_per_1k: string;
  badge?: string;
  supports_vision: boolean;
  supports_function_calling: boolean;
  recommended_for: string;
}

export interface SystemSettings {
  system_prompt: string;
  temperature: number;
  top_p: number;
  selected_model: string;
  n8n_webhook_url: string;
  n8n_webhook_secret: string;
  openai_api_key_set: boolean;
  gemini_api_key_set: boolean;
  anthropic_api_key_set?: boolean;
  openrouter_api_key_set?: boolean;
  memory_mode: 'short_term' | 'vector_rag' | 'full_history';
  auto_web_search: boolean;
  context_length: number;
}

export interface WebhookLog {
  event_id: string;
  direction: 'outbound' | 'inbound';
  event_type: string;
  target_url?: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
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
    gpu_cluster?: string;
    vector_db?: string;
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

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  status: 'active' | 'idle' | 'executing' | 'error';
  model: string;
  system_prompt: string;
  tools_enabled: string[];
  tasks_completed: number;
  last_active: string;
  category: 'Coding' | 'Research' | 'Analytics' | 'Automation' | 'Creative';
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  tags: string[];
  usage_count: number;
  is_favorite?: boolean;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'image' | 'web_url' | 'youtube';
  size_or_url: string;
  chunks_count: number;
  embeddings_model: string;
  status: 'indexed' | 'processing' | 'error';
  uploaded_at: string;
  tokens_count: number;
}

export interface VectorDBStatus {
  provider: 'Pinecone' | 'Qdrant' | 'Chroma';
  total_vectors: number;
  index_name: string;
  dimension: number;
  metric: string;
  namespaces: number;
  health: 'Optimal' | 'Syncing' | 'Degraded';
}

export interface ToolIntegration {
  id: string;
  name: string;
  category: 'Dev' | 'Communication' | 'Productivity' | 'Automation' | 'Storage' | 'Search';
  description: string;
  icon_name: string;
  is_connected: boolean;
  status: 'active' | 'configured' | 'disconnected';
  webhook_url?: string;
  last_used?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'ai_llm' | 'webhook' | 'vector_db' | 'slack_notify' | 'code_exec';
  title: string;
  subtitle: string;
  status: 'idle' | 'running' | 'success' | 'error';
  position: { x: number; y: number };
  config: Record<string, any>;
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  animated?: boolean;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  node_name: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  duration_ms: number;
}

export interface AnalyticsData {
  timeLabels: string[];
  requests: number[];
  latency: number[];
  costs: number[];
  tokenUsage: number[];
  activeUsers: number[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  status: 'Active' | 'Invited';
  lastActive: string;
  avatar: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used: string;
  status: 'active' | 'revoked';
  rate_limit_rpm: number;
  scopes: string[];
}

export interface BillingPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price_monthly: number;
  tokens_limit: string;
  features: string[];
  current?: boolean;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  pdf_url: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link_view?: ActiveView;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  members_count: number;
  api_calls_this_month: number;
  owner_email: string;
  created_at: string;
}

export type ActiveView = 
  | 'creator_home'
  | 'chat'
  | 'dashboard'
  | 'agents'
  | 'workspaces'
  | 'prompts'
  | 'knowledge'
  | 'documents'
  | 'websearch'
  | 'imagegen'
  | 'voice'
  | 'workflows'
  | 'integrations'
  | 'analytics'
  | 'settings'
  | 'team'
  | 'billing'
  | 'api_keys'
  | 'admin'
  | 'logs';
