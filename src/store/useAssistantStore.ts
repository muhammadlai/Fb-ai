import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AssistantEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'confused';

export type ThinkingStage =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'searching_memory'
  | 'planning'
  | 'executing'
  | 'done'
  | 'talking';

export type AvatarAnimationState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'talking'
  | 'happy'
  | 'celebrating'
  | 'typing';

export interface MemoryItem {
  id: string;
  title: string;
  category: 'preference' | 'project' | 'chat_history' | 'goal' | 'system_fact';
  content: string;
  timestamp: string;
  isPinned: boolean;
  isLongTerm: boolean;
  relevanceScore: number;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'user' | 'project' | 'model' | 'agent' | 'memory';
  connections: string[];
}

export interface VoiceConfig {
  gender: 'female' | 'male';
  rate: number; // 0.8 to 1.5
  pitch: number; // 0.8 to 1.2
  wakeWordEnabled: boolean;
  continuousListening: boolean;
  language: 'en-US' | 'ur-PK' | 'auto';
}

interface AssistantStore {
  // Widget visibility
  isWidgetOpen: boolean;
  toggleWidget: () => void;
  setWidgetOpen: (open: boolean) => void;

  // Assistant states
  emotion: AssistantEmotion;
  setEmotion: (emotion: AssistantEmotion) => void;

  thinkingStage: ThinkingStage;
  setThinkingStage: (stage: ThinkingStage) => void;

  avatarAnimation: AvatarAnimationState;
  setAvatarAnimation: (anim: AvatarAnimationState) => void;

  // Voice settings
  voiceConfig: VoiceConfig;
  updateVoiceConfig: (config: Partial<VoiceConfig>) => void;

  // Owner Mode
  isOwnerMode: boolean;
  setOwnerMode: (owner: boolean) => void;

  // Speech conversation logs
  transcript: string;
  setTranscript: (text: string) => void;
  lastResponseText: string;
  setLastResponseText: (text: string) => void;

  // Memories Store
  memories: MemoryItem[];
  addMemory: (memory: Omit<MemoryItem, 'id' | 'timestamp'>) => void;
  togglePinMemory: (id: string) => void;
  deleteMemory: (id: string) => void;

  // Knowledge Graph
  knowledgeNodes: KnowledgeNode[];

  // Conversation Timeline
  timelineLogs: { id: string; speaker: 'user' | 'nexus'; text: string; time: string }[];
  addTimelineLog: (speaker: 'user' | 'nexus', text: string) => void;
}

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'System Owner Profile',
    category: 'preference',
    content: 'User identified as Sir Aitzaz. Owner mode granted full administrative privileges.',
    timestamp: '2026-07-27 01:00',
    isPinned: true,
    isLongTerm: true,
    relevanceScore: 0.99,
  },
  {
    id: 'mem-2',
    title: 'Project Architecture Goal',
    category: 'goal',
    content: 'Build 10-Phase Nexus AI Creator OS Enterprise with Autonomous Agent Orchestration.',
    timestamp: '2026-07-26 18:30',
    isPinned: true,
    isLongTerm: true,
    relevanceScore: 0.95,
  },
  {
    id: 'mem-3',
    title: 'Model Preference',
    category: 'preference',
    content: 'Prefers Gemini 2.5 Flash / Gemini 3.6 Flash for rapid streaming responses and multimodal reasoning.',
    timestamp: '2026-07-25 14:12',
    isPinned: false,
    isLongTerm: true,
    relevanceScore: 0.88,
  },
  {
    id: 'mem-4',
    title: 'Automation Workflow Vector',
    category: 'project',
    content: 'Created Playwright Browser Agent pipeline for automated web synthesis.',
    timestamp: '2026-07-24 10:00',
    isPinned: false,
    isLongTerm: false,
    relevanceScore: 0.82,
  },
];

const DEFAULT_NODES: KnowledgeNode[] = [
  { id: 'node-owner', label: 'Sir Aitzaz (Owner)', type: 'user', connections: ['node-os', 'node-gemini', 'node-agent-1'] },
  { id: 'node-os', label: 'Nexus AI OS Enterprise', type: 'project', connections: ['node-owner', 'node-agent-1', 'node-vectordb'] },
  { id: 'node-gemini', label: 'Gemini 3.6 Flash', type: 'model', connections: ['node-owner', 'node-os'] },
  { id: 'node-agent-1', label: 'Playwright Browser Agent', type: 'agent', connections: ['node-os'] },
  { id: 'node-vectordb', label: 'Vector Knowledge Vault', type: 'memory', connections: ['node-os'] },
];

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set, get) => ({
      isWidgetOpen: true,
      toggleWidget: () => set((s) => ({ isWidgetOpen: !s.isWidgetOpen })),
      setWidgetOpen: (open) => set({ isWidgetOpen: open }),

      emotion: 'neutral',
      setEmotion: (emotion) => set({ emotion }),

      thinkingStage: 'idle',
      setThinkingStage: (thinkingStage) => set({ thinkingStage }),

      avatarAnimation: 'idle',
      setAvatarAnimation: (avatarAnimation) => set({ avatarAnimation }),

      voiceConfig: {
        gender: 'female',
        rate: 1.0,
        pitch: 1.0,
        wakeWordEnabled: true,
        continuousListening: false,
        language: 'auto',
      },
      updateVoiceConfig: (config) =>
        set((s) => ({ voiceConfig: { ...s.voiceConfig, ...config } })),

      isOwnerMode: true,
      setOwnerMode: (isOwnerMode) => set({ isOwnerMode }),

      transcript: '',
      setTranscript: (transcript) => set({ transcript }),

      lastResponseText: 'Assalam-o-Alaikum Aitzaz Sir. Welcome back. Main online hoon. Aap kaise hain? Aaj kis cheez mein madad karun?',
      setLastResponseText: (lastResponseText) => set({ lastResponseText }),

      memories: DEFAULT_MEMORIES,
      addMemory: (memory) => {
        const newItem: MemoryItem = {
          ...memory,
          id: `mem-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
        set((s) => ({ memories: [newItem, ...s.memories] }));
      },
      togglePinMemory: (id) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m)),
        })),
      deleteMemory: (id) =>
        set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      knowledgeNodes: DEFAULT_NODES,

      timelineLogs: [
        {
          id: 'log-1',
          speaker: 'nexus',
          text: 'Welcome back Sir Aitzaz. All systems are online. Awaiting your command.',
          time: 'Just now',
        },
      ],
      addTimelineLog: (speaker, text) =>
        set((s) => ({
          timelineLogs: [
            {
              id: `log-${Date.now()}`,
              speaker,
              text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            ...s.timelineLogs,
          ],
        })),
    }),
    {
      name: 'nexus-ai-assistant-storage',
      partialize: (state) => ({
        voiceConfig: state.voiceConfig,
        isOwnerMode: state.isOwnerMode,
        memories: state.memories,
      }),
    }
  )
);
