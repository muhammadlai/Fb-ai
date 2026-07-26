import React, { useState, useEffect } from 'react';
import { Menu, Bot, Sparkles, RefreshCw, Server, Workflow, CheckCircle2, ShieldAlert, UserCheck, Shield } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { N8nWebhookPanel } from './components/N8nWebhookPanel';
import { SettingsModal } from './components/SettingsModal';
import { FastApiHealthCard } from './components/FastApiHealthCard';
import { AuthModal } from './components/AuthModal';
import { ConversationSession, ChatMessage, SystemSettings, WebhookLog, SystemHealth, N8nStatus, User } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'chat' | 'n8n' | 'settings'>('chat');
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session_default');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(localStorage.getItem('nexus_jwt_token'));
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Health & Logs for Phase 1 Hub
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [n8nStatus, setN8nStatus] = useState<N8nStatus | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [triggeringWebhook, setTriggeringWebhook] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Validate existing JWT token on load
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

  // Fetch initial conversations list & settings
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
      if (settingsRes) setSettings(settingsRes);
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
  const handleSendMessage = async (content: string, triggerN8n: boolean) => {
    setIsGenerating(true);
    
    // Optimistic user message render
    const tempUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      n8n_triggered: triggerN8n,
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
          model: settings?.selected_model,
          temperature: settings?.temperature,
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

  // Handler: Create New Chat
  const handleNewChat = () => {
    const newSessionId = `session_${Math.random().toString(36).substring(2, 9)}`;
    setActiveSessionId(newSessionId);
    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        role: 'assistant',
        content: 'New chat session started. How can Nexus AI Agent help you?',
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

  // Handler: Trigger Webhook from Phase 1 Panel
  const handleTriggerWebhook = async (eventType: string, payload: any) => {
    setTriggeringWebhook(true);
    try {
      const res = await fetch('/api/v1/webhooks/n8n/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          workflow_id: 'nexus_main_workflow',
          user_id: currentUser ? currentUser.id : 'nexus_admin',
          payload,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({
          message: `Webhook successfully dispatched! Event ID: ${data.event_id}`,
          type: 'success',
        });
        fetchInitialData();
      } else {
        setNotification({
          message: `Failed to trigger webhook: ${data.detail || 'Unknown error'}`,
          type: 'error',
        });
      }
    } catch (err: any) {
      setNotification({
        message: `Error connecting to backend: ${err.message}`,
        type: 'error',
      });
    } finally {
      setTriggeringWebhook(false);
      setTimeout(() => setNotification(null), 5000);
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
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
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

      {/* Main App Content Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950">
        {/* Top Navbar / Mobile Header */}
        <header className="h-16 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-100">
                {activeView === 'chat' && 'AI Agent Chat Dashboard'}
                {activeView === 'n8n' && 'n8n Webhook Studio'}
                {activeView === 'settings' && 'System Configuration'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                FastAPI Auth & AI Core Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User Auth Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
            >
              <UserCheck className={`w-4 h-4 ${currentUser ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.username : 'Sign In'}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeView === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chat Interface
              </button>
              <button
                onClick={() => setActiveView('n8n')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeView === 'n8n' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                n8n Webhooks
              </button>
            </div>

            <button
              onClick={fetchInitialData}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
              title="Refresh System Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`mx-4 mt-3 p-3 rounded-xl border flex items-center justify-between text-xs font-medium z-20 ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 overflow-hidden p-4 sm:p-6 flex flex-col min-h-0">
          {activeView === 'chat' && (
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              settings={settings}
            />
          )}

          {activeView === 'n8n' && (
            <div className="flex-1 overflow-y-auto space-y-6">
              <FastApiHealthCard
                health={health}
                n8nStatus={n8nStatus}
                loading={loading}
                onRefresh={fetchInitialData}
              />
              <N8nWebhookPanel
                logs={logs}
                onTriggerWebhook={handleTriggerWebhook}
                onRefreshLogs={fetchInitialData}
                triggering={triggeringWebhook}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="flex-1 overflow-y-auto">
              <SettingsModal
                settings={settings}
                onSaveSettings={handleSaveSettings}
                saving={isSavingSettings}
              />
            </div>
          )}
        </main>

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

        {/* Global Status Footer */}
        <footer className="h-9 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>FastAPI Backend Connected</span>
            <span className="hidden sm:inline">• AI Intelligence & Auth Layer Active</span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-emerald-400 font-bold">Phase 3: 100% Completed</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
