import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Brain, 
  Workflow, 
  Download, 
  Zap,
  Bot
} from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { ConversationSidebar } from './ConversationSidebar';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { ReasoningPanel } from './ReasoningPanel';
import { PromptTemplatesModal } from './PromptTemplatesModal';
import { UsageAnalyticsModal } from './UsageAnalyticsModal';

export const AIChatWindow: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    selectedModelId,
    isReasoningPanelOpen,
    isAgentModeEnabled,
    isGenerating,
    activeReasoningSteps,
    systemAnalytics,
    isVoiceOutputActive,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    togglePinConversation,
    setSelectedModelId,
    setReasoningPanelOpen,
    setAgentModeEnabled,
    setVoiceOutputActive,
    sendMessage,
    stopGeneration,
    clearHistory,
    exportConversation,
  } = useChatStore();

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation ? activeConversation.messages : [];

  // Voice Text-to-Speech Output on last message
  const handleToggleVoiceOutput = () => {
    if (isVoiceOutputActive) {
      window.speechSynthesis?.cancel();
      setVoiceOutputActive(false);
    } else {
      if (!('speechSynthesis' in window)) {
        alert('Text-to-speech is not supported in this browser environment.');
        return;
      }
      const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
      if (lastAssistantMsg && lastAssistantMsg.content) {
        const utterance = new SpeechSynthesisUtterance(
          lastAssistantMsg.content.replace(/[*#`_]/g, '')
        );
        utterance.onend = () => setVoiceOutputActive(false);
        utterance.onerror = () => setVoiceOutputActive(false);
        setVoiceOutputActive(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Sidebar History */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onCreateConversation={() => createConversation()}
        onDeleteConversation={deleteConversation}
        onUpdateTitle={updateConversationTitle}
        onTogglePin={togglePinConversation}
        onExport={exportConversation}
        onClearHistory={clearHistory}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/60 relative">
        {/* Workspace Top Navigation Bar */}
        <div className="h-14 px-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Model Selector Dropdown */}
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelectModel={setSelectedModelId}
            />

            {/* Title / Status */}
            <div className="hidden sm:flex items-center gap-2 truncate">
              <span className="text-xs text-slate-500 font-mono">/</span>
              <span className="text-xs font-semibold text-slate-300 truncate">
                {activeConversation?.title || 'New Session'}
              </span>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2">
            {/* Live Token Usage Badge */}
            <button
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-cyan-400 transition-colors shadow-sm"
              title="View Usage & Token Telemetry"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">
                {(systemAnalytics.totalTokensProcessed / 1000).toFixed(1)}k tokens
              </span>
            </button>

            {/* Voice Output Toggle */}
            <button
              onClick={handleToggleVoiceOutput}
              className={`p-2 rounded-xl border transition-colors ${
                isVoiceOutputActive
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Read Response Aloud (TTS)"
            >
              {isVoiceOutputActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reasoning Drawer Toggle */}
            <button
              onClick={() => setReasoningPanelOpen(!isReasoningPanelOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isReasoningPanelOpen
                  ? 'bg-purple-900/40 border-purple-700/60 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Reasoning Trace Panel"
            >
              <Brain className="w-4 h-4 text-purple-400" />
            </button>

            {/* Analytics Modal Launcher */}
            <button
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              title="Usage Telemetry"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <MessageList
          messages={messages}
          isGenerating={isGenerating}
          onSelectPromptTemplate={(promptText) => sendMessage(promptText)}
        />

        {/* Chat Input Dock */}
        <ChatInput
          onSendMessage={sendMessage}
          onStopGeneration={stopGeneration}
          isGenerating={isGenerating}
          isReasoningEnabled={isReasoningPanelOpen}
          onToggleReasoning={() => setReasoningPanelOpen(!isReasoningPanelOpen)}
          isAgentModeEnabled={isAgentModeEnabled}
          onToggleAgentMode={() => setAgentModeEnabled(!isAgentModeEnabled)}
          onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        />
      </div>

      {/* Right Drawer: Reasoning Panel */}
      <ReasoningPanel
        isOpen={isReasoningPanelOpen}
        onClose={() => setReasoningPanelOpen(false)}
        reasoningSteps={activeReasoningSteps}
        isGenerating={isGenerating}
      />

      {/* Modals */}
      <PromptTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={(promptText) => sendMessage(promptText)}
      />

      <UsageAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        analytics={systemAnalytics}
      />
    </div>
  );
};
