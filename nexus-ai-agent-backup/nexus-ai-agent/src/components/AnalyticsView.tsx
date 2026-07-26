import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Calendar
} from 'lucide-react';
import { ANALYTICS_DATA } from '../data/mockData';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Platform Performance Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Requests distribution, sub-second latency profiling, token consumption, and daily active users.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === r ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: API Requests Volume */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-slate-100">API Requests Over Time</span>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold">40,020 Total</span>
          </div>

          <div className="h-48 flex items-end gap-2 pt-6">
            {ANALYTICS_DATA.requests.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-900 via-purple-600 to-cyan-400 opacity-80 group-hover:opacity-100 transition-all relative"
                  style={{ height: `${(val / 9100) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-500/30 whitespace-nowrap z-10">
                    {val.toLocaleString()} reqs
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{ANALYTICS_DATA.timeLabels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Latency Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-slate-100">Avg Response Latency (ms)</span>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">84ms Avg</span>
          </div>

          <div className="h-48 flex items-end gap-2 pt-6">
            {ANALYTICS_DATA.latency.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-cyan-900 via-cyan-500 to-blue-400 opacity-80 group-hover:opacity-100 transition-all relative"
                  style={{ height: `${(val / 150) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-500/30 whitespace-nowrap z-10">
                    {val} ms
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{ANALYTICS_DATA.timeLabels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Token Usage */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-slate-100">LLM Token Consumption (Thousands)</span>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">16.6M Total</span>
          </div>

          <div className="h-48 flex items-end gap-2 pt-6">
            {ANALYTICS_DATA.tokenUsage.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-amber-900 via-amber-500 to-yellow-300 opacity-80 group-hover:opacity-100 transition-all relative"
                  style={{ height: `${(val / 4000) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 border border-amber-500/30 whitespace-nowrap z-10">
                    {val}k tokens
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{ANALYTICS_DATA.timeLabels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Daily Active Users */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-slate-100">Daily Active Users (DAU)</span>
            </div>
            <span className="text-xs font-mono text-emerald-300 font-bold">1,890 Peak DAU</span>
          </div>

          <div className="h-48 flex items-end gap-2 pt-6">
            {ANALYTICS_DATA.activeUsers.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-900 via-emerald-500 to-teal-300 opacity-80 group-hover:opacity-100 transition-all relative"
                  style={{ height: `${(val / 2000) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 border border-emerald-500/30 whitespace-nowrap z-10">
                    {val} users
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{ANALYTICS_DATA.timeLabels[idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
