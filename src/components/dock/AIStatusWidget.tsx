import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Zap,
  Activity,
  HardDrive,
  Bot,
  Gauge,
  X,
  Sparkles,
  Server,
} from 'lucide-react';
import { useDockStore } from '../../store/useDockStore';

export const AIStatusWidget: React.FC = () => {
  const { systemMetrics, activeDockDrawer, setActiveDockDrawer } = useDockStore();

  if (activeDockDrawer !== 'systemMonitor') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        className="absolute bottom-16 right-28 w-80 max-w-[calc(100vw-2rem)] bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl p-5 space-y-4 z-50 font-mono text-xs text-slate-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">System Telemetry & Hardware</h3>
              <p className="text-[10px] text-slate-400">Cloud Run Sandboxed Container Node</p>
            </div>
          </div>

          <button
            onClick={() => setActiveDockDrawer(null)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hardware Load Gauges */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> CPU Load
              </span>
              <span className="text-cyan-300 font-bold">{systemMetrics.cpuUsage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" /> GPU Load
              </span>
              <span className="text-purple-300 font-bold">{systemMetrics.gpuUsage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-purple-400 transition-all duration-300"
                style={{ width: `${systemMetrics.gpuUsage}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" /> RAM Load
              </span>
              <span className="text-emerald-300 font-bold">{systemMetrics.ramUsage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${systemMetrics.ramUsage}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-amber-400" /> Disk Volume
              </span>
              <span className="text-amber-300 font-bold">{systemMetrics.diskUsage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${systemMetrics.diskUsage}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Model Architecture Info */}
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {systemMetrics.activeModel}
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
              Latency: 110ms
            </span>
          </div>

          <p className="text-[11px] font-sans text-slate-300 leading-snug">
            Orchestrating {systemMetrics.activeAgentsCount} autonomous worker agents across multi-region edge instances.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
