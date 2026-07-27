import React from 'react';
import {
  MessageSquarePlus,
  FolderPlus,
  Globe,
  Terminal,
  Bot,
  Mic,
  Camera,
  Video,
  Search,
  Zap,
} from 'lucide-react';
import { useDockStore } from '../../store/useDockStore';

export const QuickActions: React.FC = () => {
  const { triggerQuickAction, screenRecordingActive } = useDockStore();

  const actions = [
    {
      id: 'new-chat',
      label: 'New Chat',
      icon: <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'hover:border-cyan-500 hover:text-cyan-300',
    },
    {
      id: 'new-project',
      label: 'New Project',
      icon: <FolderPlus className="w-3.5 h-3.5 text-purple-400" />,
      color: 'hover:border-purple-500 hover:text-purple-300',
    },
    {
      id: 'open-browser',
      label: 'Open Browser',
      icon: <Globe className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'hover:border-emerald-500 hover:text-emerald-300',
    },
    {
      id: 'open-terminal',
      label: 'Open Terminal',
      icon: <Terminal className="w-3.5 h-3.5 text-indigo-400" />,
      color: 'hover:border-indigo-500 hover:text-indigo-300',
    },
    {
      id: 'launch-agent',
      label: 'Launch AI Agent',
      icon: <Bot className="w-3.5 h-3.5 text-amber-400" />,
      color: 'hover:border-amber-500 hover:text-amber-300',
    },
    {
      id: 'voice-command',
      label: 'Voice Command',
      icon: <Mic className="w-3.5 h-3.5 text-rose-400" />,
      color: 'hover:border-rose-500 hover:text-rose-300',
    },
    {
      id: 'screenshot',
      label: 'Screenshot',
      icon: <Camera className="w-3.5 h-3.5 text-cyan-300" />,
      color: 'hover:border-cyan-400 hover:text-cyan-200',
    },
    {
      id: 'screen-recording',
      label: screenRecordingActive ? 'Rec Stop' : 'Screen Record',
      icon: <Video className={`w-3.5 h-3.5 ${screenRecordingActive ? 'text-rose-500 animate-ping' : 'text-purple-300'}`} />,
      color: screenRecordingActive ? 'border-rose-500 text-rose-400 bg-rose-950/80' : 'hover:border-purple-400 hover:text-purple-200',
    },
    {
      id: 'search-everything',
      label: 'Search (Ctrl+K)',
      icon: <Search className="w-3.5 h-3.5 text-amber-300" />,
      color: 'hover:border-amber-400 hover:text-amber-200',
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md overflow-x-auto no-scrollbar font-mono text-xs">
      <div className="px-2 text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 border-r border-slate-800 shrink-0">
        <Zap className="w-3 h-3 text-cyan-400" />
        <span className="hidden md:inline">Quick Actions</span>
      </div>

      <div className="flex items-center gap-1">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => triggerQuickAction(act.id)}
            className={`group relative px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${act.color}`}
          >
            {act.icon}
            <span className="hidden xl:inline">{act.label}</span>

            {/* Tooltip for small screens */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {act.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
