import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Star,
  Bot,
  FolderKanban,
  Lightbulb,
  Database,
  FileText,
  Globe,
  Image as ImageIcon,
  Mic,
  Workflow,
  Sliders,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Cpu,
  Wand2,
  Radio,
  Layers,
  ShieldCheck,
  Users,
  CreditCard,
  Key,
  ShieldAlert,
  Terminal,
  Building2
} from 'lucide-react';
import { ConversationSession, ActiveView } from '../types';

interface SidebarProps {
  conversations: ConversationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favList = filteredConversations.filter((c) => favorites[c.session_id]);
  const recentList = filteredConversations.filter((c) => !favorites[c.session_id]);

  const navItems = [
    { id: 'creator_home', label: 'AI Creator OS Home', icon: Wand2, badge: 'Studio', category: 'Creator' },
    { id: 'chat', label: 'AI Chat Workspace', icon: MessageSquare, category: 'Main' },
    { id: 'dashboard', label: 'Platform Metrics', icon: Cpu, badge: 'Live', category: 'Main' },
    { id: 'agents', label: 'AI Agents Fleet', icon: Bot, badge: '5 Active', category: 'Intelligence' },
    { id: 'workspaces', label: 'AI Workspaces', icon: FolderKanban, category: 'Intelligence' },
    { id: 'prompts', label: 'Prompt Library', icon: Lightbulb, category: 'Intelligence' },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database, badge: 'Vector RAG', category: 'Data & RAG' },
    { id: 'documents', label: 'Documents Specs', icon: FileText, category: 'Data & RAG' },
    { id: 'websearch', label: 'Web Search Grounding', icon: Globe, category: 'Tools' },
    { id: 'imagegen', label: 'Image Generator', icon: ImageIcon, badge: 'Imagen 3', category: 'Tools' },
    { id: 'voice', label: 'Voice Assistant Studio', icon: Radio, badge: 'Neural', category: 'Tools' },
    { id: 'workflows', label: 'Workflow Automation', icon: Workflow, badge: 'n8n Hub', category: 'Automation' },
    { id: 'integrations', label: 'Integrations (20+)', icon: Sliders, category: 'Automation' },
    { id: 'team', label: 'Team & Workspaces', icon: Users, badge: 'Roles', category: 'Enterprise' },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard, badge: 'Stripe', category: 'Enterprise' },
    { id: 'api_keys', label: 'API Keys & Gateway', icon: Key, category: 'Enterprise' },
    { id: 'admin', label: 'Admin Console', icon: Building2, badge: 'Owner', category: 'Enterprise' },
    { id: 'logs', label: 'Security & Audit Logs', icon: Terminal, category: 'Enterprise' },
    { id: 'analytics', label: 'Analytics & Costs', icon: BarChart3, category: 'System' },
    { id: 'settings', label: 'Settings & Security', icon: Settings, category: 'System' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 flex flex-col bg-slate-950 border-r border-white/10 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0 select-none overflow-hidden`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0 bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              onClick={() => onChangeView('creator_home')}
              className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shrink-0 shadow-lg shadow-purple-950/50 flex items-center justify-center cursor-pointer group"
            >
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>

            {!isCollapsed && (
              <div
                onClick={() => onChangeView('creator_home')}
                className="flex flex-col min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-300">
                    NEXUS AI
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    v3.6 OS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>System Operational</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-slate-100 hover:border-purple-500/30 transition-all shrink-0"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => {
              onNewChat();
              onChangeView('chat');
            }}
            className={`w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-purple-950/60 hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group border border-white/20 ${
              isCollapsed ? 'p-2.5' : ''
            }`}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform shrink-0" />
            {!isCollapsed && <span>New AI Chat</span>}
          </button>
        </div>

        {/* Sidebar Content Scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
          {/* Main Navigation Items */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                AI Platform Modules
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeView(item.id as ActiveView);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 text-purple-200 border border-purple-500/40 shadow-md shadow-purple-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Conversations Section (When in Chat View & Not Collapsed) */}
          {!isCollapsed && activeView === 'chat' && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              {/* Search Conversations Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-slate-900/80 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-xl border border-white/5 focus:outline-none focus:border-purple-500/40"
                />
              </div>

              {/* Favorites List */}
              {favList.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400/20" /> Pinned Favorites
                  </div>
                  {favList.map((conv) => (
                    <div
                      key={conv.session_id}
                      onClick={() => onSelectSession(conv.session_id)}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                        activeSessionId === conv.session_id
                          ? 'bg-purple-900/30 border-purple-500/40 text-purple-200'
                          : 'border-transparent text-slate-300 hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="truncate font-medium">{conv.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => toggleFavorite(conv.session_id, e)}
                          className="p-1 text-amber-400 hover:text-slate-400"
                        >
                          <Star className="w-3 h-3 fill-amber-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Conversations */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Recent History ({recentList.length})
                </div>
                {recentList.length > 0 ? (
                  recentList.map((conv) => (
                    <div
                      key={conv.session_id}
                      onClick={() => onSelectSession(conv.session_id)}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                        activeSessionId === conv.session_id
                          ? 'bg-purple-900/30 border-purple-500/40 text-purple-200 font-medium'
                          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="truncate pr-2">{conv.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => toggleFavorite(conv.session_id, e)}
                          className="p-1 text-slate-500 hover:text-amber-400"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => onDeleteSession(conv.session_id, e)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-slate-600 text-[11px]">
                    No chat history yet. Start a new session!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Account Status */}
        <div className="p-3 border-t border-white/10 shrink-0 bg-slate-950">
          <div
            className={`p-2 rounded-xl bg-slate-900/80 border border-white/5 flex items-center ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-0.5 shrink-0 flex items-center justify-center font-bold text-xs text-white">
              N
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate">Nexus AI OS</span>
                <span className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Enterprise Active
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
