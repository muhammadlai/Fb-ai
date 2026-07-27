import React from 'react';
import {
  Brain,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Gauge,
  Sparkles,
  Award,
  Layers,
  Activity,
} from 'lucide-react';
import { AIPerformanceMetric } from '../types/telemetry';

interface Props {
  aiPerformance: AIPerformanceMetric[];
}

export const AIPerformancePanel: React.FC<Props> = ({ aiPerformance }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Intelligence & Performance Benchmark Suite
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Realtime evaluation of response speed, reasoning depth, hallucination mitigation rates, and generation throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Avg Latency (P95)</span>
            <span className="text-sm font-bold text-cyan-400">385 ms</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Overall Success SLA</span>
            <span className="text-sm font-bold text-emerald-400">99.85%</span>
          </div>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiPerformance.map((item) => (
          <div
            key={item.modelName}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{item.modelName}</h4>
                  <span className="text-[10px] text-purple-400 font-mono uppercase">{item.provider}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                  {item.tokensPerSec} t/s
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                  {item.successRatePct}% Success
                </span>
              </div>
            </div>

            {/* Metric Meters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Latency (P95)
                </span>
                <div className="text-base font-bold text-slate-100">{item.latencyP95Ms} ms</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Award className="w-3 h-3 text-purple-400" /> Quality Score
                </span>
                <div className="text-base font-bold text-purple-300">{item.qualityScore} / 100</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3 text-emerald-400" /> Hallucination
                </span>
                <div className="text-base font-bold text-emerald-400">{item.hallucinationScore}%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Brain className="w-3 h-3 text-indigo-400" /> Reasoning Depth
                </span>
                <div className="text-base font-bold text-indigo-300">{item.reasoningDepthScore} / 100</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-400" /> Avg Length
                </span>
                <div className="text-base font-bold text-slate-100">{item.avgResponseLength} w</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" /> Completion Time
                </span>
                <div className="text-base font-bold text-emerald-300">{item.avgCompletionTimeSec} s</div>
              </div>
            </div>

            {/* Quality Progress Bar */}
            <div className="space-y-1 font-mono text-xs pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Reasoning Depth Score</span>
                <span className="text-purple-300 font-bold">{item.reasoningDepthScore}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${item.reasoningDepthScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
