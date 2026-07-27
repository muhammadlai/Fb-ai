import React, { useState } from 'react';
import {
  Layers,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart2,
  Cpu,
  Sparkles,
  Bot,
} from 'lucide-react';
import { TokenModelAnalytics, ProviderName } from '../types/telemetry';

interface Props {
  tokenAnalytics: TokenModelAnalytics[];
}

export const TokenAnalyticsPanel: React.FC<Props> = ({ tokenAnalytics }) => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderName | 'all'>('all');

  const filtered = tokenAnalytics.filter(
    (t) => selectedProvider === 'all' || t.provider === selectedProvider
  );

  const totalPromptTokens = filtered.reduce((acc, curr) => acc + curr.promptTokens, 0);
  const totalCompletionTokens = filtered.reduce((acc, curr) => acc + curr.completionTokens, 0);
  const grandTotalTokens = filtered.reduce((acc, curr) => acc + curr.totalTokens, 0);
  const grandTotalCost = filtered.reduce((acc, curr) => acc + curr.costUSD, 0);

  return (
    <div className="space-y-6">
      {/* Top FinOps Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            Total Prompt Tokens
          </span>
          <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
            {(totalPromptTokens / 1000000).toFixed(2)} M
          </div>
          <span className="text-[10px] text-cyan-300 font-mono">Input Context Load</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Total Completion Tokens
          </span>
          <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
            {(totalCompletionTokens / 1000000).toFixed(2)} M
          </div>
          <span className="text-[10px] text-purple-300 font-mono">Generated Output Load</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            Grand Total Tokens
          </span>
          <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
            {(grandTotalTokens / 1000000).toFixed(2)} M
          </div>
          <span className="text-[10px] text-indigo-300 font-mono">Combined Model Volume</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-slate-900/80 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Estimated Cost
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
            ${grandTotalCost.toFixed(2)} USD
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Optimized API Billing</span>
        </div>
      </div>

      {/* Provider Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <span className="text-slate-400 px-2 flex items-center gap-1">
          <Bot className="w-4 h-4 text-cyan-400" /> Model Provider:
        </span>
        {(['all', 'Gemini', 'OpenAI', 'Claude', 'DeepSeek', 'OpenRouter', 'Ollama'] as const).map((prov) => (
          <button
            key={prov}
            onClick={() => setSelectedProvider(prov)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              selectedProvider === prov
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {prov}
          </button>
        ))}
      </div>

      {/* Detailed Provider Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const promptPct = ((item.promptTokens / item.totalTokens) * 100).toFixed(0);
          return (
            <div
              key={item.modelId}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{item.modelId}</h4>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase">{item.provider}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>${item.costUSD.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Distribution */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Prompt: {promptPct}%</span>
                  <span>Completion: {100 - +promptPct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
                  <div className="bg-cyan-500 h-full" style={{ width: `${promptPct}%` }} />
                  <div className="bg-purple-500 h-full" style={{ width: `${100 - +promptPct}%` }} />
                </div>
              </div>

              {/* Token Counts Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Prompt Tokens</span>
                  <span className="text-cyan-300 font-bold">{(item.promptTokens / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Completion Tokens</span>
                  <span className="text-purple-300 font-bold">{(item.completionTokens / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Daily Usage</span>
                  <span className="text-emerald-400 font-bold">{(item.dailyUsage / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Monthly Usage</span>
                  <span className="text-indigo-300 font-bold">{(item.monthlyUsage / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Avg / Req: {item.avgUsagePerReq} tokens</span>
                <span className="text-slate-300 font-semibold">${(item.costUSD / (item.totalTokens / 1000000)).toFixed(2)} / MTok</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
