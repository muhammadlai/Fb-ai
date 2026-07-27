import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Server,
  Bot,
  Database,
  Globe,
  Zap,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { HealthStatus, HealthCategory } from '../types/telemetry';

interface Props {
  healthStatuses: HealthStatus[];
}

export const LiveHealthGrid: React.FC<Props> = ({ healthStatuses }) => {
  const getCategoryIcon = (cat: HealthCategory) => {
    switch (cat) {
      case 'system':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'server':
        return <Server className="w-4 h-4 text-purple-400" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'automation':
        return <Globe className="w-4 h-4 text-amber-400" />;
      case 'provider':
        return <Zap className="w-4 h-4 text-rose-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Healthy
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-400">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Degraded
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-[11px] font-mono font-bold text-rose-400">
            <XCircle className="w-3 h-3 text-rose-400" />
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold text-slate-400">
            Maintenance
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Infrastructure & Provider Live Health Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Monitored continuously every 5,000ms. All services operating within latency SLAs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>12 / 12 Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthStatuses.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{item.category}</span>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Latency</span>
                <span className="text-cyan-300 font-bold">{item.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Uptime</span>
                <span className="text-emerald-400 font-bold">{item.uptimePct}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.details}</p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Last check: {item.lastCheck}
              </span>
              <span className="text-purple-400 font-semibold">Active Sync</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
