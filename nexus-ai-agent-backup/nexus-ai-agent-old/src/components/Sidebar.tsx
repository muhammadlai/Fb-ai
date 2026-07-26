import React from 'react';
import { Plus, MessageSquare, Workflow, Settings, ExternalLink, Trash2, Bot, ChevronRight, Activity, X } from 'lucide-react';
import { ConversationSession } from '../types';

interface SidebarProps {
  conversations: ConversationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  activeView: 'chat' | 'n8n' | 'settings';
  onChangeView: (view: 'chat' | 'n8n' | 'settings') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  activeView,
  onChangeView,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo and New Chat */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg text-white shadow-md shadow-indigo-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Nexus AI Agent</h2>
                <p className="text-[11px] text-slate-400">FastAPI • n8n • AI Core</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              onChangeView('chat');
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat Session
          </button>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Recent Conversations
          </div>

          {conversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              No previous chats. Start a new session above!
            </div>
          ) : (
            conversations.map((c) => {
              const isActive = c.session_id === activeSessionId && activeView === 'chat';
              return (
                <div
                  key={c.session_id}
                  onClick={() => {
                    onSelectSession(c.session_id);
                    onChangeView('chat');
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-indigo-300 border border-slate-800'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate text-[12px]">{c.title || 'Untitled Session'}</span>
                  </div>

                  <button
                    onClick={(e) => onDeleteSession(c.session_id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Navigation View Switcher & Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950/90">
          <button
            onClick={() => {
              onChangeView('chat');
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'chat'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>AI Agent Workspace</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onChangeView('n8n');
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'n8n'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Workflow className="w-4 h-4 text-indigo-400" />
              <span>n8n Webhook Studio</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono">Phase 1</span>
          </button>

          <button
            onClick={() => {
              onChangeView('settings');
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'settings'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>System Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Swagger API Docs</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    </>
  );
};
