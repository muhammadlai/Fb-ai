import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Bot,
  Workflow,
  Globe,
  Brain,
  Trash2,
  CheckCheck,
  X,
  Filter,
  Info,
} from 'lucide-react';
import { useDockStore, DockNotification } from '../../store/useDockStore';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    activeDockDrawer,
    setActiveDockDrawer,
    markNotificationRead,
    clearAllNotifications,
    addNotification,
  } = useDockStore();

  const [selectedFilter, setSelectedFilter] = useState<
    | 'all'
    | 'unread'
    | 'workflow_complete'
    | 'browser_finished'
    | 'memory_updated'
    | 'ai_suggestion'
    | 'agent_message'
  >('all');

  if (activeDockDrawer !== 'notifications') return null;

  const filtered = notifications.filter((n) => {
    if (selectedFilter === 'unread') return !n.read;
    if (selectedFilter === 'all') return true;
    return n.type === selectedFilter;
  });

  const getNotificationIcon = (type: DockNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-cyan-400" />;
      case 'ai_suggestion':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'agent_message':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'workflow_complete':
        return <Workflow className="w-4 h-4 text-indigo-400" />;
      case 'browser_finished':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'memory_updated':
        return <Brain className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  const triggerTestNotification = () => {
    addNotification({
      title: 'Synthetic Notification Test',
      message: 'Nexus AI Creator OS system check verified all dock channels.',
      type: 'ai_suggestion',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        className="absolute bottom-16 right-4 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl p-5 space-y-4 z-50 font-mono text-xs text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Enterprise Notifications</h3>
              <p className="text-[10px] text-slate-400">
                {notifications.filter((n) => !n.read).length} Unread System Messages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearAllNotifications}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
              title="Clear All Notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveDockDrawer(null)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          {(
            [
              'all',
              'unread',
              'workflow_complete',
              'browser_finished',
              'memory_updated',
              'ai_suggestion',
              'agent_message',
            ] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-2.5 py-1 rounded-lg border font-bold uppercase transition-all shrink-0 cursor-pointer ${
                selectedFilter === f
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Notification Feed List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 italic">
              No notifications matching selected filter.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  item.read
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-950 border-purple-500/40 text-slate-100 shadow-md shadow-purple-950/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(item.type)}
                    <h4 className="font-bold text-xs">{item.title}</h4>
                  </div>
                  <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                </div>

                <p className="text-[11px] font-sans leading-relaxed text-slate-300">
                  {item.message}
                </p>

                <div className="flex items-center justify-between text-[9px] pt-1 text-slate-400 border-t border-slate-800/60">
                  <span className="uppercase font-mono text-purple-400">
                    Category: {item.type.replace('_', ' ')}
                  </span>
                  {!item.read && (
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <CheckCheck className="w-3 h-3" /> Mark Read
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
          <button
            onClick={triggerTestNotification}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            + Push Synthetic Notification
          </button>
          <span className="text-slate-400">Realtime Event Bus Online</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
