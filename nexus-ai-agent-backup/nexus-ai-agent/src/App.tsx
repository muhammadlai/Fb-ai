import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { RightAssistantPanel } from './components/RightAssistantPanel';
import { DashboardView } from './components/DashboardView';
import { WorkflowPanel } from './components/WorkflowPanel';
import { KnowledgePanel } from './components/KnowledgePanel';
import { AgentsPanel } from './components/AgentsPanel';
import { ImageGenPanel } from './components/ImageGenPanel';
import { VoicePanel } from './components/VoicePanel';
import { IntegrationsPanel } from './components/IntegrationsPanel';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { PromptsPanel } from './components/PromptsPanel';
import { CreatorHomeView } from './components/CreatorHomeView';
import { FloatingVoiceAssistant } from './components/FloatingVoiceAssistant';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import {
  ActiveView,
  ConversationSession,
  ChatMessage,
  SystemSettings,
  WebhookLog,
  SystemHealth,
  N8nStatus,
  User,
  MessageAttachment
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('creator_home');
  const [activeModel, setActiveModel] = useState<string>('gemini-3.6-flash');
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session_default');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(localStorage.getItem('nexus_jwt_token'));
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Health & System Status
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [n8nStatus, setN8nStatus] = useState<N8nStatus | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);

  // UI Panels Collapse & Modals State
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Validate existing JWT token
  const checkCurrentUser = async (token: string) => {
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
      } else {
        localStorage.removeItem('nexus_jwt_token');
        setJwtToken(null);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (jwtToken) {
      checkCurrentUser(jwtToken);
    }
  }, [jwtToken]);

  // Fetch initial data
  const fetchInitialData = async () => {
    setLoading(true);
    const authHeaders: Record<string, string> = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};

    try {
      const [convsRes, settingsRes, healthRes, n8nRes, logsRes] = await Promise.all([
        fetch('/api/v1/chat/conversations', { headers: authHeaders }).then((r) => r.json()).catch(() => []),
        fetch('/api/v1/settings', { headers: authHeaders }).then((r) => r.json()).catch(() => null),
        fetch('/api/health').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/webhooks/n8n/status').then((r) => r.json()).catch(() => null),
        fetch('/api/v1/webhooks/n8n/logs').then((r) => r.json()).catch(() => ({ logs: [] })),
      ]);

      if (Array.isArray(convsRes)) setConversations(convsRes);
      if (settingsRes) {
        setSettings(settingsRes);
        if (settingsRes.selected_model) setActiveModel(settingsRes.selected_model);
      }
      if (healthRes) setHealth(healthRes);
      if (n8nRes) setN8nStatus(n8nRes);
      if (logsRes && logsRes.logs) setLogs(logsRes.logs);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch message history for active session
  const fetchChatHistory = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/v1/chat/history/${sessionId}`);
      if (res.ok) {
        const history = await res.json();
        setMessages(history);
      }
    } catch (err) {
      console.error(`Error loading chat history for ${sessionId}:`, err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      fetchChatHistory(activeSessionId);
    }
  }, [activeSessionId]);

  // Handler: Send Chat Message
  const handleSendMessage = async (content: string, triggerN8n: boolean, attachments?: MessageAttachment[]) => {
    setIsGenerating(true);

    const tempUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      n8n_triggered: triggerN8n,
      metadata: { attachments },
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (jwtToken) headers['Authorization'] = `Bearer ${jwtToken}`;

    try {
      const res = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          session_id: activeSessionId,
          message: content,
          trigger_n8n: triggerN8n,
          model: activeModel,
          temperature: settings?.temperature ?? 0.7,
          system_prompt: settings?.system_prompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        fetchChatHistory(data.session_id);
        fetchInitialData();
      } else {
        setNotification({
          message: 'Error receiving response from backend server.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setNotification({
        message: `Failed to connect to Chat API: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Select Creator Studio Option
  const handleSelectCreatorOption = (targetView: ActiveView, initialPrompt?: string) => {
    setActiveView(targetView);
    if (initialPrompt && (targetView === 'chat' || targetView === 'imagegen')) {
      if (targetView === 'chat') {
        handleSendMessage(initialPrompt, false);
      }
    }
  };

  // Handler: New Chat
  const handleNewChat = () => {
    const newSessionId = `session_${Math.random().toString(36).substring(2, 9)}`;
    setActiveSessionId(newSessionId);
    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        role: 'assistant',
        content: `Hello! I am **Nexus AI Agent Operating System** powered by **${activeModel}**. How can I assist you with full-stack engineering, RAG vector searches, or n8n workflow automations today?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Handler: Delete Session
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/v1/chat/history/${sessionId}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c.session_id !== sessionId));
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Handler: Save Settings
  const handleSaveSettings = async (newSettings: SystemSettings) => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        setSettings(newSettings);
        setNotification({ message: 'Settings successfully saved!', type: 'success' });
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSavingSettings(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden selection:bg-purple-500 selection:text-white relative">
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        activeView={activeView}
        onChangeView={setActiveView}
        isOpenMobile={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Center + Right Area Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950 to-slate-950">
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          activeModel={activeModel}
          onSelectModel={setActiveModel}
          onRefreshData={fetchInitialData}
          onOpenSettings={() => setActiveView('settings')}
        />

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`mx-4 mt-2 p-3 rounded-xl border flex items-center justify-between text-xs font-medium z-30 animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Workspace Views & Chat Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Main View Area */}
          <main className="flex-1 overflow-hidden p-0 sm:p-4 flex flex-col min-h-0 min-w-0 relative">
            {activeView === 'creator_home' && (
              <CreatorHomeView
                onSelectOption={handleSelectCreatorOption}
                onOpenVoice={() => setActiveView('voice')}
              />
            )}

            {activeView === 'chat' && (
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                settings={settings}
              />
            )}

            {activeView === 'dashboard' && (
              <DashboardView health={health} onRefresh={fetchInitialData} />
            )}

            {activeView === 'workflows' && <WorkflowPanel />}

            {activeView === 'knowledge' && <KnowledgePanel />}

            {activeView === 'agents' && <AgentsPanel />}

            {activeView === 'imagegen' && <ImageGenPanel />}

            {activeView === 'voice' && <VoicePanel />}

            {activeView === 'integrations' && <IntegrationsPanel />}

            {activeView === 'analytics' && <AnalyticsView />}

            {activeView === 'prompts' && <PromptsPanel />}

            {activeView === 'settings' && (
              <SettingsView
                settings={settings}
                onSaveSettings={handleSaveSettings}
                saving={isSavingSettings}
              />
            )}

            {/* Placeholder for secondary views */}
            {(activeView === 'workspaces' || activeView === 'documents' || activeView === 'websearch') && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="p-4 rounded-2xl bg-purple-600/20 text-purple-400 mb-3">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide">{activeView} Workspace Active</h3>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  Nexus AI Agent is fully connected to vector database indexing, document chunking, and search grounding engines.
                </p>
                <button
                  onClick={() => setActiveView('chat')}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  Return to AI Chat
                </button>
              </div>
            )}
          </main>

          {/* Right Assistant Panel (Show in Chat View) */}
          {activeView === 'chat' && (
            <RightAssistantPanel
              settings={settings}
              onUpdateSettings={handleSaveSettings}
              isCollapsed={isRightPanelCollapsed}
              onToggleCollapse={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
              activeModel={activeModel}
              onSelectModel={setActiveModel}
            />
          )}
        </div>
      </div>

      {/* Floating Voice Assistant Overlay (Available across all views) */}
      <FloatingVoiceAssistant
        onSendSpokenMessage={(text) => {
          setActiveView('chat');
          handleSendMessage(text, false);
        }}
        isGenerating={isGenerating}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view, prompt) => handleSelectCreatorOption(view, prompt)}
        onSelectModel={setActiveModel}
      />

      {/* Auth Modal */}
      <AuthModal
        currentUser={currentUser}
        onLogin={(token, user) => {
          setJwtToken(token);
          setCurrentUser(user);
        }}
        onLogout={() => {
          setJwtToken(null);
          setCurrentUser(null);
        }}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
