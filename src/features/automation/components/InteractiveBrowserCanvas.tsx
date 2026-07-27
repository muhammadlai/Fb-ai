import React from 'react';
import {
  Globe,
  RefreshCw,
  Lock,
  ChevronLeft,
  ChevronRight,
  Camera,
  Code,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';

export const InteractiveBrowserCanvas: React.FC = () => {
  const {
    currentBrowserUrl,
    isExecuting,
    currentStepIndex,
    tasks,
    activeTaskId,
    executionLogs,
    profiles,
    activeProfileId,
  } = useAutomationStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const currentStep = activeTask?.steps[currentStepIndex];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[580px]">
      {/* Top Browser Toolbar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-500">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-1 ml-2 text-slate-400">
            <button className="p-1 rounded hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-slate-800 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className={`p-1 rounded hover:bg-slate-800 transition-colors ${isExecuting ? 'animate-spin text-cyan-400' : ''}`}>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex-1 max-w-xl mx-auto px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{currentBrowserUrl}</span>
        </div>

        {/* Active Profile Badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-400 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {activeProfile?.name || 'Playwright Chromium'}
          </span>
        </div>
      </div>

      {/* Main Playwright DOM Simulation Stage & Canvas */}
      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col md:flex-row">
        {/* Interactive Page Viewport Canvas */}
        <div className="flex-1 p-6 relative flex flex-col justify-between overflow-y-auto">
          {/* Simulated Web Page Content */}
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">
                  Target Portal: {currentBrowserUrl}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  DOM Interactive
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-100">Enterprise AI Hardware & Cloud Matrix</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated Playwright session attached. Simulating browser DOM interactions, form submission, and PDF report compilation.
              </p>

              {/* Simulated Search Form */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Search Input Target (#search-input)</label>
                <input
                  type="text"
                  readOnly
                  value={currentStep?.action === 'fill_form' ? currentStep.value : 'Enterprise AI GPU Server'}
                  className={`w-full px-3 py-1.5 rounded-lg bg-slate-900 border text-xs text-slate-100 font-mono transition-all ${
                    currentStep?.action === 'fill_form' ? 'border-cyan-400 ring-2 ring-cyan-500/20' : 'border-slate-800'
                  }`}
                />
              </div>

              {/* Simulated Data Grid */}
              <div className="rounded-lg border border-slate-800 overflow-hidden text-xs">
                <div className="bg-slate-950 p-2 border-b border-slate-800 font-mono text-slate-400 flex justify-between">
                  <span>Product Model</span>
                  <span>Extracted Price</span>
                </div>
                <div className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  <div className="p-2 flex justify-between bg-slate-900/40">
                    <span>H100 NVLink 80GB</span>
                    <span className="text-emerald-400">$28,500.00</span>
                  </div>
                  <div className="p-2 flex justify-between bg-slate-900/40">
                    <span>A100 Tensor Core 80GB</span>
                    <span className="text-emerald-400">$12,400.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Step Highlight Overlay */}
          {currentStep && (
            <div className="mt-4 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-purple-300">
                  Step {currentStepIndex + 1}/{activeTask?.steps.length}: <strong>{currentStep.description}</strong>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase text-[10px]">
                {currentStep.action}
              </span>
            </div>
          )}
        </div>

        {/* Live Execution Terminal Sidebar */}
        <div className="w-full md:w-80 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col font-mono text-xs">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">Playwright Log Stream</span>
            </div>
            <span className="text-[10px] text-emerald-400">LIVE</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-[300px] md:max-h-none scrollbar-thin">
            {executionLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2 rounded-lg text-[11px] leading-relaxed border ${
                  log.type === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : log.type === 'auth_prompt'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : log.type === 'warning'
                    ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] text-slate-500 mb-0.5">
                  <span>[{log.timestamp}]</span>
                  <span className="uppercase">{log.type}</span>
                </div>
                <p>{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
