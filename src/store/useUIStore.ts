import { create } from 'zustand';
import { AIModelOption, CyberThemeMode } from '../types/ui';

interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  theme: CyberThemeMode;
  setTheme: (theme: CyberThemeMode) => void;
  
  selectedModel: AIModelOption;
  availableModels: AIModelOption[];
  setSelectedModel: (model: AIModelOption) => void;
  
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  systemHealth: {
    status: 'optimal' | 'degraded' | 'maintenance';
    cpuLoad: number;
    memoryUsage: number;
    activeAgents: number;
  };
  updateSystemMetrics: () => void;
}

const DEFAULT_MODELS: AIModelOption[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google AI',
    version: '2.5.0-ultra',
    status: 'active',
    latencyMs: 110,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro Architect',
    provider: 'Google AI',
    version: '2.5.1-pro',
    status: 'active',
    latencyMs: 240,
  },
  {
    id: 'nexus-omni-v2',
    name: 'Nexus Creator Engine v2',
    provider: 'Nexus Labs',
    version: '2.0.0-custom',
    status: 'active',
    latencyMs: 145,
  },
];

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  theme: 'cyber-purple',
  setTheme: (theme) => set({ theme }),

  selectedModel: DEFAULT_MODELS[0],
  availableModels: DEFAULT_MODELS,
  setSelectedModel: (selectedModel) => set({ selectedModel }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

  systemHealth: {
    status: 'optimal',
    cpuLoad: 24.8,
    memoryUsage: 62.4,
    activeAgents: 142,
  },

  updateSystemMetrics: () =>
    set((state) => ({
      systemHealth: {
        ...state.systemHealth,
        cpuLoad: Number((20 + Math.random() * 15).toFixed(1)),
        memoryUsage: Number((58 + Math.random() * 10).toFixed(1)),
      },
    })),
}));
