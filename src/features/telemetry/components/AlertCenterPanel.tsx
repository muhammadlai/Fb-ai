import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Siren,
  VolumeX,
  Archive,
  X,
  Filter,
  Plus,
} from 'lucide-react';
import { SystemAlert, AlertSeverity, AlertState } from '../types/telemetry';

interface Props {
  alerts: SystemAlert[];
  onDismissAlert: (id: string) => void;
  onMuteAlert: (id: string) => void;
  onArchiveAlert: (id: string) => void;
  onAddAlert: (alert: Omit<SystemAlert, 'id' | 'timestamp' | 'status'>) => void;
}

export const AlertCenterPanel: React.FC<Props> = ({
  alerts,
  onDismissAlert,
  onMuteAlert,
  onArchiveAlert,
  onAddAlert,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [selectedState, setSelectedState] = useState<AlertState | 'all'>('active');

  const filtered = alerts.filter((a) => {
    const matchesSev = selectedSeverity === 'all' || a.severity === selectedSeverity;
    const matchesState = selectedState === 'all' || a.status === selectedState;
    return matchesSev && matchesState;
  });

  const getAlertBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'emergency':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 text-[10px] font-mono font-black uppercase animate-pulse">
            <Siren className="w-3.5 h-3.5 text-rose-400" /> EMERGENCY
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> WARNING
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SUCCESS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">
            <Info className="w-3.5 h-3.5 text-cyan-400" /> INFO
          </span>
        );
    }
  };

  const triggerTestAlert = () => {
    onAddAlert({
      title: 'Simulated SLA Incident Notice',
      message: 'Synthetic test alert triggered for Playwright browser pool scaling validation.',
      severity: 'warning',
      source: 'Telemetry Operations Center',
    });
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100">Enterprise Incident & Alert Center</h3>
          </div>

          <button
            onClick={triggerTestAlert}
            className="px-3.5 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-900 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Trigger Synthetic Alert</span>
          </button>
        </div>

        {/* Severity & State Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Severity:
            </span>
            {(['all', 'success', 'info', 'warning', 'critical', 'emergency'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400">State:</span>
            {(['active', 'muted', 'archived', 'all'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  selectedState === st
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3 font-mono text-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 italic">
            No alerts found matching filter status. All systems clean.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                item.severity === 'emergency' || item.severity === 'critical'
                  ? 'bg-slate-900/90 border-rose-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getAlertBadge(item.severity)}
                  <h4 className="text-sm font-bold text-slate-100 font-sans">{item.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.source}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <p className="text-slate-300 font-sans text-xs leading-relaxed">{item.message}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Status: <span className="text-cyan-400">{item.status}</span>
                </span>

                <div className="flex items-center gap-2">
                  {item.status === 'active' && (
                    <button
                      onClick={() => onMuteAlert(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 cursor-pointer flex items-center gap-1"
                    >
                      <VolumeX className="w-3 h-3" />
                      <span>Mute</span>
                    </button>
                  )}

                  <button
                    onClick={() => onArchiveAlert(item.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 cursor-pointer flex items-center gap-1"
                  >
                    <Archive className="w-3 h-3" />
                    <span>Archive</span>
                  </button>

                  <button
                    onClick={() => onDismissAlert(item.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
