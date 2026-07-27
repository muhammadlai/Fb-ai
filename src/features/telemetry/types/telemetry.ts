export type HealthCategory = 'system' | 'server' | 'ai' | 'database' | 'automation' | 'provider';
export type HealthStatusType = 'healthy' | 'degraded' | 'critical' | 'maintenance';

export interface HealthStatus {
  id: string;
  name: string;
  category: HealthCategory;
  status: HealthStatusType;
  latencyMs: number;
  uptimePct: number;
  lastCheck: string;
  details: string;
}

export interface LiveMetrics {
  cpuUsage: number;
  memoryUsage: number;
  memoryUsedGB: number;
  memoryTotalGB: number;
  gpuUsage: number;
  gpuMemoryUsedGB: number;
  networkIngressMbps: number;
  networkEgressMbps: number;
  diskUsage: number;
  diskUsedGB: number;
  diskTotalGB: number;
  activeAgents: number;
  activeBrowserSessions: number;
  apiRequestsPerSec: number;
  llmRequestsPerMin: number;
  queueSize: number;
  websocketConnections: number;
  workerStatus: 'optimal' | 'degraded' | 'scaling';
  tokenConsumptionTotal: number;
  dailyUsageTokens: number;
  monthlyUsageTokens: number;
  estimatedCostUSD: number;
  historicalCpu: number[];
  historicalMemory: number[];
  historicalApiReqs: number[];
}

export type LogSeverity = 'warning' | 'error' | 'critical' | 'trace' | 'success' | 'info';
export type LogCategory = 'AI Events' | 'System Events' | 'Browser Events' | 'Workflow Events';

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  category: LogCategory;
  service: string;
  message: string;
  details: string;
  traceId: string;
}

export type ActionType = 'Prompt' | 'AI Response' | 'API Call' | 'Browser Automation' | 'Workflow' | 'Login' | 'User Action';

export interface AuditLog {
  id: string;
  timestamp: string;
  actionType: ActionType;
  actor: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'flagged';
  durationMs: number;
  details: string;
  resource: string;
}

export type ProviderName = 'Gemini' | 'OpenAI' | 'Claude' | 'DeepSeek' | 'OpenRouter' | 'Ollama';

export interface TokenModelAnalytics {
  modelId: string;
  provider: ProviderName;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  avgUsagePerReq: number;
  costUSD: number;
  dailyUsage: number;
  monthlyUsage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AIPerformanceMetric {
  modelName: string;
  provider: ProviderName;
  latencyP95Ms: number;
  tokensPerSec: number;
  qualityScore: number;
  hallucinationScore: number;
  reasoningDepthScore: number;
  avgResponseLength: number;
  successRatePct: number;
  failureRatePct: number;
  avgCompletionTimeSec: number;
}

export interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'api_abuse' | 'rate_limit_exceeded' | 'suspicious_ip' | 'blocked_request' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIp: string;
  timestamp: string;
  description: string;
  status: 'active' | 'mitigated' | 'investigating' | 'resolved';
}

export interface SecurityOverview {
  firewallStatus: 'active_enforced' | 'degraded' | 'disabled';
  encryptionStatus: string;
  secretsVaultStatus: string;
  activeApiKeysCount: number;
  blockedRequests24h: number;
  failedLogins24h: number;
  rateLimitsTriggered24h: number;
}

export type AlertSeverity = 'success' | 'info' | 'warning' | 'critical' | 'emergency';
export type AlertState = 'active' | 'dismissed' | 'muted' | 'archived';

export interface SystemAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  source: string;
  status: AlertState;
}
