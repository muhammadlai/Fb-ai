import React from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  Globe,
  Bot,
  Chrome,
  Database,
  Layers,
  DollarSign,
  TrendingUp,
  Radio,
  Server,
  Network,
  Users,
} from 'lucide-react';
import { LiveMetrics } from '../types/telemetry';

interface Props {
  metrics: LiveMetrics;
}

export const LiveSystemMetrics: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Top 4 Core Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Live CPU Usage
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                metrics.cpuUsage > 80
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {metrics.cpuUsage}%
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
                {metrics.cpuUsage.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">12 Cores vCPU</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>

            {/* Sparkline visualization */}
            <div className="flex items-end gap-1 h-8 pt-1">
              {metrics.historicalCpu.map((v, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-400 rounded-t transition-all"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              RAM Memory Usage
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
              {metrics.memoryUsage}%
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
                {metrics.memoryUsedGB} GB
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ {metrics.memoryTotalGB} GB</span>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </div>

            <div className="flex items-end gap-1 h-8 pt-1">
              {metrics.historicalMemory.map((v, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-purple-500/20 hover:bg-purple-400 rounded-t transition-all"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* GPU Usage */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              NVIDIA GPU Cluster
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              {metrics.gpuUsage}%
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
                {metrics.gpuMemoryUsedGB} GB
              </span>
              <span className="text-[10px] text-slate-400 font-mono">VRAM Active</span>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.gpuUsage}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Local Ollama</span>
              <span className="text-emerald-400 font-bold">2x H100 Node</span>
            </div>
          </div>
        </div>

        {/* Network Throughput */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-amber-400" />
              Network Bandwidth
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
              Live
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
                {(metrics.networkIngressMbps + metrics.networkEgressMbps).toFixed(0)} Mbps
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Combined</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Ingress</span>
                <span className="text-cyan-400 font-bold">{metrics.networkIngressMbps} MB/s</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Egress</span>
                <span className="text-amber-400 font-bold">{metrics.networkEgressMbps} MB/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: Active Workloads & Operational Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Running AI Agents */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Running AI Agents</span>
            <div className="text-xl font-black text-slate-100 font-mono">{metrics.activeAgents} Active</div>
            <span className="text-[10px] text-emerald-400 font-mono">100% Autonomous SLA</span>
          </div>
        </div>

        {/* Active Browser Sessions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Chrome className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Browser Sessions</span>
            <div className="text-xl font-black text-slate-100 font-mono">{metrics.activeBrowserSessions} Playwright</div>
            <span className="text-[10px] text-purple-300 font-mono">Stealth Proxy Attached</span>
          </div>
        </div>

        {/* API & LLM Requests */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">API Throughput</span>
            <div className="text-xl font-black text-slate-100 font-mono">{metrics.apiRequestsPerSec} req/sec</div>
            <span className="text-[10px] text-indigo-300 font-mono">{metrics.llmRequestsPerMin} LLM req/min</span>
          </div>
        </div>

        {/* Websockets & Queue */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Websocket Connections</span>
            <div className="text-xl font-black text-slate-100 font-mono">{metrics.websocketConnections} Live</div>
            <span className="text-[10px] text-emerald-300 font-mono">Queue Size: {metrics.queueSize} jobs</span>
          </div>
        </div>
      </div>

      {/* Grid 3: Storage, Token Consumption & FinOps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Disk & Storage */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              SSD NVMe Storage
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{metrics.diskUsage}% Used</span>
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {metrics.diskUsedGB} GB <span className="text-xs font-normal text-slate-400">/ {metrics.diskTotalGB} GB</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${metrics.diskUsage}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
            Encrypted vector database partition & ephemeral Playwright screenshot cache.
          </p>
        </div>

        {/* Token Consumption */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Token Consumption
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">Multi-Model</span>
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {(metrics.tokenConsumptionTotal / 1000000).toFixed(2)} M Tokens
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Daily Usage</span>
              <span className="text-purple-300 font-bold">{(metrics.dailyUsageTokens / 1000000).toFixed(2)}M</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Monthly Usage</span>
              <span className="text-indigo-300 font-bold">{(metrics.monthlyUsageTokens / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>

        {/* FinOps & Estimated Cost */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              FinOps Estimated Cost
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">MTD</span>
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            ${metrics.estimatedCostUSD.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">Worker Status:</span>
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {metrics.workerStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
