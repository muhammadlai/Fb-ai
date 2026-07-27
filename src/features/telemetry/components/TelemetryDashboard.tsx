import React, { useEffect, useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Terminal,
  Shield,
  Layers,
  Brain,
  ShieldAlert,
  Bell,
  RefreshCw,
  Radio,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { LiveSystemMetrics } from './LiveSystemMetrics';
import { LiveHealthGrid } from './LiveHealthGrid';
import { LogCenterPanel } from './LogCenterPanel';
import { AuditCenterPanel } from './AuditCenterPanel';
import { TokenAnalyticsPanel } from './TokenAnalyticsPanel';
import { AIPerformancePanel } from './AIPerformancePanel';
import { SecurityMonitorPanel } from './SecurityMonitorPanel';
import { AlertCenterPanel } from './AlertCenterPanel';

export const TelemetryDashboard: React.FC = () => {
  const {
    metrics,
    healthStatuses,
    logs,
    auditLogs,
    tokenAnalytics,
    aiPerformance,
    securityOverview,
    securityEvents,
    alerts,
    isLiveAutoRefresh,
    toggleLiveRefresh,
    tickLiveData,
    dismissAlert,
    muteAlert,
    archiveAlert,
    addSystemAlert,
    clearLogs,
  } = useTelemetryStore();

  const [activeTab, setActiveTab] = useState<
    'vitals' | 'health' | 'logs' | 'audit' | 'tokens' | 'performance' | 'security' | 'alerts'
  >('vitals');

  // Automatic live ticking interval
  useEffect(() => {
    if (!isLiveAutoRefresh) return;
    const interval = setInterval(() => {
      tickLiveData();
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveAutoRefresh, tickLiveData]);

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Top Header Banner & Live Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden bg-slate-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Phase 8 Deployed • Enterprise Telemetry & FinOps Online</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              Enterprise <span className="text-gradient-cyber">Telemetry & Operations Center</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Realtime telemetry monitoring, automated health matrix, audit trail compliance, multi-model token FinOps, AI performance benchmarking, and proactive security threat detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            {/* Live Toggle */}
            <button
              onClick={toggleLiveRefresh}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                isLiveAutoRefresh
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Radio className={`w-4 h-4 ${isLiveAutoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isLiveAutoRefresh ? 'Live Ticking (2s)' : 'Paused'}</span>
            </button>

            <button
              onClick={() => tickLiveData()}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 hover:border-cyan-500 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Probe Now</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'vitals'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Live Vitals & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'health'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Health Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'logs'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Log Center ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tokens'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Token FinOps</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'performance'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span>AI Benchmark</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'security'
                ? 'bg-rose-950 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Security Center</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 relative ${
              activeTab === 'alerts'
                ? 'bg-rose-950 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4 text-rose-400" />
            <span>Incident Alerts</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content Display */}
      {activeTab === 'vitals' && <LiveSystemMetrics metrics={metrics} />}
      {activeTab === 'health' && <LiveHealthGrid healthStatuses={healthStatuses} />}
      {activeTab === 'logs' && <LogCenterPanel logs={logs} onClearLogs={clearLogs} />}
      {activeTab === 'audit' && <AuditCenterPanel auditLogs={auditLogs} />}
      {activeTab === 'tokens' && <TokenAnalyticsPanel tokenAnalytics={tokenAnalytics} />}
      {activeTab === 'performance' && <AIPerformancePanel aiPerformance={aiPerformance} />}
      {activeTab === 'security' && (
        <SecurityMonitorPanel
          securityOverview={securityOverview}
          securityEvents={securityEvents}
        />
      )}
      {activeTab === 'alerts' && (
        <AlertCenterPanel
          alerts={alerts}
          onDismissAlert={dismissAlert}
          onMuteAlert={muteAlert}
          onArchiveAlert={archiveAlert}
          onAddAlert={addSystemAlert}
        />
      )}
    </div>
  );
};
