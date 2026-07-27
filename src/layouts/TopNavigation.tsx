import { useState, FormEvent } from 'react';
import {
  Search,
  Bell,
  Cpu,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Zap,
  Activity,
  Check,
  Command,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { ThemeToggle } from '../components/common/ThemeToggle';

export function TopNavigation() {
  const { user, logout } = useAuthStore();
  const { selectedModel, availableModels, setSelectedModel, systemHealth } = useUIStore();
  const toast = useToastStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Gemini 2.5 Flash Engine Synchronized',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Phase 1 Foundations Deployed Successfully',
      time: '12 mins ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Security Compliance Check Passed',
      time: '1 hour ago',
      unread: false,
    },
  ];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.cyber('Command Input Processing', `Executing query: "${searchQuery}"`);
    setSearchQuery('');
  };

  return (
    <header className="h-20 border-b border-purple-500/20 bg-[#080711]/80 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global AI Command Search */}
      <div className="flex-1 max-w-md mr-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI agents, workflows, or execute commands..."
            className="w-full pl-10 pr-12 py-2 rounded-xl glass-input text-xs placeholder:text-slate-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-900/90 border border-purple-900/40 rounded text-[10px] font-mono text-purple-300">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </form>
      </div>

      {/* Right Navigation Controls */}
      <div className="flex items-center gap-3">
        {/* Active AI Model Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs border border-purple-500/30 hover:border-cyan-400/50 transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">{selectedModel.name}</span>
            <span className="text-[10px] font-mono text-purple-400/80 bg-purple-950/60 px-1.5 py-0.5 rounded">
              {selectedModel.latencyMs}ms
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-2 z-50 border border-purple-500/30 shadow-2xl backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                Active Inference Engine
              </div>
              <div className="space-y-1 mt-1">
                {availableModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m);
                      setModelDropdownOpen(false);
                      toast.cyber('AI Engine Switched', `Active model: ${m.name}`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedModel.id === m.id
                        ? 'bg-purple-950/80 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-100">{m.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{m.provider} • {m.version}</p>
                    </div>
                    {selectedModel.id === m.id && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>CPU: {systemHealth.cpuLoad}%</span>
        </div>

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-3 z-50 border border-purple-500/30 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
                <span className="text-xs font-bold text-slate-200">System Activity</span>
                <span className="text-[10px] font-mono text-cyan-400">3 New Alerts</span>
              </div>
              <div className="space-y-2 mt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/30 hover:border-purple-500/30 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-200">{n.title}</p>
                    <span className="text-[10px] font-mono text-purple-400/80">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button & Menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl glass-panel border border-purple-500/30 hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-3 z-50 border border-purple-500/30 shadow-2xl backdrop-blur-2xl">
              <div className="pb-3 border-b border-purple-900/30">
                <p className="text-xs font-bold text-slate-100">{user?.name}</p>
                <p className="text-[10px] font-mono text-purple-400">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                  <Shield className="w-2.5 h-2.5" />
                  {user?.role.toUpperCase()}
                </div>
              </div>

              <div className="py-2 space-y-1">
                <div className="flex items-center justify-between text-xs px-2 py-1.5 text-slate-300">
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> AI Credits
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">{user?.credits.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-900/30">
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                    toast.info('Session Terminated', 'You have been logged out.');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Terminate Session (Logout)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
