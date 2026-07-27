import { create } from 'zustand';

export type AppId =
  | 'chrome'
  | 'vscode'
  | 'terminal'
  | 'github'
  | 'gmail'
  | 'youtube'
  | 'browser-auto'
  | 'ai-studio'
  | 'ai-agents';

export interface DockApp {
  id: AppId;
  name: string;
  icon: string;
  category: string;
  isPinned: boolean;
  isRunning: boolean;
  isMinimized: boolean;
  isActive: boolean;
  windowTitle: string;
  memoryUsageMb: number;
  cpuUsagePct: number;
  previewText: string;
  previewImage?: string;
  badge?: string;
}

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'executing';

export interface RunningProcess {
  id: string;
  name: string;
  type:
    | 'Browser Automation'
    | 'AI Agent'
    | 'Background Job'
    | 'Download'
    | 'Upload'
    | 'API Call'
    | 'Memory Indexing'
    | 'Vector Database'
    | 'Workflow Queue';
  status: 'running' | 'completed' | 'queued' | 'paused' | 'failed';
  progress: number;
  details: string;
  startTime: string;
}

export interface DockNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'ai_suggestion'
    | 'agent_message'
    | 'workflow_complete'
    | 'browser_finished'
    | 'memory_updated';
  read: boolean;
}

export interface SystemMetrics {
  currentTime: string;
  currentDate: string;
  internetStatus: 'online' | 'degraded' | 'offline';
  internetSpeedMbps: number;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  activeModel: string;
  activeAgentsCount: number;
  downloadsCount: number;
  uploadQueueCount: number;
  voiceStatus: 'active' | 'muted' | 'listening';
  micStatus: 'on' | 'off' | 'muted';
  speakerStatus: 'on' | 'off' | 'muted';
  volumeLevel: number;
}

interface DockStore {
  apps: DockApp[];
  avatarState: AvatarState;
  avatarMessage: string;
  systemMetrics: SystemMetrics;
  processes: RunningProcess[];
  notifications: DockNotification[];
  globalSearchOpen: boolean;
  activeDockDrawer:
    | 'notifications'
    | 'processes'
    | 'quickActions'
    | 'systemMonitor'
    | 'avatarChat'
    | null;
  screenshotOverlayActive: boolean;
  screenRecordingActive: boolean;

  // Actions
  setGlobalSearchOpen: (open: boolean) => void;
  setActiveDockDrawer: (
    drawer: 'notifications' | 'processes' | 'quickActions' | 'systemMonitor' | 'avatarChat' | null
  ) => void;
  setAvatarState: (state: AvatarState, message?: string) => void;
  
  // App management
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  restoreApp: (id: AppId) => void;
  toggleAppPin: (id: AppId) => void;
  focusApp: (id: AppId) => void;

  // Process management
  togglePauseProcess: (id: string) => void;
  cancelProcess: (id: string) => void;
  addProcess: (proc: Omit<RunningProcess, 'id' | 'startTime'>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (
    notif: Omit<DockNotification, 'id' | 'timestamp' | 'read'>
  ) => void;

  // Media controls & quick actions
  toggleMic: () => void;
  toggleSpeaker: () => void;
  triggerQuickAction: (actionId: string) => void;

  // Live telemetry tick
  tickDockTelemetry: () => void;
}

const INITIAL_APPS: DockApp[] = [
  {
    id: 'chrome',
    name: 'Google Chrome',
    icon: 'Globe',
    category: 'Browser',
    isPinned: true,
    isRunning: true,
    isMinimized: false,
    isActive: false,
    windowTitle: 'Nexus AI - Arc Cloud Engine - Chrome',
    memoryUsageMb: 420,
    cpuUsagePct: 4.2,
    previewText: 'Active Tab: Google AI Studio Docs & Multi-Agent API Engine',
  },
  {
    id: 'vscode',
    name: 'VS Code Cloud',
    icon: 'Code',
    category: 'Development',
    isPinned: true,
    isRunning: true,
    isMinimized: false,
    isActive: true,
    windowTitle: 'src/features/telemetry/TelemetryDashboard.tsx - VS Code',
    memoryUsageMb: 680,
    cpuUsagePct: 12.8,
    previewText: 'Editing Phase 8 Telemetry & Enterprise Dock integration...',
  },
  {
    id: 'terminal',
    name: 'Cyber Terminal',
    icon: 'Terminal',
    category: 'System',
    isPinned: true,
    isRunning: true,
    isMinimized: false,
    isActive: false,
    windowTitle: 'zsh - nexus-agent@cloud-run-container:~/app',
    memoryUsageMb: 110,
    cpuUsagePct: 1.1,
    previewText: 'npm run build: Vite bundle compilation succeeded in 1.4s',
  },
  {
    id: 'github',
    name: 'GitHub Enterprise',
    icon: 'GitBranch',
    category: 'Version Control',
    isPinned: true,
    isRunning: false,
    isMinimized: false,
    isActive: false,
    windowTitle: 'nexus-ai-os/main - GitHub',
    memoryUsageMb: 0,
    cpuUsagePct: 0,
    previewText: 'Repository sync: All PRs merged and validated',
  },
  {
    id: 'gmail',
    name: 'Gmail Workspace',
    icon: 'Mail',
    category: 'Communication',
    isPinned: true,
    isRunning: false,
    isMinimized: false,
    isActive: false,
    windowTitle: 'Inbox (3) - Enterprise AI Workspace Mail',
    memoryUsageMb: 0,
    cpuUsagePct: 0,
    previewText: '3 new notifications from Cloud Run deployment pipeline',
  },
  {
    id: 'youtube',
    name: 'YouTube Media',
    icon: 'Video',
    category: 'Media',
    isPinned: false,
    isRunning: true,
    isMinimized: true,
    isActive: false,
    windowTitle: 'Gemini 2.5 Pro Keynote Stream - YouTube',
    memoryUsageMb: 290,
    cpuUsagePct: 3.5,
    previewText: 'Playing background audio: Lofi Cyber Ambient Study Beats',
  },
  {
    id: 'browser-auto',
    name: 'Browser Automation',
    icon: 'Play',
    category: 'Automation',
    isPinned: true,
    isRunning: true,
    isMinimized: false,
    isActive: false,
    windowTitle: 'Playwright Headless Cluster #4 - Crawling Web',
    memoryUsageMb: 530,
    cpuUsagePct: 18.4,
    previewText: 'Executing Playwright workflow: Extracting competitor price data',
  },
  {
    id: 'ai-studio',
    name: 'AI Creator Studio',
    icon: 'Sparkles',
    category: 'AI Engine',
    isPinned: true,
    isRunning: true,
    isMinimized: false,
    isActive: false,
    windowTitle: 'AI Creator Studio - Canvas #12 Generation',
    memoryUsageMb: 820,
    cpuUsagePct: 22.1,
    previewText: 'Generating vector UI mockup using Gemini 2.5 Pro Architect',
  },
  {
    id: 'ai-agents',
    name: 'Active AI Agents',
    icon: 'Bot',
    category: 'AI Agents',
    isPinned: true,
    isRunning: true,
    isMinimized: false,
    isActive: false,
    windowTitle: 'Swarm Orchestration - 142 Active Agents',
    memoryUsageMb: 940,
    cpuUsagePct: 15.3,
    previewText: 'Agent Swarm #9 synthesizing vector database memory chunks',
  },
];

const INITIAL_PROCESSES: RunningProcess[] = [
  {
    id: 'p-1',
    name: 'Playwright Scraper Cluster',
    type: 'Browser Automation',
    status: 'running',
    progress: 78,
    details: 'Scraping 1,400 e-commerce catalog pages',
    startTime: '10:42:15 AM',
  },
  {
    id: 'p-2',
    name: 'Research Agent Swarm',
    type: 'AI Agent',
    status: 'running',
    progress: 92,
    details: 'Synthesizing market intelligence reports',
    startTime: '10:43:00 AM',
  },
  {
    id: 'p-3',
    name: 'Vector Database Indexer',
    type: 'Vector Database',
    status: 'running',
    progress: 64,
    details: 'Generating embeddings for 25,000 PDF pages',
    startTime: '10:40:12 AM',
  },
  {
    id: 'p-4',
    name: 'Cloud Run Docker Build',
    type: 'Background Job',
    status: 'completed',
    progress: 100,
    details: 'Deployment image pushed to Artifact Registry',
    startTime: '10:35:00 AM',
  },
  {
    id: 'p-5',
    name: 'Dataset Export (JSONL)',
    type: 'Download',
    status: 'running',
    progress: 45,
    details: 'Downloading 4.2 GB fine-tuning dataset',
    startTime: '10:44:10 AM',
  },
  {
    id: 'p-6',
    name: 'Workflow Pipeline Queue',
    type: 'Workflow Queue',
    status: 'queued',
    progress: 0,
    details: 'Pending execution of nightly data ETL pipeline',
    startTime: '10:45:00 AM',
  },
];

const INITIAL_NOTIFICATIONS: DockNotification[] = [
  {
    id: 'n-1',
    title: 'Workflow Execution Complete',
    message: 'Autonomous Web Research Agent successfully compiled 42 market summaries.',
    timestamp: 'Just now',
    type: 'workflow_complete',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Browser Automation Finished',
    message: 'Playwright headless browser completed 120 form submissions with 0 errors.',
    timestamp: '2 mins ago',
    type: 'browser_finished',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Memory Vault Vector Index Updated',
    message: 'Added 1,250 new semantic vectors to Qdrant cluster vault.',
    timestamp: '5 mins ago',
    type: 'memory_updated',
    read: false,
  },
  {
    id: 'n-4',
    title: 'AI Optimization Suggestion',
    message: 'Switching to Gemini 2.5 Flash reduced API latency by 140ms.',
    timestamp: '12 mins ago',
    type: 'ai_suggestion',
    read: true,
  },
  {
    id: 'n-5',
    title: 'Agent Message Received',
    message: 'Agent #14 ("FinOps Monitor") generated a weekly cost reduction analysis.',
    timestamp: '25 mins ago',
    type: 'agent_message',
    read: true,
  },
];

export const useDockStore = create<DockStore>((set, get) => ({
  apps: INITIAL_APPS,
  avatarState: 'idle',
  avatarMessage: 'Nexus AI Ready. How can I assist your workflow today?',
  systemMetrics: {
    currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    currentDate: new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
    internetStatus: 'online',
    internetSpeedMbps: 985,
    cpuUsage: 28,
    gpuUsage: 42,
    ramUsage: 64,
    diskUsage: 35,
    activeModel: 'Gemini 2.5 Flash',
    activeAgentsCount: 142,
    downloadsCount: 2,
    uploadQueueCount: 1,
    voiceStatus: 'active',
    micStatus: 'on',
    speakerStatus: 'on',
    volumeLevel: 85,
  },
  processes: INITIAL_PROCESSES,
  notifications: INITIAL_NOTIFICATIONS,
  globalSearchOpen: false,
  activeDockDrawer: null,
  screenshotOverlayActive: false,
  screenRecordingActive: false,

  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
  setActiveDockDrawer: (drawer) =>
    set((state) => ({
      activeDockDrawer: state.activeDockDrawer === drawer ? null : drawer,
    })),

  setAvatarState: (avatarState, message) =>
    set((state) => ({
      avatarState,
      avatarMessage: message || state.avatarMessage,
    })),

  openApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, isRunning: true, isMinimized: false, isActive: true }
          : { ...app, isActive: false }
      ),
    })),

  closeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, isRunning: false, isActive: false } : app
      ),
    })),

  minimizeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, isMinimized: true, isActive: false } : app
      ),
    })),

  restoreApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, isMinimized: false, isActive: true }
          : { ...app, isActive: false }
      ),
    })),

  toggleAppPin: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, isPinned: !app.isPinned } : app
      ),
    })),

  focusApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, isRunning: true, isMinimized: false, isActive: true }
          : { ...app, isActive: false }
      ),
    })),

  togglePauseProcess: (id) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'paused' ? 'running' : 'paused' }
          : p
      ),
    })),

  cancelProcess: (id) =>
    set((state) => ({
      processes: state.processes.filter((p) => p.id !== id),
    })),

  addProcess: (proc) =>
    set((state) => ({
      processes: [
        {
          ...proc,
          id: `p-${Date.now()}`,
          startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...state.processes,
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearAllNotifications: () => set({ notifications: [] }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          ...notif,
          id: `n-${Date.now()}`,
          timestamp: 'Just now',
          read: false,
        },
        ...state.notifications,
      ],
    })),

  toggleMic: () =>
    set((state) => ({
      systemMetrics: {
        ...state.systemMetrics,
        micStatus: state.systemMetrics.micStatus === 'on' ? 'muted' : 'on',
      },
    })),

  toggleSpeaker: () =>
    set((state) => ({
      systemMetrics: {
        ...state.systemMetrics,
        speakerStatus: state.systemMetrics.speakerStatus === 'on' ? 'muted' : 'on',
      },
    })),

  triggerQuickAction: (actionId) => {
    const { addNotification, setAvatarState, setGlobalSearchOpen } = get();

    switch (actionId) {
      case 'new-chat':
        setAvatarState('listening', 'Starting new AI Chat session...');
        addNotification({
          title: 'New AI Chat Session',
          message: 'Initialized context window for new chat.',
          type: 'ai_suggestion',
        });
        setTimeout(() => setAvatarState('idle'), 2500);
        break;
      case 'new-project':
        addNotification({
          title: 'Project Scaffold Ready',
          message: 'Created new project workspace directory in Creator Studio.',
          type: 'success',
        });
        break;
      case 'open-browser':
        get().focusApp('chrome');
        break;
      case 'open-terminal':
        get().focusApp('terminal');
        break;
      case 'launch-agent':
        get().focusApp('ai-agents');
        setAvatarState('executing', 'Deploying Agent Swarm #15...');
        setTimeout(() => setAvatarState('idle'), 3000);
        break;
      case 'voice-command':
        setAvatarState('listening', 'Voice synthesis activated. Speak now...');
        setTimeout(() => setAvatarState('thinking', 'Processing acoustic tokens...'), 2000);
        setTimeout(() => setAvatarState('speaking', 'Executing voice instruction.'), 4000);
        setTimeout(() => setAvatarState('idle'), 6000);
        break;
      case 'screenshot':
        set({ screenshotOverlayActive: true });
        addNotification({
          title: 'Screenshot Captured',
          message: 'Saved active workspace frame to clipboard & media library.',
          type: 'success',
        });
        setTimeout(() => set({ screenshotOverlayActive: false }), 1200);
        break;
      case 'screen-recording':
        set((state) => ({ screenRecordingActive: !state.screenRecordingActive }));
        addNotification({
          title: 'Screen Recording Toggled',
          message: 'Cyber frame buffer capture stream toggled.',
          type: 'info',
        });
        break;
      case 'search-everything':
        setGlobalSearchOpen(true);
        break;
      default:
        break;
    }
  },

  tickDockTelemetry: () => {
    const now = new Date();
    set((state) => ({
      systemMetrics: {
        ...state.systemMetrics,
        currentTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        currentDate: now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
        cpuUsage: Math.min(99, Math.max(12, Math.round(state.systemMetrics.cpuUsage + (Math.random() * 8 - 4)))),
        gpuUsage: Math.min(99, Math.max(20, Math.round(state.systemMetrics.gpuUsage + (Math.random() * 10 - 5)))),
        ramUsage: Math.min(95, Math.max(50, Math.round(state.systemMetrics.ramUsage + (Math.random() * 4 - 2)))),
        diskUsage: 35,
      },
    }));
  },
}));
