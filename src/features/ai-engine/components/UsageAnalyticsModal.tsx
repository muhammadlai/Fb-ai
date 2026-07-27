import React from 'react';
import { X, BarChart3, Zap, DollarSign, Cpu, AlertTriangle, Activity } from 'lucide-react';
import { SystemAnalytics } from '../types/ai';

interface UsageAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: SystemAnalytics;
}

export const UsageAnalyticsModal: React.FC<UsageAnalyticsModalProps> = ({
  isOpen,
  onClose,
  analytics,
}) => {
  if (!isOpen) return null;

  const modelUsageList = Object.values(analytics.usageByModel || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-100">Enterprise AI Token & Usage Analytics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Total Tokens</span>
              </div>
              <p className="text-lg font-bold text-slate-100 font-mono">
                {analytics.totalTokensProcessed.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Est. Total Cost</span>
              </div>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                ${analytics.totalCostUSD.toFixed(4)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total Messages</span>
              </div>
              <p className="text-lg font-bold text-slate-100 font-mono">
                {analytics.totalMessages}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Failover Events</span>
              </div>
              <p className="text-lg font-bold text-amber-400 font-mono">
                {analytics.failoverCount}
              </p>
            </div>
          </div>

          {/* Model Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Provider & Model Telemetry</span>
            </h4>

            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">Model</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3 text-right">Tokens</th>
                    <th className="p-3 text-right">Cost (USD)</th>
                    <th className="p-3 text-right">Avg Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {modelUsageList.map((item) => (
                    <tr key={item.modelId} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold text-slate-100">{item.modelId}</td>
                      <td className="p-3 uppercase text-slate-400">{item.provider}</td>
                      <td className="p-3 text-right">{item.totalTokens.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-400">${item.totalCostUSD.toFixed(4)}</td>
                      <td className="p-3 text-right text-cyan-400">{item.avgLatencyMs}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
