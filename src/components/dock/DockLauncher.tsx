import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Home,
  LayoutDashboard,
  Palette,
  Bot,
  Workflow,
  Globe,
  Brain,
  Database,
  Terminal,
  FolderTree,
  Settings,
} from 'lucide-react';

interface LauncherItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export const DockLauncher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const launcherItems: LauncherItem[] = [
    { id: 'home', label: 'Home', path: '/dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'studio', label: 'Creator Studio', path: '/studio', icon: <Palette className="w-4 h-4 text-purple-400" /> },
    { id: 'agents', label: 'AI Agents Swarm', path: '/workspace', icon: <Bot className="w-4 h-4 text-cyan-400" /> },
    { id: 'automation', label: 'Automation Engine', path: '/workflows', icon: <Workflow className="w-4 h-4 text-indigo-400" /> },
    { id: 'browser', label: 'Playwright Browser', path: '/integrations', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
    { id: 'memory', label: 'Memory Vault', path: '/knowledge', icon: <Brain className="w-4 h-4 text-amber-400" /> },
    { id: 'knowledge', label: 'Knowledge Base', path: '/knowledge', icon: <Database className="w-4 h-4 text-rose-400" /> },
    { id: 'terminal', label: 'Telemetry & Terminal', path: '/analytics', icon: <Terminal className="w-4 h-4 text-cyan-300" /> },
    { id: 'files', label: 'File Manager', path: '/workspace', icon: <FolderTree className="w-4 h-4 text-slate-300" /> },
    { id: 'settings', label: 'System Settings', path: '/dashboard', icon: <Settings className="w-4 h-4 text-purple-300" /> },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
      {/* Nexus Enterprise OS Logo Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="group relative p-2 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 hover:scale-105 transition-all cursor-pointer mr-1"
        title="Nexus AI Creator OS"
      >
        <Sparkles className="w-4 h-4 animate-spin-slow" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          Nexus AI Creator OS
        </span>
      </button>

      {/* Launcher Items */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[320px] sm:max-w-none">
        {launcherItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`group relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'bg-purple-950/90 text-cyan-300 border border-purple-500/50 shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              {item.icon}

              {/* Tooltip Hover Label */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                {item.label}
              </span>

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
