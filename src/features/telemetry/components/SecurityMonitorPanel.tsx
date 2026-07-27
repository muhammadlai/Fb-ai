import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Flame,
  AlertTriangle,
  XCircle,
  Eye,
  CheckCircle2,
  Server,
  KeyRound,
  FileText,
} from 'lucide-react';
import { SecurityEvent, SecurityOverview } from '../types/telemetry';

interface Props {
  securityOverview: SecurityOverview;
  securityEvents: SecurityEvent[];
}

export const SecurityMonitorPanel: React.FC<Props> = ({
  securityOverview,
  securityEvents,
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Firewall */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              WAF Firewall
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Enforced
            </span>
          </div>
          <div className="text-xl font-black text-slate-100 font-mono tracking-tight">
            {securityOverview.blockedRequests24h} Blocked
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Last 24 Hours Mitigation</span>
        </div>

        {/* Failed Logins */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Failed Logins
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full">
              MFA Active
            </span>
          </div>
          <div className="text-xl font-black text-slate-100 font-mono tracking-tight">
            {securityOverview.failedLogins24h} Attempts
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Zero Account Breaches</span>
        </div>

        {/* Rate Limits */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              Rate Limits
            </span>
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 rounded-full">
              Token Bucket
            </span>
          </div>
          <div className="text-xl font-black text-slate-100 font-mono tracking-tight">
            {securityOverview.rateLimitsTriggered24h} Throttled
          </div>
          <span className="text-[10px] text-slate-400 font-mono">API Abuse Throttling</span>
        </div>

        {/* Secrets Vault */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              API Key Vault
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              KMS Sealed
            </span>
          </div>
          <div className="text-xl font-black text-slate-100 font-mono tracking-tight">
            {securityOverview.activeApiKeysCount} Keys Active
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Automated 30-Day Rotation</span>
        </div>
      </div>

      {/* Security Status Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Lock className="w-4 h-4" />
            Encryption Status
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {securityOverview.encryptionStatus}
          </p>
          <span className="text-[10px] text-emerald-400 font-bold">100% Data-in-Transit & Rest Sealed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Key className="w-4 h-4" />
            Secrets Manager
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {securityOverview.secretsVaultStatus}
          </p>
          <span className="text-[10px] text-purple-300 font-bold">Hardware Security Module Sync</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            Threat Detection Engine
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            Autonomous heuristic parser active on all incoming Playwright & REST payloads.
          </p>
          <span className="text-[10px] text-emerald-400 font-bold">0 Vulnerability Vectors Detected</span>
        </div>
      </div>

      {/* Live Security Threat Events Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Realtime Threat & Mitigation Event Log
          </h3>
          <span className="text-xs text-slate-400 font-normal">Active Anomaly Inspection</span>
        </div>

        <div className="space-y-2">
          {securityEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase">
                    {evt.type}
                  </span>
                  <span className="text-slate-400">Source IP:</span>
                  <span className="text-cyan-300 font-bold">{evt.sourceIp}</span>
                </div>
                <p className="text-xs font-sans text-slate-200">{evt.description}</p>
              </div>

              <div className="flex items-center gap-3 text-xs shrink-0">
                <span className="text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  {evt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
