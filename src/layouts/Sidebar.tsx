import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Zap,
  Code2,
  Workflow,
  Database,
  Layers,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { NavigationItem } from '../types/ui';

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      title: 'Command Center',
      path: '/dashboard',
      iconName: 'LayoutDashboard',
      badge: 'v2 Core',
    },
    {
      id: 'ai-studio',
      title: 'Agent Studio',
      path: '/studio',
      iconName: 'Bot',
      isPhaseLocked: false,
      badge: 'Phase 2 Live',
    },
    {
      id: 'creator-os',
      title: 'Creator Workspace',
      path: '/workspace',
      iconName: 'Zap',
      isPhaseLocked: false,
      badge: 'Phase 3 Live',
    },
    {
      id: 'workflows',
      title: 'Automation Pipelines',
      path: '/workflows',
      iconName: 'Workflow',
      isPhaseLocked: false,
      badge: 'Phase 4 Live',
    },
    {
      id: 'data-lake',
      title: 'Knowledge Vault',
      path: '/knowledge',
      iconName: 'Database',
      isPhaseLocked: false,
      badge: 'Phase 5 Live',
    },
    {
      id: 'integrations',
      title: 'Autonomous AI Agent Platform',
      path: '/integrations',
      iconName: 'Bot',
      isPhaseLocked: false,
      badge: 'Phase 6 Live',
    },
    {
      id: 'security',
      title: 'Enterprise RBAC & Secrets',
      path: '/security',
      iconName: 'ShieldCheck',
      isPhaseLocked: false,
      badge: 'Phase 7 Live',
    },
    {
      id: 'analytics',
      title: 'Telemetry & Ops',
      path: '/analytics',
      iconName: 'Activity',
      isPhaseLocked: false,
      badge: 'Phase 8 Live',
    },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-5 h-5 shrink-0" />;
      case 'Bot':
        return <Bot className="w-5 h-5 shrink-0" />;
      case 'Zap':
        return <Zap className="w-5 h-5 shrink-0" />;
      case 'Workflow':
        return <Workflow className="w-5 h-5 shrink-0" />;
      case 'Database':
        return <Database className="w-5 h-5 shrink-0" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 shrink-0" />;
      case 'Activity':
        return <Activity className="w-5 h-5 shrink-0" />;
      default:
        return <Layers className="w-5 h-5 shrink-0" />;
    }
  };

  return (
    <aside
      className={`relative z-30 transition-all duration-300 ease-in-out flex flex-col h-screen bg-[#0b0918]/90 backdrop-blur-2xl border-r border-purple-500/20 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-purple-900/30">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 blur-sm opacity-70" />
            <div className="relative w-11 h-11 bg-slate-950 border border-cyan-400/50 rounded-xl flex items-center justify-center text-cyan-400 shadow-md">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-extrabold tracking-tight text-slate-100 flex items-center gap-1.5">
                NEXUS <span className="text-cyan-400 text-xs font-mono font-semibold">OS v2</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400/80 tracking-widest uppercase truncate">
                Enterprise AI OS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer hidden md:flex"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5">
        <div className={`px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-purple-400/60 ${sidebarCollapsed ? 'sr-only' : 'block'}`}>
          Core Systems
        </div>

        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isPhaseLocked) {
            return (
              <div
                key={item.id}
                className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-slate-500 cursor-not-allowed opacity-60 border border-transparent ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title={`${item.title} (${item.badge})`}
              >
                {renderIcon(item.iconName)}
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-xs font-medium truncate">{item.title}</span>
                    <span className="text-[10px] font-mono bg-slate-900 border border-purple-900/50 text-purple-400/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all ${
                sidebarCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900/60 to-cyan-950/40 text-cyan-300 font-semibold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-purple-500/20 border border-transparent'
              }`}
            >
              {renderIcon(item.iconName)}
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="text-xs font-medium truncate">{item.title}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Status & User Quick Card */}
      <div className="p-3 border-t border-purple-900/30 bg-slate-950/60">
        {!sidebarCollapsed ? (
          <div className="glass-panel p-3 rounded-xl border border-purple-500/20 flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name}
                className="w-9 h-9 rounded-lg object-cover border border-cyan-400/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] font-mono text-purple-300/70 truncate">{user?.tier}</p>
            </div>

            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          </div>
        )}
      </div>
    </aside>
  );
}
