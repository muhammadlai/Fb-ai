import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Command,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  ChevronDown,
  Moon,
  Sun,
  ShieldCheck,
  UserCheck,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { User, AIModel } from '../types';
import { AI_MODELS } from '../data/mockData';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenCommandPalette: () => void;
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  creditsRemaining?: number;
  onRefreshData?: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenCommandPalette,
  activeModel,
  onSelectModel,
  creditsRemaining = 94280,
  onOpenSettings,
}) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Enterprise Production');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentModelObj = AI_MODELS.find(m => m.id === activeModel) || AI_MODELS[1];

  const workspaces = [
    'Enterprise Production',
    'AI R&D Lab Workspace',
    'Marketing & Copy Studio',
    'Personal Sandbox',
  ];

  const notifications = [
    { id: '1', title: 'n8n Webhook Pipeline Triggered', time: '2 mins ago', type: 'success' },
    { id: '2', title: 'Pinecone Vector DB Index Synced', time: '14 mins ago', type: 'info' },
    { id: '3', title: 'GPU Cluster Peak Capacity Alert', time: '1 hour ago', type: 'warning' },
  ];

  return (
    <header className="h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-xl z-20 relative">
      {/* Left Area: Search Bar & Workspace Selector */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Command Search Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-purple-500/40 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group w-48 sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="truncate">Search or type command...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 text-xs font-semibold text-slate-200 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[160px]">{selectedWorkspace}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isWorkspaceOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl animate-fadeIn"
              onClick={() => setIsWorkspaceOpen(false)}
            >
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500">Active Workspaces</div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => setSelectedWorkspace(ws)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedWorkspace === ws
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{ws}</span>
                  {selectedWorkspace === ws && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: AI Model Selector, Credits, API Status, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Model Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setIsModelOpen(!isModelOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/40 hover:border-purple-400 text-xs font-semibold text-purple-200 shadow-lg shadow-purple-950/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
            <span className="hidden md:inline text-slate-400 font-mono text-[11px]">Model:</span>
            <span className="truncate max-w-[100px] sm:max-w-[140px] text-purple-300">{currentModelObj.name}</span>
            <span className="hidden xl:inline px-1.5 py-0.5 rounded-full bg-purple-500/20 text-[10px] text-purple-300 border border-purple-500/30">
              {currentModelObj.badge || 'Active'}
            </span>
            <ChevronDown className="w-3 h-3 text-purple-400 shrink-0" />
          </button>

          {isModelOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-fadeIn max-h-96 overflow-y-auto"
              onClick={() => setIsModelOpen(false)}
            >
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
                <span>Select AI Frontier Model</span>
                <span className="text-purple-400">10 Available</span>
              </div>

              <div className="space-y-1 mt-1">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => onSelectModel(model.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-all border ${
                      activeModel === model.id
                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                        : 'border-transparent text-slate-300 hover:bg-slate-800/80 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-100">{model.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-400 border border-purple-500/20">
                        {model.speed}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{model.description}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-500">
                      <span>Ctx: {model.context_window}</span>
                      <span>•</span>
                      <span>Cost: {model.cost_per_1k}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Credits Remaining Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400/20" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 leading-none">Credits</span>
            <span className="text-amber-300 font-bold leading-tight">
              {creditsRemaining.toLocaleString()} <span className="text-slate-600 font-normal">/ 100k</span>
            </span>
          </div>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 w-[94%]" />
          </div>
        </div>

        {/* API Connected Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">API Live</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 text-slate-400 hover:text-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-slate-950 animate-pulse" />
          </button>

          {isNotifOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-2xl animate-fadeIn"
              onClick={() => setIsNotifOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-slate-200">System Activity Notifications</span>
                <span className="text-[10px] text-purple-400 font-mono">3 New</span>
              </div>
              <div className="space-y-2 mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <div className="font-semibold text-slate-200">{n.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Actions */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/80 border border-white/10 hover:border-purple-500/40 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {currentUser?.username ? currentUser.username[0].toUpperCase() : 'N'}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-slate-200 pr-1">
              {currentUser ? currentUser.username : 'Nexus User'}
            </span>
          </button>

          {isProfileOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-fadeIn"
              onClick={() => setIsProfileOpen(false)}
            >
              <div className="p-2 border-b border-white/10">
                <div className="text-xs font-bold text-slate-100">{currentUser ? currentUser.username : 'Nexus Admin'}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser ? currentUser.email : 'aitzazji91@gmail.com'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <ShieldCheck className="w-3 h-3 text-purple-400" /> Pro Tier Plan
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={onOpenSettings}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" /> Account & API Keys
                </button>
                <button
                  onClick={onOpenAuth}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Switch Account / Auth
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
