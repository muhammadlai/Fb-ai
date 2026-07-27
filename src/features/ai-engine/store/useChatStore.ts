import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ChatMessage, 
  Conversation, 
  FileAttachment, 
  ReasoningStep, 
  AgentStep, 
  TokenUsage, 
  SystemAnalytics,
  AIModel
} from '../types/ai';
import { AI_MODELS, PROMPT_TEMPLATES } from '../data/modelsAndTemplates';

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedModelId: string;
  isReasoningPanelOpen: boolean;
  isAgentModeEnabled: boolean;
  isGenerating: boolean;
  activeReasoningSteps: ReasoningStep[];
  activeAgentSteps: AgentStep[];
  systemAnalytics: SystemAnalytics;
  
  // Audio state
  isVoiceInputActive: boolean;
  isVoiceOutputActive: boolean;
  
  // Actions
  createConversation: (modelId?: string) => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  togglePinConversation: (id: string) => void;
  setSelectedModelId: (modelId: string) => void;
  setReasoningPanelOpen: (open: boolean) => void;
  setAgentModeEnabled: (enabled: boolean) => void;
  setVoiceInputActive: (active: boolean) => void;
  setVoiceOutputActive: (active: boolean) => void;
  
  // Chat Execution
  sendMessage: (content: string, attachments?: FileAttachment[]) => Promise<void>;
  stopGeneration: () => void;
  clearHistory: () => void;
  exportConversation: (id: string, format: 'json' | 'markdown' | 'txt') => void;
}

const DEFAULT_ANALYTICS: SystemAnalytics = {
  totalTokensProcessed: 142500,
  totalCostUSD: 0.18,
  totalConversations: 1,
  totalMessages: 2,
  failoverCount: 0,
  usageByModel: {
    'gemini-3.6-flash': {
      modelId: 'gemini-3.6-flash',
      provider: 'google',
      totalRequests: 8,
      totalTokens: 92000,
      totalCostUSD: 0.08,
      avgLatencyMs: 240,
    },
    'gemini-3.1-pro-preview': {
      modelId: 'gemini-3.1-pro-preview',
      provider: 'google',
      totalRequests: 3,
      totalTokens: 50500,
      totalCostUSD: 0.10,
      avgLatencyMs: 610,
    }
  },
};

const createInitialConversation = (): Conversation => ({
  id: 'conv-1',
  title: 'Welcome to Nexus AI OS',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  selectedModelId: 'gemini-3.6-flash',
  temperature: 0.7,
  maxTokens: 4096,
  isPinned: true,
  messages: [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      role: 'assistant',
      content: `Welcome to **Nexus AI Creator OS Enterprise v2**! 🚀

I am your multi-model enterprise intelligence engine with native support for:
- **Google Gemini** (Gemini 3.6 Flash, 3.1 Pro)
- **OpenAI** (GPT-4o, GPT-4o Mini, o3-mini)
- **Anthropic Claude** (Claude 3.7 Sonnet, Claude 3.5 Haiku)
- **DeepSeek** (DeepSeek R1, DeepSeek V3)

### Core Capabilities Unlocked:
- ⚡ **Multi-Model Dynamic Switching**: Toggle models mid-conversation seamlessly.
- 🧠 **Reasoning Panel**: Inspect step-by-step thinking & chain-of-thought traces.
- 🤖 **Agent Mode**: Autonomous task decomposition with simulated tool execution.
- 📊 **Real-time Token Counter & Usage Analytics**: Track context window, tokens & costs.
- 📁 **File & Vision Understanding**: Drag & drop code files, images, and data.
- 🎙️ **Voice Commands & TTS Output**: Speech-to-text input and natural audio playback.
- 🛡️ **Intelligent Failover**: Automatic fallback to backup models if rate-limited.

How can I assist your enterprise architecture or development today?`,
      timestamp: new Date().toISOString(),
      modelId: 'gemini-3.6-flash',
      provider: 'google',
      tokenUsage: {
        inputTokens: 120,
        outputTokens: 280,
        totalTokens: 400,
        estimatedCostUSD: 0.0002,
        latencyMs: 180,
      },
    },
  ],
});

let abortController: AbortController | null = null;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => {
      const initConv = createInitialConversation();

      return {
        conversations: [initConv],
        activeConversationId: initConv.id,
        selectedModelId: 'gemini-3.6-flash',
        isReasoningPanelOpen: false,
        isAgentModeEnabled: false,
        isGenerating: false,
        activeReasoningSteps: [],
        activeAgentSteps: [],
        systemAnalytics: DEFAULT_ANALYTICS,
        isVoiceInputActive: false,
        isVoiceOutputActive: false,

        createConversation: (modelId) => {
          const newId = `conv-${Date.now()}`;
          const chosenModel = modelId || get().selectedModelId;
          const newConv: Conversation = {
            id: newId,
            title: 'New Conversation',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            selectedModelId: chosenModel,
            temperature: 0.7,
            maxTokens: 4096,
            messages: [],
          };

          set((state) => ({
            conversations: [newConv, ...state.conversations],
            activeConversationId: newId,
            selectedModelId: chosenModel,
            activeReasoningSteps: [],
            activeAgentSteps: [],
          }));

          return newId;
        },

        selectConversation: (id) => {
          const conv = get().conversations.find((c) => c.id === id);
          if (conv) {
            set({
              activeConversationId: id,
              selectedModelId: conv.selectedModelId || 'gemini-3.6-flash',
              activeReasoningSteps: [],
              activeAgentSteps: [],
            });
          }
        },

        deleteConversation: (id) => {
          set((state) => {
            const filtered = state.conversations.filter((c) => c.id !== id);
            let nextActive = state.activeConversationId;
            if (nextActive === id) {
              nextActive = filtered[0]?.id || null;
            }
            return {
              conversations: filtered,
              activeConversationId: nextActive,
            };
          });
        },

        updateConversationTitle: (id, title) => {
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
            ),
          }));
        },

        togglePinConversation: (id) => {
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === id ? { ...c, isPinned: !c.isPinned } : c
            ),
          }));
        },

        setSelectedModelId: (modelId) => {
          set({ selectedModelId: modelId });
          const { activeConversationId } = get();
          if (activeConversationId) {
            set((state) => ({
              conversations: state.conversations.map((c) =>
                c.id === activeConversationId ? { ...c, selectedModelId: modelId } : c
              ),
            }));
          }
        },

        setReasoningPanelOpen: (open) => set({ isReasoningPanelOpen: open }),
        setAgentModeEnabled: (enabled) => set({ isAgentModeEnabled: enabled }),
        setVoiceInputActive: (active) => set({ isVoiceInputActive: active }),
        setVoiceOutputActive: (active) => set({ isVoiceOutputActive: active }),

        sendMessage: async (content, attachments) => {
          const {
            activeConversationId,
            conversations,
            selectedModelId,
            isAgentModeEnabled,
            isReasoningPanelOpen,
          } = get();

          let convId = activeConversationId;
          if (!convId || !conversations.some((c) => c.id === convId)) {
            convId = get().createConversation();
          }

          const modelObj = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

          // User message
          const userMsg: ChatMessage = {
            id: `msg-u-${Date.now()}`,
            conversationId: convId,
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
            attachments: attachments || [],
          };

          // Assistant placeholder
          const assistantMsgId = `msg-a-${Date.now()}`;
          const assistantMsg: ChatMessage = {
            id: assistantMsgId,
            conversationId: convId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            modelId: selectedModelId,
            provider: modelObj.provider,
            isStreaming: true,
            reasoningSteps: [],
            agentSteps: [],
          };

          // Auto-generate title if first user message
          const targetConv = get().conversations.find((c) => c.id === convId);
          const shouldUpdateTitle = targetConv && targetConv.messages.length === 0;

          set((state) => ({
            isGenerating: true,
            activeReasoningSteps: [],
            activeAgentSteps: [],
            conversations: state.conversations.map((c) => {
              if (c.id === convId) {
                const newTitle = shouldUpdateTitle
                  ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                  : c.title;
                return {
                  ...c,
                  title: newTitle,
                  updatedAt: new Date().toISOString(),
                  messages: [...c.messages, userMsg, assistantMsg],
                };
              }
              return c;
            }),
          }));

          abortController = new AbortController();

          try {
            const currentConv = get().conversations.find((c) => c.id === convId);
            const historyPayload = currentConv
              ? currentConv.messages.slice(0, -1).map((m) => ({
                  role: m.role,
                  content: m.content,
                }))
              : [];

            const response = await fetch('/api/ai/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: abortController.signal,
              body: JSON.stringify({
                model: selectedModelId,
                messages: historyPayload,
                attachments: userMsg.attachments,
                agentMode: isAgentModeEnabled,
                enableReasoning: isReasoningPanelOpen || modelObj.supportsReasoning,
              }),
            });

            if (!response.ok || !response.body) {
              throw new Error(`Server returned status ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulatedContent = '';
            let reasoningList: ReasoningStep[] = [];
            let agentList: AgentStep[] = [];
            let usageData: TokenUsage | undefined = undefined;
            let failoverHappened = false;
            let actualModelUsed = selectedModelId;

            let buffer = '';

            while (!done) {
              const { value, done: readerDone } = await reader.read();
              if (readerDone) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data: ')) continue;
                const jsonStr = trimmed.slice(6);
                if (jsonStr === '[DONE]') {
                  done = true;
                  break;
                }

                try {
                  const event = JSON.parse(jsonStr);

                  if (event.type === 'reasoning') {
                    reasoningList = [
                      ...reasoningList,
                      {
                        id: `r-${Date.now()}-${reasoningList.length}`,
                        stepNumber: reasoningList.length + 1,
                        title: event.title || `Reasoning Phase ${reasoningList.length + 1}`,
                        content: event.content,
                      },
                    ];
                    set({ activeReasoningSteps: reasoningList });
                  } else if (event.type === 'agent_step') {
                    agentList = [...agentList, event.step];
                    set({ activeAgentSteps: agentList });
                  } else if (event.type === 'content') {
                    accumulatedContent += event.content;
                  } else if (event.type === 'failover') {
                    failoverHappened = true;
                    actualModelUsed = event.targetModel;
                  } else if (event.type === 'usage') {
                    usageData = {
                      inputTokens: event.inputTokens,
                      outputTokens: event.outputTokens,
                      totalTokens: event.totalTokens,
                      estimatedCostUSD: event.estimatedCostUSD || 0.0001,
                      latencyMs: event.latencyMs || 200,
                    };
                  }
                } catch {
                  // Ignore JSON parse errors for incomplete chunks
                }

                // Live stream update in store
                set((state) => ({
                  conversations: state.conversations.map((c) => {
                    if (c.id === convId) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantMsgId
                            ? {
                                ...m,
                                content: accumulatedContent,
                                reasoningSteps: reasoningList,
                                agentSteps: agentList,
                                failoverOccurred: failoverHappened,
                                originalModelId: failoverHappened ? selectedModelId : undefined,
                                modelId: actualModelUsed,
                              }
                            : m
                        ),
                      };
                    }
                    return c;
                  }),
                }));
              }
            }

            // Streaming finished successfully
            set((state) => ({
              isGenerating: false,
              conversations: state.conversations.map((c) => {
                if (c.id === convId) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            isStreaming: false,
                            tokenUsage: usageData || {
                              inputTokens: Math.round(content.length / 4),
                              outputTokens: Math.round(accumulatedContent.length / 4),
                              totalTokens: Math.round((content.length + accumulatedContent.length) / 4),
                              estimatedCostUSD: 0.0002,
                              latencyMs: 320,
                            },
                          }
                        : m
                    ),
                  };
                }
                return c;
              }),
            }));

            // Update system analytics counter
            if (usageData) {
              set((state) => ({
                systemAnalytics: {
                  ...state.systemAnalytics,
                  totalTokensProcessed: state.systemAnalytics.totalTokensProcessed + usageData!.totalTokens,
                  totalCostUSD: state.systemAnalytics.totalCostUSD + usageData!.estimatedCostUSD,
                  totalMessages: state.systemAnalytics.totalMessages + 2,
                  failoverCount: state.systemAnalytics.failoverCount + (failoverHappened ? 1 : 0),
                },
              }));
            }
          } catch (error: any) {
            if (error.name === 'AbortError') {
              console.log('Stream generation aborted by user');
            } else {
              console.error('Chat error:', error);
            }

            set((state) => ({
              isGenerating: false,
              conversations: state.conversations.map((c) => {
                if (c.id === convId) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            isStreaming: false,
                            content:
                              m.content ||
                              `⚠️ Connection interrupted or service temporarily unavailable: ${error.message || 'Error communicating with AI engine.'}`,
                            error: error.message,
                          }
                        : m
                    ),
                  };
                }
                return c;
              }),
            }));
          } finally {
            abortController = null;
          }
        },

        stopGeneration: () => {
          if (abortController) {
            abortController.abort();
            abortController = null;
          }
          set({ isGenerating: false });
        },

        clearHistory: () => {
          const { activeConversationId } = get();
          if (!activeConversationId) return;

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === activeConversationId ? { ...c, messages: [] } : c
            ),
            activeReasoningSteps: [],
            activeAgentSteps: [],
          }));
        },

        exportConversation: (id, format) => {
          const conv = get().conversations.find((c) => c.id === id);
          if (!conv) return;

          let dataStr = '';
          let filename = `${conv.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;

          if (format === 'json') {
            dataStr = JSON.stringify(conv, null, 2);
          } else if (format === 'markdown') {
            dataStr = `# ${conv.title}\n\n*Created on: ${new Date(conv.createdAt).toLocaleString()}*\n\n---\n\n`;
            conv.messages.forEach((m) => {
              dataStr += `### ${m.role === 'user' ? '👤 User' : '🤖 Assistant'} (${m.modelId || 'AI'})\n\n${m.content}\n\n---\n\n`;
            });
          } else {
            dataStr = `${conv.title.toUpperCase()}\n\n`;
            conv.messages.forEach((m) => {
              dataStr += `[${m.role.toUpperCase()} - ${m.timestamp}]:\n${m.content}\n\n`;
            });
          }

          const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        },
      };
    },
    {
      name: 'nexus-ai-chat-store',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedModelId: state.selectedModelId,
        isReasoningPanelOpen: state.isReasoningPanelOpen,
        isAgentModeEnabled: state.isAgentModeEnabled,
        systemAnalytics: state.systemAnalytics,
      }),
    }
  )
);
