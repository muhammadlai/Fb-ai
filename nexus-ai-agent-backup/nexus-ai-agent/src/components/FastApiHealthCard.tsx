import React from 'react';
import { Activity, CheckCircle2, Server, Workflow, ShieldCheck, Cpu } from 'lucide-react';
import { SystemHealth, N8nStatus } from '../types';

interface FastApiHealthCardProps {
  health: SystemHealth | null;
  n8nStatus: N8nStatus | null;
  loading: boolean;
  onRefresh: () => void;
}

export const FastApiHealthCard: React.FC<FastApiHealthCardProps> = ({
  health,
  n8nStatus,
  loading,
  onRefresh,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* FastAPI Backend Status Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">FastAPI Backend</h3>
              <p className="text-xs text-slate-400">Python 3.11 • Uvicorn</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {health?.status || 'Online'}
          </span>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Root Endpoint (/)</span>
            <span className="font-mono text-slate-200">200 OK</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Swagger Docs (/docs)</span>
            <span className="font-mono text-emerald-400">Active</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Health Status (/health)</span>
            <span className="font-mono text-emerald-400">{health?.services?.fastapi || 'operational'}</span>
          </div>
        </div>
      </div>

      {/* n8n Webhook Service Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">n8n Automation Engine</h3>
              <p className="text-xs text-slate-400">Webhook Integration Hub</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {n8nStatus?.n8n_integration || 'Active'}
          </span>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Target Endpoint</span>
            <span className="font-mono text-indigo-300 truncate max-w-[170px]" title={n8nStatus?.webhook_url}>
              /webhook/nexus-agent
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Security Signature</span>
            <span className="font-mono text-indigo-400">HMAC-SHA256</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Callback Route</span>
            <span className="font-mono text-slate-200">/api/v1/webhooks/n8n/callback</span>
          </div>
        </div>
      </div>

      {/* System Infrastructure Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Ubuntu VPS Environment</h3>
              <p className="text-xs text-slate-400">Nexus Core Architecture</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh System Health"
          >
            <Activity className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Deployment Architecture</span>
            <span className="font-mono text-slate-200">FastAPI + n8n + Docker</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Project Completion</span>
            <span className="font-mono text-cyan-400 font-bold">55% (Phase 1 Ready)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Async Webhook Dispatch</span>
            <span className="font-mono text-emerald-400">Enabled (3x Retries)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
