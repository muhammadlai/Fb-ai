import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Database,
  Cpu,
  Brain,
  Zap,
  Globe,
  Code2,
  Workflow,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Activity,
  CheckCircle2,
  Lock,
  Layers,
  Thermometer
} from 'lucide-react';
import { SystemSettings } from '../types';
import { AI_MODELS } from '../data/mockData';

interface RightAssistantPanelProps {
  settings: SystemSettings | null;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeModel: string;
  onSelectModel: (modelId: string) => void;
}

export const RightAssistantPanel: React.FC<RightAssistantPanelProps> = ({
  settings,
  onUpdateSettings,
  isCollapsed,
  onToggleCollapse,
  activeModel,
  onSelectModel,
}) => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'memory' | 'tools' | 'activity'>('parameters');

  const currentModelObj = AI_MODELS.find(m => m.id === activeModel) || AI_MODELS[1];

  const handleTemperatureChange = (val: number) => {
    if (settings) {
      onUpdateSettings({ ...settings, temperature: val });
    }
  };

  const handleTopPChange = (val: number) => {
    if (settings) {
      onUpdateSettings({ ...settings, top_p: val });
    }
  };

  const handleMemoryModeChange = (mode: 'short_term' | 'vector_rag' | 'full_history') => {
    if (settings) {
      onUpdateSettings({ ...settings, memory_mode: mode });
    }
  };

  return (
    <div
      className={`relative h-full bg-slate-950 border-l border-white/10 transition-all duration-300 flex flex-col shrink-0 z-10 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -left-3 top-5 z-20 p-1 rounded-full bg-slate-900 border border-purple-500/40 text-purple-400 hover:text-white shadow-lg transition-all"
        title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
      >
        {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {isCollapsed ? (
        <div className="flex-1 flex flex-col items-center py-6 gap-6 text-slate-500">
          <Sliders className="w-5 h-5 text-purple-400 cursor-pointer" onClick={onToggleCollapse} />
          <Brain className="w-5 h-5 text-cyan-400 cursor-pointer" onClick={onToggleCollapse} />
          <Zap className="w-5 h-5 text-amber-400 cursor-pointer" onClick={onToggleCollapse} />
          <Activity className="w-5 h-5 text-emerald-400 cursor-pointer" onClick={onToggleCollapse} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-100">AI Assistant Config</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Live Memory
              </span>
            </div>

            {/* Tab Navigation */}
            <div className="grid grid-cols-4 gap-1 mt-3 p-1 rounded-xl bg-slate-900 border border-white/5 text-[11px] font-medium">
              <button
                onClick={() => setActiveTab('parameters')}
                className={`py-1 rounded-lg transition-colors ${
                  activeTab === 'parameters' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Model
              </button>
              <button
                onClick={() => setActiveTab('memory')}
                className={`py-1 rounded-lg transition-colors ${
                  activeTab === 'memory' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Memory
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`py-1 rounded-lg transition-colors ${
                  activeTab === 'tools' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tools
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-1 rounded-lg transition-colors ${
                  activeTab === 'activity' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Status
              </button>
            </div>
          </div>

          {/* Panel Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
            {/* Tab 1: Model & Parameters */}
            {activeTab === 'parameters' && (
              <div className="space-y-4">
                {/* Active Model Selector */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span>Current Frontier Engine</span>
                    <span className="text-purple-400 font-mono text-[10px]">{currentModelObj.provider}</span>
                  </div>
                  <select
                    value={activeModel}
                    onChange={(e) => onSelectModel(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-2 border border-purple-500/30 focus:outline-none"
                  >
                    {AI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.speed})
                      </option>
                    ))}
                  </select>
                  <div className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    {currentModelObj.description}
                  </div>
                </div>

                {/* Temperature Slider */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      {settings?.temperature ?? 0.7}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings?.temperature ?? 0.7}
                    onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0.0 (Precise/Code)</span>
                    <span>1.0 (Creative)</span>
                  </div>
                </div>

                {/* Top P Slider */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Top P Nucleus
                    </span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {settings?.top_p ?? 0.9}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings?.top_p ?? 0.9}
                    onChange={(e) => handleTopPChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* Context Window Usage Gauge */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-semibold">Context Window Usage</span>
                    <span className="text-purple-300 font-mono">48.2k / 200k tokens</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full w-[24.1%]" />
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                    <span>Prompt: 12.4k</span>
                    <span>Memory: 35.8k</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Memory & System Instructions */}
            {activeTab === 'memory' && (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="font-semibold text-slate-200">Conversation Memory Retention</div>
                  <div className="space-y-1.5 pt-1">
                    {[
                      { id: 'vector_rag', label: 'Pinecone Vector RAG (Recommended)', desc: 'Infinite context retention via embeddings search.' },
                      { id: 'full_history', label: 'Full Conversation Thread', desc: 'Pass entire message history up to token limit.' },
                      { id: 'short_term', label: 'Short-Term Sliding Window', desc: 'Retain only last 10 back-and-forth messages.' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleMemoryModeChange(m.id as any)}
                        className={`w-full text-left p-2 rounded-xl border text-xs transition-all ${
                          (settings?.memory_mode || 'vector_rag') === m.id
                            ? 'bg-purple-900/30 border-purple-500/50 text-purple-200'
                            : 'border-white/5 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold">{m.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* System Prompt Instructions */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>System Persona Instruction</span>
                    <span className="text-[10px] text-purple-400 font-mono">Custom Override</span>
                  </div>
                  <textarea
                    value={settings?.system_prompt || ''}
                    onChange={(e) => {
                      if (settings) onUpdateSettings({ ...settings, system_prompt: e.target.value });
                    }}
                    rows={4}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-2 border border-white/10 focus:outline-none focus:border-purple-500/40 font-mono resize-none"
                    placeholder="Enter system prompt instructions for Nexus AI..."
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Connected Tools & APIs */}
            {activeTab === 'tools' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300">Active Agent Capabilities</div>
                {[
                  { name: 'Google Web Search Grounding', icon: Globe, enabled: true, color: 'text-cyan-400' },
                  { name: 'n8n Automation Webhooks', icon: Workflow, enabled: true, color: 'text-purple-400' },
                  { name: 'Pinecone Vector RAG Store', icon: Database, enabled: true, color: 'text-emerald-400' },
                  { name: 'FastAPI Python Execution', icon: Code2, enabled: true, color: 'text-amber-400' },
                  { name: 'Image Generation Studio', icon: Sparkles, enabled: true, color: 'text-pink-400' },
                ].map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${tool.color}`} />
                        <span className="font-semibold text-slate-200">{tool.name}</span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={tool.enabled} className="sr-only peer" />
                        <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 4: Agent Status & Live Execution Activity Stream */}
            {activeTab === 'activity' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Live Agent Stream</span>
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Realtime
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  {[
                    { time: '04:51:14', msg: 'Gemini 3.6 Flash streaming response completed in 240ms', type: 'success' },
                    { time: '04:51:12', msg: 'Vector search matched 5 knowledge chunks in Pinecone', type: 'info' },
                    { time: '04:51:10', msg: 'n8n Outbound Webhook event triggered successfully', type: 'success' },
                    { time: '04:51:02', msg: 'JWT Authorization token validated for user', type: 'info' },
                  ].map((act, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{act.time}</span>
                        <span className={act.type === 'success' ? 'text-emerald-400' : 'text-cyan-400'}>
                          {act.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-slate-300 leading-tight">{act.msg}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
