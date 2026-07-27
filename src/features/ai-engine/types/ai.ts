export type AIProvider = 'google' | 'openai' | 'anthropic' | 'deepseek';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  version: string;
  description: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsReasoning: boolean;
  supportsAgent: boolean;
  speedRating: 'Ultra-Fast' | 'Fast' | 'Balanced' | 'Deep Reasoning';
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string; // e.g. 'image/png', 'application/pdf', 'text/plain'
  size: number;
  url: string; // base64 data URL or blob URL
  previewUrl?: string;
}

export interface ReasoningStep {
  id: string;
  stepNumber: number;
  title: string;
  content: string;
  durationMs?: number;
  confidence?: number;
}

export interface AgentStep {
  id: string;
  stepNumber: number;
  toolName: string;
  action: string;
  status: 'running' | 'completed' | 'failed';
  input?: string;
  output?: string;
  timestamp: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUSD: number;
  latencyMs: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelId?: string;
  provider?: AIProvider;
  attachments?: FileAttachment[];
  reasoningSteps?: ReasoningStep[];
  agentSteps?: AgentStep[];
  tokenUsage?: TokenUsage;
  isStreaming?: boolean;
  failoverOccurred?: boolean;
  originalModelId?: string;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  selectedModelId: string;
  isPinned?: boolean;
  tags?: string[];
  systemPrompt?: string;
  temperature: number;
  maxTokens: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Coding' | 'Architecture' | 'Security' | 'Writing' | 'Reasoning' | 'Data';
  description: string;
  promptText: string;
  variables: string[];
  icon: string;
}

export interface ModelUsageSummary {
  modelId: string;
  provider: AIProvider;
  totalRequests: number;
  totalTokens: number;
  totalCostUSD: number;
  avgLatencyMs: number;
}

export interface SystemAnalytics {
  totalTokensProcessed: number;
  totalCostUSD: number;
  totalConversations: number;
  totalMessages: number;
  failoverCount: number;
  usageByModel: Record<string, ModelUsageSummary>;
}
