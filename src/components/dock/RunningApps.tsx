import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Code,
  Terminal,
  GitBranch,
  Mail,
  Video,
  Play,
  Sparkles,
  Bot,
  Pin,
  PinOff,
  Minimize2,
  Maximize2,
  X,
  ExternalLink,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useDockStore, DockApp, AppId } from '../../store/useDockStore';

interface ContextMenuState {
  appId: AppId;
  x: number;
  y: number;
}

export const RunningApps: React.FC = () => {
  const {
    apps,
    openApp,
    closeApp,
    minimizeApp,
    restoreApp,
    toggleAppPin,
    focusApp,
  } = useDockStore();

  const [hoveredApp, setHoveredApp] = useState<DockApp | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-purple-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'GitBranch':
        return <GitBranch className="w-4 h-4 text-amber-400" />;
      case 'Mail':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-indigo-400" />;
      case 'Play':
        return <Play className="w-4 h-4 text-amber-300" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />;
      case 'Bot':
        return <Bot className="w-4 h-4 text-indigo-300" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    setContextMenu({
      appId,
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.max(20, e.clientY - 120),
    });
  };

  const handleAppClick = (app: DockApp) => {
    if (!app.isRunning) {
      openApp(app.id);
    } else if (app.isMinimized) {
      restoreApp(app.id);
    } else if (app.isActive) {
      minimizeApp(app.id);
    } else {
      focusApp(app.id);
    }
  };

  const targetContextMenuApp = apps.find((a) => a.id === contextMenu?.appId);

  return (
    <div className="relative flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
      {apps.map((app) => {
        return (
          <div key={app.id} className="relative group">
            {/* App Dock Icon Button */}
            <button
              onClick={() => handleAppClick(app)}
              onContextMenu={(e) => handleContextMenu(e, app.id)}
              onMouseEnter={() => setHoveredApp(app)}
              onMouseLeave={() => setHoveredApp(null)}
              className={`relative p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                app.isActive
                  ? 'bg-purple-900/80 text-cyan-300 border border-purple-500/60 shadow-lg shadow-purple-950 scale-105'
                  : app.isRunning
                  ? 'bg-slate-900/90 text-slate-200 border border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/50 text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {getAppIcon(app.icon)}

              {/* Status Indicator Dot */}
              {app.isRunning && (
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                    app.isActive
                      ? 'bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse'
                      : app.isMinimized
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
              )}

              {/* Pinned Dot */}
              {app.isPinned && !app.isRunning && (
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-purple-400/60" />
              )}
            </button>

            {/* Hover Live Preview Popover */}
            <AnimatePresence>
              {hoveredApp?.id === app.id && !contextMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl z-50 pointer-events-none backdrop-blur-xl font-mono text-xs space-y-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      {getAppIcon(app.icon)}
                      <span className="font-bold text-slate-100">{app.name}</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        app.isRunning
                          ? app.isMinimized
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-950 text-slate-500'
                      }`}
                    >
                      {app.isRunning ? (app.isMinimized ? 'Minimized' : 'Running') : 'Closed'}
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-slate-300 leading-snug truncate">
                    {app.windowTitle}
                  </p>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                    <div className="text-cyan-300 font-sans italic truncate">
                      "{app.previewText}"
                    </div>
                    {app.isRunning && (
                      <div className="flex justify-between text-[9px] pt-1 border-t border-slate-800">
                        <span>RAM: {app.memoryUsageMb} MB</span>
                        <span>CPU: {app.cpuUsagePct}%</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Right Click Context Menu */}
      <AnimatePresence>
        {contextMenu && targetContextMenuApp && (
          <>
            {/* Backdrop click dismiss */}
            <div
              className="fixed inset-0 z-50 cursor-default"
              onClick={() => setContextMenu(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ left: contextMenu.x, top: contextMenu.y }}
              className="fixed z-50 w-48 p-1.5 bg-slate-900/95 border border-purple-500/40 rounded-xl shadow-2xl backdrop-blur-xl font-mono text-xs text-slate-200 space-y-0.5"
            >
              <div className="px-2 py-1 text-[10px] text-slate-400 border-b border-slate-800 font-bold uppercase flex items-center justify-between">
                <span>{targetContextMenuApp.name}</span>
                {targetContextMenuApp.isRunning ? (
                  <span className="text-emerald-400">Active</span>
                ) : (
                  <span className="text-slate-500">Offline</span>
                )}
              </div>

              {!targetContextMenuApp.isRunning && (
                <button
                  onClick={() => {
                    openApp(targetContextMenuApp.id);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-cyan-300 flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Launch Application</span>
                </button>
              )}

              {targetContextMenuApp.isRunning && (
                <>
                  <button
                    onClick={() => {
                      if (targetContextMenuApp.isMinimized) {
                        restoreApp(targetContextMenuApp.id);
                      } else {
                        focusApp(targetContextMenuApp.id);
                      }
                      setContextMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{targetContextMenuApp.isMinimized ? 'Restore Window' : 'Bring to Front'}</span>
                  </button>

                  {!targetContextMenuApp.isMinimized && (
                    <button
                      onClick={() => {
                        minimizeApp(targetContextMenuApp.id);
                        setContextMenu(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-amber-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Minimize Window</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      closeApp(targetContextMenuApp.id);
                      setContextMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/80 text-rose-300 flex items-center gap-2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 text-rose-400" />
                    <span>Close Application</span>
                  </button>
                </>
              )}

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={() => {
                  toggleAppPin(targetContextMenuApp.id);
                  setContextMenu(null);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2 cursor-pointer"
              >
                {targetContextMenuApp.isPinned ? (
                  <>
                    <PinOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unpin from Dock</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-3.5 h-3.5 text-purple-400" />
                    <span>Pin to Dock</span>
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
