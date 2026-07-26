import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Plus,
  Sparkles,
  Settings,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Code2,
  Globe,
  Workflow
} from 'lucide-react';
import { AI_AGENTS } from '../data/mockData';
import { AIAgent } from '../types';

export const AgentsPanel: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(agents[0]);

  const toggleAgentStatus = (id: string) => {
    setAgents(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: a.status === 'executing' || a.status === 'active' ? 'idle' : 'active' }
          : a
      )
    );
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            Autonomous AI Agents Fleet
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deploy self-directing specialized agents for full-stack coding, web research, data auditing, and n8n automations.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          <span>Deploy New Agent</span>
        </button>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;
          const isActive = agent.status === 'active' || agent.status === 'executing';

          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-5 rounded-2xl bg-slate-900/80 border backdrop-blur-xl shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-500/20 bg-slate-900'
                  : 'border-white/10 hover:border-purple-500/30'
              }`}
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl shadow-md">
                    {agent.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100">{agent.name}</div>
                    <div className="text-[11px] text-purple-400 font-mono">{agent.role}</div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAgentStatus(agent.id);
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                  title={isActive ? 'Pause Agent' : 'Activate Agent'}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>

              {/* Status & Tasks Executed */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                    }`}
                  />
                  {agent.status.toUpperCase()}
                </span>
                <span className="text-purple-300 font-bold">{agent.tasks_completed} Tasks Run</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Inspector */}
      {selectedAgent && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedAgent.avatar}</span>
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedAgent.name} - Detailed System Spec</h3>
                <p className="text-xs text-purple-400 font-mono">{selectedAgent.role}</p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Model: {selectedAgent.model}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Agent System Prompt Directive</label>
            <div className="p-3 rounded-xl bg-slate-950 text-xs font-mono text-slate-200 border border-white/10">
              {selectedAgent.system_prompt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
