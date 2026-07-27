import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BrowserProfile, 
  WorkflowTask, 
  AutomationStep, 
  ExecutionLog, 
  AutomationReport,
  CredentialVaultItem,
  AutomationQueueItem,
  SocialAutomationPreset,
  SocialPlatform,
  HumanBehaviorConfig
} from '../types/automation';

interface AutomationStore {
  profiles: BrowserProfile[];
  tasks: WorkflowTask[];
  vault: CredentialVaultItem[];
  queue: AutomationQueueItem[];
  socialPresets: SocialAutomationPreset[];
  activeTaskId: string | null;
  activeProfileId: string;
  isExecuting: boolean;
  currentStepIndex: number;
  currentBrowserUrl: string;
  currentBrowserContent: string;
  executionLogs: ExecutionLog[];
  reports: AutomationReport[];
  pendingAuthorizationStep: { task: WorkflowTask; step: AutomationStep } | null;

  // Actions
  addProfile: (profile: Omit<BrowserProfile, 'id' | 'createdAt'>) => void;
  updateProfileBehavior: (id: string, config: Partial<HumanBehaviorConfig>) => void;
  deleteProfile: (id: string) => void;
  addTask: (task: Omit<WorkflowTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<WorkflowTask>) => void;
  deleteTask: (id: string) => void;
  setActiveTaskId: (id: string | null) => void;
  setActiveProfileId: (id: string) => void;

  // Credential Vault Actions
  addVaultItem: (item: Omit<CredentialVaultItem, 'id' | 'lastAuthenticated'>) => void;
  deleteVaultItem: (id: string) => void;

  // Queue Actions
  addQueueItem: (item: Omit<AutomationQueueItem, 'id' | 'createdAt'>) => void;
  removeFromQueue: (id: string) => void;

  // AI Command Center Parser
  executeAIPromptCommand: (prompt: string) => Promise<void>;

  // Preset Applicator
  instantiatePreset: (presetId: string, customParams?: Record<string, string>) => WorkflowTask;
  
  // Execution Engine
  executeTask: (taskId: string) => Promise<void>;
  confirmAuthorizationStep: (approved: boolean) => void;
  stopExecution: () => void;
  addLog: (taskId: string, stepId: string, message: string, type?: ExecutionLog['type']) => void;
  executeStepInternal: (taskId: string, step: AutomationStep) => Promise<void>;
}

const DEFAULT_BEHAVIOR: HumanBehaviorConfig = {
  typingSpeedWpm: 85,
  clickDelayMs: 450,
  mouseJitterEnabled: true,
  scrollPacingMs: 1200,
  randomizePauses: true,
  userAgentRotation: true,
};

const INITIAL_PROFILES: BrowserProfile[] = [
  {
    id: 'prof-1',
    name: 'Enterprise Production Chrome',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Playwright/1.43.0',
    viewport: { width: 1280, height: 800 },
    cookiesCount: 24,
    status: 'idle',
    createdAt: new Date().toISOString(),
    behaviorConfig: DEFAULT_BEHAVIOR,
    stealthMode: true,
  },
  {
    id: 'prof-2',
    name: 'Social Media Stealth Manager',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    cookiesCount: 42,
    proxyServer: 'https://proxy.us-east.stealthnet.io:8080',
    status: 'idle',
    createdAt: new Date().toISOString(),
    behaviorConfig: { ...DEFAULT_BEHAVIOR, typingSpeedWpm: 72, mouseJitterEnabled: true },
    stealthMode: true,
  },
];

const INITIAL_VAULT: CredentialVaultItem[] = [
  {
    id: 'vault-1',
    platform: 'linkedin',
    accountName: 'Corporate Talent Outreach',
    username: 'growth@enterprise-ai.io',
    encryptedKey: '••••••••••••••••',
    sessionStatus: 'valid_cookies',
    lastAuthenticated: new Date(Date.now() - 7200000).toISOString(),
    mfaEnabled: true,
  },
  {
    id: 'vault-2',
    platform: 'x_twitter',
    accountName: 'Nexus Tech News Bot',
    username: '@nexus_tech_ai',
    encryptedKey: '••••••••••••••••',
    sessionStatus: 'valid_cookies',
    lastAuthenticated: new Date(Date.now() - 3600000).toISOString(),
    mfaEnabled: false,
  },
  {
    id: 'vault-3',
    platform: 'facebook',
    accountName: 'Enterprise Community Manager',
    username: 'fb-admin@enterprise-ai.io',
    encryptedKey: '••••••••••••••••',
    sessionStatus: 'valid_cookies',
    lastAuthenticated: new Date(Date.now() - 86400000).toISOString(),
    mfaEnabled: true,
  },
  {
    id: 'vault-4',
    platform: 'instagram',
    accountName: 'Visual AI Brand Channel',
    username: '@nexus.ai.official',
    encryptedKey: '••••••••••••••••',
    sessionStatus: 'valid_cookies',
    lastAuthenticated: new Date(Date.now() - 43200000).toISOString(),
    mfaEnabled: true,
  },
];

const SOCIAL_PRESETS: SocialAutomationPreset[] = [
  {
    id: 'preset-linkedin-outreach',
    platform: 'linkedin',
    title: 'LinkedIn B2B Prospect Connection & Outreach',
    description: 'Searches decision makers, extracts profiles, sends personalized connection requests with delay.',
    stepsCount: 5,
    riskLevel: 'medium',
    defaultSteps: [
      { action: 'open_url', description: 'Navigate to LinkedIn Search Sales Navigator', value: 'https://linkedin.com/sales/search/people' },
      { action: 'human_type', description: 'Human-like type search query "VP of AI & Engineering"', targetSelector: 'input.search-global-typeahead__input', value: 'VP of AI & Engineering', humanDelayMs: 650 },
      { action: 'scrape_profiles', description: 'Scrape profile names, headlines, and target URLs', targetSelector: '.search-results-container' },
      { action: 'send_message', description: 'Send connection note with dynamic template merge tags', requiresAuthConfirmation: true },
      { action: 'generate_report', description: 'Export leads to CRM spreadsheet & analytics summary' },
    ],
  },
  {
    id: 'preset-twitter-publisher',
    platform: 'x_twitter',
    title: 'X (Twitter) Trend Monitor & Automated Thread Publisher',
    description: 'Monitors viral tech hashtags, generates summarized insights, and schedules formatted multi-tweet threads.',
    stepsCount: 4,
    riskLevel: 'low',
    defaultSteps: [
      { action: 'open_url', description: 'Open X.com Explore trending search tab', value: 'https://x.com/explore/tabs/for_you' },
      { action: 'read_content', description: 'Extract top 10 AI trending posts and metrics' },
      { action: 'post_update', description: 'Compose and publish 3-tweet summary thread', targetSelector: 'div[aria-label="Post text"]', requiresAuthConfirmation: true },
      { action: 'screenshot', description: 'Capture published thread screenshot verification' },
    ],
  },
  {
    id: 'preset-facebook-group',
    platform: 'facebook',
    title: 'Facebook Group Discussion Monitor & Content Automation',
    description: 'Monitors group posts for relevant enterprise keywords, logs discussions, and drafts human-like replies.',
    stepsCount: 4,
    riskLevel: 'medium',
    defaultSteps: [
      { action: 'open_url', description: 'Navigate to Target Tech Communities Group Feed', value: 'https://facebook.com/groups/enterprise-ai' },
      { action: 'scroll_feed', description: 'Perform human scroll with random delays to trigger lazy loads', humanDelayMs: 1200 },
      { action: 'read_content', description: 'Extract post content and questions matching keyword rules' },
      { action: 'post_update', description: 'Post helpful answer or response to thread', requiresAuthConfirmation: true },
    ],
  },
  {
    id: 'preset-instagram-engagement',
    platform: 'instagram',
    title: 'Instagram Hashtag Visual Content Scraper & Engagement',
    description: 'Scrapes media and captions from visual hashtags, logs top posts, and interacts with target creators.',
    stepsCount: 4,
    riskLevel: 'low',
    defaultSteps: [
      { action: 'open_url', description: 'Open Instagram Hashtag explore page #GenerativeAI', value: 'https://instagram.com/explore/tags/generativeai/' },
      { action: 'scroll_feed', description: 'Scroll feed and extract top post image URLs and captions' },
      { action: 'like_post', description: 'Engage with top 5 verified post items', humanDelayMs: 800 },
      { action: 'generate_report', description: 'Save visual asset collage and engagement metrics' },
    ],
  },
];

const INITIAL_QUEUE: AutomationQueueItem[] = [
  {
    id: 'q-1',
    taskId: 'task-linkedin-1',
    taskName: 'Daily LinkedIn Prospecting Run',
    platform: 'linkedin',
    priority: 'high',
    status: 'pending',
    scheduledTime: 'Today at 14:00 EST',
    retriesLeft: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-2',
    taskId: 'task-twitter-1',
    taskName: 'Automated Tech News Thread Publisher',
    platform: 'x_twitter',
    priority: 'normal',
    status: 'pending',
    scheduledTime: 'Today at 16:30 EST',
    retriesLeft: 3,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_TASKS: WorkflowTask[] = [
  {
    id: 'task-1',
    name: 'LinkedIn Executive Lead Extractor',
    description: 'Scrapes targeted enterprise decision maker profiles, verifies email domains, and prepares outreach queue.',
    platform: 'linkedin',
    profileId: 'prof-2',
    triggerType: 'scheduled',
    cronSchedule: '0 09 * * 1-5',
    requiresUserAuthorization: true,
    lastRunAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastStatus: 'success',
    steps: [
      {
        id: 'step-1',
        action: 'open_url',
        description: 'Open LinkedIn Sales Navigator target filter',
        value: 'https://linkedin.com/sales/search/people',
        status: 'completed',
        outputLogs: 'Page loaded with stealth cookies. Session authenticated.',
      },
      {
        id: 'step-2',
        action: 'human_type',
        description: 'Type query "Chief Technology Officer"',
        targetSelector: 'input.search-input',
        value: 'Chief Technology Officer',
        status: 'completed',
        outputLogs: 'Simulated human typing (78 WPM) completed.',
      },
      {
        id: 'step-3',
        action: 'scrape_profiles',
        description: 'Extract 15 profile links and corporate contact cards',
        requiresAuthConfirmation: true,
        status: 'completed',
        outputLogs: '15 lead records scraped successfully.',
      },
      {
        id: 'step-4',
        action: 'generate_report',
        description: 'Export lead matrix to PDF executive summary',
        status: 'completed',
        outputLogs: 'Generated report: LinkedIn_Leads_CTO.pdf',
      },
    ],
  },
  {
    id: 'task-2',
    name: 'X (Twitter) Keyword Intelligence & Thread Dispatch',
    description: 'Monitors real-time AI announcements on Twitter, drafts summaries, and dispatches verified threads.',
    platform: 'x_twitter',
    profileId: 'prof-2',
    triggerType: 'user_initiated',
    requiresUserAuthorization: true,
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
    lastStatus: 'idle',
    steps: [
      {
        id: 'step-1',
        action: 'open_url',
        description: 'Open X.com search page for #LLM #Gemini3',
        value: 'https://x.com/search?q=%23LLM%20%23Gemini3',
        status: 'pending',
      },
      {
        id: 'step-2',
        action: 'read_content',
        description: 'Extract top 10 tweets with highest engagement ratio',
        status: 'pending',
      },
      {
        id: 'step-3',
        action: 'post_update',
        description: 'Publish synthesized insight thread to @nexus_tech_ai',
        requiresAuthConfirmation: true,
        status: 'pending',
      },
    ],
  },
];

export const useAutomationStore = create<AutomationStore>()(
  persist(
    (set, get) => ({
      profiles: INITIAL_PROFILES,
      tasks: INITIAL_TASKS,
      vault: INITIAL_VAULT,
      queue: INITIAL_QUEUE,
      socialPresets: SOCIAL_PRESETS,
      activeTaskId: 'task-1',
      activeProfileId: 'prof-1',
      isExecuting: false,
      currentStepIndex: 0,
      currentBrowserUrl: 'https://linkedin.com/sales/search/people',
      currentBrowserContent: `<div style="padding: 24px; font-family: monospace; color: #38bdf8;">
        <h2>Playwright Steal-Engine Active Window</h2>
        <p><strong>Session:</strong> LinkedIn Sales Navigator (Authenticated)</p>
        <div style="background: #090d16; padding: 16px; border-radius: 8px; border: 1px solid #1e293b; margin-top: 12px;">
          <div style="color: #10b981;">✓ Human-like Mouse Movement Active (Jitter: 12px variance)</div>
          <div style="color: #10b981;">✓ Stealth Fingerprint Masking (Chrome 124 Linux)</div>
          <div style="color: #eab308; margin-top: 8px;">Waiting for pipeline execution trigger...</div>
        </div>
      </div>`,
      executionLogs: [
        {
          id: 'log-1',
          taskId: 'task-1',
          stepId: 'step-1',
          timestamp: new Date().toLocaleTimeString(),
          message: 'Playwright engine booted with stealth profile "Social Media Stealth Manager"',
          type: 'info',
        },
      ],
      reports: [
        {
          id: 'rep-1',
          taskId: 'task-1',
          taskName: 'LinkedIn Executive Lead Extractor',
          generatedAt: new Date().toISOString(),
          format: 'pdf',
          summary: 'Scraped 15 verified CTO profiles with email verification confidence > 92%.',
          extractedData: {
            totalLeads: 15,
            verifiedEmails: 14,
            averageCompanySize: '250-1000 employees',
            topIndustry: 'Enterprise Software & Cloud AI',
          },
          screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
        },
      ],
      pendingAuthorizationStep: null,

      addProfile: (prof) => {
        const newProf: BrowserProfile = {
          ...prof,
          id: `prof-${Date.now()}`,
          createdAt: new Date().toISOString(),
          behaviorConfig: DEFAULT_BEHAVIOR,
          stealthMode: true,
        };
        set((state) => ({ profiles: [...state.profiles, newProf] }));
      },

      updateProfileBehavior: (id, configUpdates) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, behaviorConfig: { ...p.behaviorConfig, ...configUpdates } } : p
          ),
        }));
      },

      deleteProfile: (id) => {
        set((state) => ({ profiles: state.profiles.filter((p) => p.id !== id) }));
      },

      addTask: (task) => {
        const newTask: WorkflowTask = {
          ...task,
          id: `task-${Date.now()}`,
          lastStatus: 'idle',
        };
        set((state) => ({ tasks: [...state.tasks, newTask], activeTaskId: newTask.id }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      addVaultItem: (item) => {
        const newItem: CredentialVaultItem = {
          ...item,
          id: `vault-${Date.now()}`,
          lastAuthenticated: new Date().toISOString(),
        };
        set((state) => ({ vault: [...state.vault, newItem] }));
      },

      deleteVaultItem: (id) => {
        set((state) => ({ vault: state.vault.filter((v) => v.id !== id) }));
      },

      addQueueItem: (item) => {
        const newItem: AutomationQueueItem = {
          ...item,
          id: `q-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ queue: [...state.queue, newItem] }));
      },

      removeFromQueue: (id) => {
        set((state) => ({ queue: state.queue.filter((q) => q.id !== id) }));
      },

      setActiveTaskId: (id) => set({ activeTaskId: id }),
      setActiveProfileId: (id) => set({ activeProfileId: id }),

      instantiatePreset: (presetId, customParams) => {
        const preset = get().socialPresets.find((p) => p.id === presetId);
        if (!preset) throw new Error('Preset not found');

        const taskName = `${preset.title} (${new Date().toLocaleDateString()})`;
        const newTask: WorkflowTask = {
          id: `task-${Date.now()}`,
          name: taskName,
          description: preset.description,
          platform: preset.platform,
          profileId: get().activeProfileId || 'prof-1',
          triggerType: 'user_initiated',
          requiresUserAuthorization: preset.riskLevel !== 'low',
          steps: preset.defaultSteps.map((step, idx) => ({
            ...step,
            id: `step-${idx + 1}`,
            status: 'pending',
          })),
        };

        set((state) => ({ tasks: [...state.tasks, newTask], activeTaskId: newTask.id }));
        return newTask;
      },

      executeAIPromptCommand: async (prompt: string) => {
        get().addLog('ai-command', 'parser', `AI Command Center parsing prompt: "${prompt}"...`, 'info');

        await new Promise((resolve) => setTimeout(resolve, 1000));

        let platform: SocialPlatform = 'custom';
        const lower = prompt.toLowerCase();
        if (lower.includes('linkedin')) platform = 'linkedin';
        else if (lower.includes('twitter') || lower.includes('x.com')) platform = 'x_twitter';
        else if (lower.includes('facebook')) platform = 'facebook';
        else if (lower.includes('instagram')) platform = 'instagram';

        const generatedSteps: AutomationStep[] = [
          {
            id: 'step-1',
            action: 'open_url',
            description: `Navigate to target ${platform !== 'custom' ? platform.toUpperCase() : 'URL'} portal`,
            value: platform === 'linkedin' ? 'https://linkedin.com' : platform === 'x_twitter' ? 'https://x.com' : 'https://google.com',
            status: 'pending',
          },
          {
            id: 'step-2',
            action: 'human_type',
            description: `Simulate human input for AI generated query`,
            value: prompt,
            humanDelayMs: 500,
            status: 'pending',
          },
          {
            id: 'step-3',
            action: 'extract_data',
            description: 'Extract matching content, links, and engagement metrics',
            requiresAuthConfirmation: true,
            status: 'pending',
          },
          {
            id: 'step-4',
            action: 'generate_report',
            description: 'Compile findings into PDF report',
            status: 'pending',
          },
        ];

        const newTask: WorkflowTask = {
          id: `task-${Date.now()}`,
          name: `AI Pipeline: ${prompt.slice(0, 35)}...`,
          description: `Automatically created by AI Command Center from prompt: "${prompt}"`,
          platform,
          profileId: get().activeProfileId || 'prof-1',
          triggerType: 'ai_triggered',
          requiresUserAuthorization: true,
          steps: generatedSteps,
        };

        set((state) => ({ tasks: [newTask, ...state.tasks], activeTaskId: newTask.id }));
        get().addLog('ai-command', 'parsed', `Generated 4-step pipeline for task "${newTask.name}"`, 'success');
      },

      addLog: (taskId, stepId, message, type = 'info') => {
        const log: ExecutionLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          taskId,
          stepId,
          timestamp: new Date().toLocaleTimeString(),
          message,
          type,
        };
        set((state) => ({ executionLogs: [log, ...state.executionLogs] }));
      },

      executeTask: async (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task || get().isExecuting) return;

        set({ isExecuting: true, currentStepIndex: 0 });
        get().addLog(taskId, 'init', `Booting Playwright session for task: "${task.name}"`, 'info');

        for (let i = 0; i < task.steps.length; i++) {
          const step = task.steps[i];
          set({ currentStepIndex: i });

          // Check for Authorization & Safeguard confirmation
          if (step.requiresAuthConfirmation || (i === 2 && task.requiresUserAuthorization)) {
            get().addLog(
              taskId,
              step.id,
              `🛑 Safeguard Gate Triggered for "${step.description}". Awaiting human confirmation.`,
              'auth_prompt'
            );

            set({
              pendingAuthorizationStep: { task, step },
            });
            return;
          }

          // Execute step normally
          await get().executeStepInternal(taskId, step);
        }

        // Complete execution
        set((state) => ({
          isExecuting: false,
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, lastRunAt: new Date().toISOString(), lastStatus: 'success' }
              : t
          ),
        }));

        get().addLog(taskId, 'complete', `Workflow "${task.name}" completed successfully.`, 'success');
      },

      confirmAuthorizationStep: async (approved) => {
        const pending = get().pendingAuthorizationStep;
        if (!pending) return;

        const { task, step } = pending;
        set({ pendingAuthorizationStep: null });

        if (!approved) {
          get().addLog(
            task.id,
            step.id,
            `User declined authorization for step "${step.description}". Playwright task aborted.`,
            'warning'
          );
          set({ isExecuting: false });
          return;
        }

        get().addLog(
          task.id,
          step.id,
          `Authorization granted by user for "${step.description}". Resuming Playwright browser worker...`,
          'success'
        );

        // Continue execution of remaining steps
        const startIndex = get().currentStepIndex;
        for (let i = startIndex; i < task.steps.length; i++) {
          const nextStep = task.steps[i];
          set({ currentStepIndex: i });
          await get().executeStepInternal(task.id, nextStep);
        }

        set((state) => ({
          isExecuting: false,
          tasks: state.tasks.map((t) =>
            t.id === task.id
              ? { ...t, lastRunAt: new Date().toISOString(), lastStatus: 'success' }
              : t
          ),
        }));

        get().addLog(task.id, 'complete', `Workflow "${task.name}" completed successfully.`, 'success');
      },

      executeStepInternal: async (taskId: string, step: AutomationStep) => {
        get().addLog(taskId, step.id, `Executing Playwright step [${step.action}]: ${step.description}...`, 'info');

        // Simulate human behavior delay if applicable
        const delay = step.humanDelayMs || 900;
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (step.action === 'open_url' && step.value) {
          set({ currentBrowserUrl: step.value });
          set({
            currentBrowserContent: `<div style="padding: 24px; font-family: sans-serif; color: #f8fafc; background: #0f172a;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #334155; padding-bottom: 12px; margin-bottom: 16px;">
                <h2 style="margin:0; font-size: 18px; color: #38bdf8;">🌐 ${step.value}</h2>
                <span style="background:#064e3b; color:#34d399; padding: 4px 10px; border-radius: 9999px; font-size:11px; font-family: monospace;">HTTP 200 OK (220ms)</span>
              </div>
              <p style="color: #94a3b8; font-size: 14px;">Playwright DOM content rendered. Target element interaction ready.</p>
              <div style="background: #020617; padding: 16px; border-radius: 8px; border: 1px solid #1e293b; font-family: monospace; font-size: 12px; color: #a7f3d0;">
                <div>[DOM Tree Loaded] 142 Nodes, 18 Interactive Inputs</div>
                <div>[Human Behavior] Mouse path smooth curve interpolation applied</div>
              </div>
            </div>`,
          });
        }

        get().addLog(taskId, step.id, `Step completed: ${step.description}`, 'success');
      },

      stopExecution: () => {
        set({ isExecuting: false, pendingAuthorizationStep: null });
      },
    }),
    {
      name: 'nexus-ai-automation-store',
      partialize: (state) => ({
        profiles: state.profiles,
        tasks: state.tasks,
        vault: state.vault,
        queue: state.queue,
        reports: state.reports,
      }),
    }
  )
);
