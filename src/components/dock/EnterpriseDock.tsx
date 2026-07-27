import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DockLauncher } from './DockLauncher';
import { RunningApps } from './RunningApps';
import { SystemMonitor } from './SystemMonitor';
import { QuickActions } from './QuickActions';
import { DockAvatar } from './DockAvatar';
import { NotificationCenter } from './NotificationCenter';
import { RunningProcessesModal } from './RunningProcessesModal';
import { AIStatusWidget } from './AIStatusWidget';
import { GlobalSearch } from './GlobalSearch';
import { EnterpriseVoiceAssistant } from '../voice/EnterpriseVoiceAssistant';
import { ChevronUp, ChevronDown, Sparkles, Mic } from 'lucide-react';
import { useDockStore } from '../../store/useDockStore';

export const EnterpriseDock: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActionsBar, setShowQuickActionsBar] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const { screenshotOverlayActive } = useDockStore();

  return (
    <>
      {/* Voice Assistant Speech Modal */}
      <EnterpriseVoiceAssistant isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Screenshot Overlay Visual Flash Simulator */}
      <AnimatePresence>
        {screenshotOverlayActive && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Global Search Modal Overlay */}
      <GlobalSearch />

      {/* Main Enterprise Bottom Dock */}
      <div className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none flex flex-col items-center gap-2">
        {/* Drawers Popovers Container */}
        <div className="relative w-full max-w-7xl pointer-events-auto">
          <NotificationCenter />
          <RunningProcessesModal />
          <AIStatusWidget />
        </div>

        {/* Quick Actions Collapsible Bar */}
        <AnimatePresence>
          {showQuickActionsBar && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto max-w-7xl w-full flex justify-center"
            >
              <QuickActions />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Dock Bar Container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isMinimized ? 40 : 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="pointer-events-auto relative max-w-7xl w-full bg-slate-950/90 border border-purple-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl p-2 flex items-center justify-between gap-3 cyber-border-glow font-mono text-xs"
        >
          {/* Left Section: Dock Launcher */}
          <div className="flex items-center gap-2 shrink-0">
            <DockLauncher />
          </div>

          {/* Center Section: Running Applications */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <RunningApps />
          </div>

          {/* Right Section: System Telemetry, Voice & Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Voice Assistant Trigger */}
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Activate Voice AI Assistant (English/Urdu)"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden lg:inline text-[10px] font-bold">Voice AI</span>
            </button>

            {/* Quick Actions Toggle Button */}
            <button
              onClick={() => setShowQuickActionsBar(!showQuickActionsBar)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                showQuickActionsBar
                  ? 'bg-purple-950 border-purple-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle AI Quick Actions Bar"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <DockAvatar />
            <SystemMonitor />

            {/* Minimize Dock Toggle Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
              title={isMinimized ? 'Expand Dock' : 'Minimize Dock'}
            >
              {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};
