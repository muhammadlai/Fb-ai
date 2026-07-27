import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ModuleId,
  TechnologyOption,
  GeneratedProject,
  GenerationHistoryItem,
  ModuleCategory,
  AISettings,
} from '../types/creator';
import { CREATOR_MODULES, MODULE_TEMPLATES } from '../data/modulesAndTemplates';
import { generateEnterpriseProject } from '../utils/projectGenerator';

interface CreatorStore {
  activeModuleId: ModuleId;
  activeCategory: ModuleCategory | 'all';
  selectedTechStack: TechnologyOption[];
  currentPrompt: string;
  aiSettings: AISettings;
  isWizardOpen: boolean;
  wizardStepIndex: number;
  wizardValues: Record<string, any>;
  isGenerating: boolean;
  activeProject: GeneratedProject | null;
  history: GenerationHistoryItem[];
  savedProjects: GeneratedProject[];

  // Actions
  setActiveModuleId: (id: ModuleId) => void;
  setActiveCategory: (cat: ModuleCategory | 'all') => void;
  setTechStack: (stack: TechnologyOption[]) => void;
  toggleTechStackOption: (option: TechnologyOption) => void;
  setCurrentPrompt: (prompt: string) => void;
  enhancePrompt: () => void;
  updateAiSettings: (settings: Partial<AISettings>) => void;
  openWizard: () => void;
  closeWizard: () => void;
  setWizardStepIndex: (idx: number) => void;
  updateWizardValues: (values: Record<string, any>) => void;
  applyTemplate: (templateId: string) => void;
  generateProject: () => Promise<GeneratedProject>;
  loadHistoryProject: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
}

const INITIAL_PROJECT = generateEnterpriseProject(
  'website',
  'Create a modern enterprise SaaS website for Nexus AI featuring product tour, pricing, and live lead form.',
  ['react', 'nextjs', 'tailwind', 'docker'],
  { siteName: 'Aura Enterprise Cloud' }
);

export const useCreatorStore = create<CreatorStore>()(
  persist(
    (set, get) => ({
      activeModuleId: 'website',
      activeCategory: 'all',
      selectedTechStack: ['react', 'nextjs', 'tailwind', 'docker'],
      currentPrompt: 'Create a modern enterprise SaaS website for Nexus AI featuring product tour, pricing, and live lead form.',
      aiSettings: {
        model: 'Gemini 1.5 Pro Enterprise',
        temperature: 0.2,
        reasoningEnabled: true,
        multiStepPlanning: true,
        systemPrompt: 'You are an elite Software Architect specializing in domain-driven enterprise software systems.',
        theme: 'dark',
      },
      isWizardOpen: false,
      wizardStepIndex: 0,
      wizardValues: { siteName: 'Aura Enterprise Cloud' },
      isGenerating: false,
      activeProject: INITIAL_PROJECT,
      history: [
        {
          id: INITIAL_PROJECT.id,
          timestamp: new Date().toLocaleTimeString(),
          prompt: INITIAL_PROJECT.prompt,
          moduleName: 'AI Website Builder',
          techStack: ['react', 'nextjs', 'tailwind', 'docker'],
          summary: 'Aura Enterprise Cloud Web Architecture',
          filesCount: INITIAL_PROJECT.files.length,
          version: '1.0.0',
        },
      ],
      savedProjects: [INITIAL_PROJECT],

      setActiveModuleId: (id) => {
        const mod = CREATOR_MODULES.find((m) => m.id === id);
        if (mod) {
          set({
            activeModuleId: id,
            selectedTechStack: mod.defaultTechStack,
            wizardStepIndex: 0,
            wizardValues: {},
          });
        }
      },

      setActiveCategory: (cat) => set({ activeCategory: cat }),

      setTechStack: (stack) => set({ selectedTechStack: stack }),

      toggleTechStackOption: (option) => {
        const current = get().selectedTechStack;
        if (current.includes(option)) {
          set({ selectedTechStack: current.filter((o) => o !== option) });
        } else {
          set({ selectedTechStack: [...current, option] });
        }
      },

      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

      enhancePrompt: () => {
        const p = get().currentPrompt;
        const mod = CREATOR_MODULES.find((m) => m.id === get().activeModuleId)?.name || 'Module';
        const enhanced = `Architect an enterprise-grade ${mod} system based on: "${p}". Include multi-layer domain logic, OpenAPI 3.0 specs, OAuth2 JWT security middleware, PostgreSQL schemas, and Docker deployment stacks.`;
        set({ currentPrompt: enhanced });
      },

      updateAiSettings: (settings) =>
        set((s) => ({ aiSettings: { ...s.aiSettings, ...settings } })),

      openWizard: () => set({ isWizardOpen: true, wizardStepIndex: 0 }),
      closeWizard: () => set({ isWizardOpen: false }),

      setWizardStepIndex: (idx) => set({ wizardStepIndex: idx }),

      updateWizardValues: (values) =>
        set((state) => ({ wizardValues: { ...state.wizardValues, ...values } })),

      applyTemplate: (templateId) => {
        const tpl = MODULE_TEMPLATES.find((t) => t.id === templateId);
        if (tpl) {
          set({
            activeModuleId: tpl.moduleId,
            selectedTechStack: tpl.techStack,
            currentPrompt: tpl.defaultPrompt,
          });
          get().generateProject();
        }
      },

      generateProject: async () => {
        set({ isGenerating: true });

        // Simulate high-speed AI code generation
        await new Promise((resolve) => setTimeout(resolve, 800));

        const state = get();
        const project = generateEnterpriseProject(
          state.activeModuleId,
          state.currentPrompt,
          state.selectedTechStack,
          state.wizardValues
        );

        const modName = CREATOR_MODULES.find((m) => m.id === state.activeModuleId)?.name || 'Module';

        const newHistoryItem: GenerationHistoryItem = {
          id: project.id,
          timestamp: new Date().toLocaleTimeString(),
          prompt: state.currentPrompt,
          moduleName: modName,
          techStack: state.selectedTechStack,
          summary: `${project.title} Blueprint`,
          filesCount: project.files.length,
          version: `1.${state.history.length}.0`,
        };

        set((s) => ({
          isGenerating: false,
          activeProject: project,
          savedProjects: [project, ...s.savedProjects],
          history: [newHistoryItem, ...s.history],
          isWizardOpen: false,
        }));

        return project;
      },

      loadHistoryProject: (id) => {
        const project = get().savedProjects.find((p) => p.id === id);
        if (project) {
          set({
            activeProject: project,
            activeModuleId: project.moduleId,
            selectedTechStack: project.techStack,
            currentPrompt: project.prompt,
          });
        }
      },

      deleteHistoryItem: (id) => {
        set((s) => ({
          history: s.history.filter((h) => h.id !== id),
          savedProjects: s.savedProjects.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: 'nexus-ai-creator-studio-store',
      partialize: (state) => ({
        activeModuleId: state.activeModuleId,
        history: state.history,
        savedProjects: state.savedProjects,
        aiSettings: state.aiSettings,
      }),
    }
  )
);

