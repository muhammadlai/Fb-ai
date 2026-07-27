import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Pause,
  Play,
  X,
  Plus,
  Workflow,
  Bot,
  Database,
  Globe,
  Download,
  Upload,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useDockStore, RunningProcess } from '../../store/useDockStore';

export const RunningProcessesModal: React.FC = () => {
  const {
    processes,
    activeDockDrawer,
    setActiveDockDrawer,
    togglePauseProcess,
    cancelProcess,
    addProcess,
  } = useDockStore();

  if (activeDockDrawer !== 'processes') return null;

  const getTypeIcon = (type: RunningProcess['type']) => {
    switch (type) {
      case 'Browser Automation':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'AI Agent':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'Vector Database':
      case 'Memory Indexing':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'Download':
        return <Download className="w-4 h-4 text-amber-400" />;
      case 'Upload':
        return <Upload className="w-4 h-4 text-rose-400" />;
      case 'API Call':
        return <Zap className="w-4 h-4 text-cyan-300" />;
      default:
        return <Workflow className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleSpawnSyntheticProcess = () => {
    addProcess({
      name: 'Dynamic Swarm Agent Task',
      type: 'AI Agent',
      status: 'running',
      progress: 15,
      details: 'Generating real-time code components for active canvas',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        className="absolute bottom-16 right-20 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl p-5 space-y-4 z-50 font-mono text-xs text-slate-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Active Running Processes</h3>
              <p className="text-[10px] text-slate-400">
                {processes.filter((p) => p.status === 'running').length} Active Async Workers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpawnSyntheticProcess}
              className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-900 cursor-pointer flex items-center gap-1 text-[10px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Spawn Task</span>
            </button>

            <button
              onClick={() => setActiveDockDrawer(null)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Process Cards List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {processes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 italic">No running processes.</div>
          ) : (
            processes.map((proc) => (
              <div
                key={proc.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {getTypeIcon(proc.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-xs">{proc.name}</h4>
                      <span className="text-[9px] text-slate-400 uppercase">{proc.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        proc.status === 'running'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse'
                          : proc.status === 'paused'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : proc.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {proc.status}
                    </span>

                    {proc.status !== 'completed' && (
                      <button
                        onClick={() => togglePauseProcess(proc.id)}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
                        title={proc.status === 'paused' ? 'Resume' : 'Pause'}
                      >
                        {proc.status === 'paused' ? (
                          <Play className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Pause className="w-3 h-3 text-amber-400" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => cancelProcess(proc.id)}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="Cancel Worker"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-slate-300 leading-snug">
                  {proc.details}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Started: {proc.startTime}</span>
                    <span className="text-cyan-300 font-bold">{proc.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${proc.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
