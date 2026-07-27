export type AutomationAction =
  | 'open_url'
  | 'navigate'
  | 'fill_form'
  | 'click'
  | 'read_content'
  | 'extract_data'
  | 'generate_report'
  | 'screenshot'
  | 'human_type'
  | 'scroll_feed'
  | 'like_post'
  | 'post_update'
  | 'scrape_profiles'
  | 'solve_captcha'
  | 'send_message';

export type TriggerType = 'user_initiated' | 'scheduled' | 'webhook' | 'ai_triggered';

export type SocialPlatform = 'facebook' | 'linkedin' | 'x_twitter' | 'instagram' | 'custom';

export interface AutomationStep {
  id: string;
  action: AutomationAction;
  description: string;
  targetSelector?: string;
  value?: string;
  requiresAuthConfirmation?: boolean; // Safeguard authorization rule
  status: 'pending' | 'running' | 'completed' | 'awaiting_confirmation' | 'failed';
  outputLogs?: string;
  screenshotUrl?: string;
  humanDelayMs?: number;
}

export interface HumanBehaviorConfig {
  typingSpeedWpm: number; // e.g. 60-110 WPM
  clickDelayMs: number; // e.g. 300-900 ms
  mouseJitterEnabled: boolean;
  scrollPacingMs: number;
  randomizePauses: boolean;
  userAgentRotation: boolean;
}

export interface BrowserProfile {
  id: string;
  name: string;
  userAgent: string;
  viewport: { width: number; height: number };
  cookiesCount: number;
  proxyServer?: string;
  status: 'idle' | 'active';
  createdAt: string;
  behaviorConfig: HumanBehaviorConfig;
  stealthMode: boolean;
}

export interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  platform?: SocialPlatform;
  profileId: string;
  triggerType: TriggerType;
  cronSchedule?: string; // e.g., '0 9 * * 1-5'
  steps: AutomationStep[];
  lastRunAt?: string;
  lastStatus?: 'success' | 'failed' | 'running' | 'idle';
  requiresUserAuthorization: boolean; // Safeguard
}

export interface CredentialVaultItem {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  username: string;
  encryptedKey: string;
  sessionStatus: 'valid_cookies' | 'auth_required' | 'mfa_pending' | 'expired';
  lastAuthenticated: string;
  mfaEnabled: boolean;
}

export interface AutomationQueueItem {
  id: string;
  taskId: string;
  taskName: string;
  platform: SocialPlatform;
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduledTime: string;
  retriesLeft: number;
  createdAt: string;
}

export interface ExecutionLog {
  id: string;
  taskId: string;
  stepId: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'auth_prompt';
}

export interface AutomationReport {
  id: string;
  taskId: string;
  taskName: string;
  generatedAt: string;
  format: 'pdf' | 'markdown' | 'json';
  summary: string;
  extractedData: Record<string, any>;
  screenshots: string[];
}

export interface SocialAutomationPreset {
  id: string;
  platform: SocialPlatform;
  title: string;
  description: string;
  stepsCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  defaultSteps: Omit<AutomationStep, 'id' | 'status'>[];
}
