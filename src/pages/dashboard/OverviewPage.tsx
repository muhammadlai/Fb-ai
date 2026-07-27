import {
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  Bot,
  Layers,
  ArrowUpRight,
  Sparkles,
  Server,
  Workflow,
  Clock,
  CheckCircle2,
  Lock,
  Mic,
  Brain,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useToastStore } from '../../store/useToastStore';
import { DashboardMemoryPanel } from '../../components/assistant/DashboardMemoryPanel';

export function OverviewPage() {
  const { user } = useAuthStore();
  const { selectedModel, systemHealth } = useUIStore();
  const toast = useToastStore();

  const metrics = [
    {
      id: 'active-engines',
      label: 'Active AI Engines',
      value: '3 Online',
      subtext: 'Gemini 3.6 Flash + Nexus Omni',
      icon: Cpu,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/30',
    },
    {
      id: 'voice-assistant',
      label: 'Voice AI Assistant',
      value: 'Online',
      subtext: 'Speech + Emotion + Memory',
      icon: Mic,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/30',
    },
    {
      id: 'phase-status',
      label: 'Platform Architecture',
      value: 'Phase 11 Active',
      subtext: 'Real AI Voice Assistant Live',
      icon: Layers,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/30',
    },
    {
      id: 'credits-balance',
      label: 'Enterprise Token Pool',
      value: `${user?.credits.toLocaleString() || '1,000,000'}`,
      subtext: `Owner: Sir Aitzaz`,
      icon: Zap,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/30',
    },
  ];

  const phaseRoadmap = [
    { phase: 'Phase 1', title: 'Core Enterprise Layouts & Auth Gateway', status: 'completed' },
    { phase: 'Phase 2', title: 'Nexus AI Engine & Multi-Model Studio', status: 'completed' },
    { phase: 'Phase 3', title: 'Multimodal Creator Workspace & Canvas', status: 'completed' },
    { phase: 'Phase 4', title: 'Playwright Browser Automation & Pipelines', status: 'completed' },
    { phase: 'Phase 5', title: 'Enterprise Memory & Knowledge Vector Vault', status: 'completed' },
    { phase: 'Phase 6', title: 'Autonomous AI Agent & Browser Automation Platform', status: 'completed' },
    { phase: 'Phase 7', title: 'Enterprise RBAC, Audit & Compliance Center', status: 'completed' },
    { phase: 'Phase 8', title: 'Real-time Telemetry, Monitoring & FinOps', status: 'completed' },
    { phase: 'Phase 9', title: 'Multi-Agent Autonomous Collaboration Engine', status: 'completed' },
    { phase: 'Phase 10', title: 'Global Production Deployment & Edge Node Sync', status: 'completed' },
    { phase: 'Phase 11', title: 'Real AI Assistant (Voice + Memory + Avatar)', status: 'completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Phase 2 Deployed • AI Engine Active</span>
            </div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">
              Welcome back, <span className="text-gradient-cyber">{user?.name}</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Nexus AI Creator OS Enterprise v2 is active. Phase 2 AI Engine is live with Gemini 3.6 Flash, GPT-4o, Claude 3.7, DeepSeek R1, Reasoning panel, Agent Mode, and Token Analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/studio"
              className="cyber-button px-5 py-3 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              Launch Agent Studio
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className={`glass-card p-5 rounded-2xl border ${m.border} flex items-center justify-between hover:scale-[1.02] transition-transform`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {m.label}
                </span>
                <p className="text-xl font-black text-slate-100">{m.value}</p>
                <p className="text-[10px] font-mono text-slate-400">{m.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl ${m.bg} ${m.color} border ${m.border}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Platform Foundation Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/30 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Phase 11 Real AI Voice Assistant Core</h3>
                  <p className="text-xs text-slate-400 font-mono">Multimodal Speech, Vector Memory & Owner Verification</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded-full text-xs font-mono">
                Phase 11 Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Voice Speech Engine</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Web Speech API STT/TTS, Male/Female voice personas, speed/pitch controls, and continuous conversation mode.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Owner Verification Mode</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  "I am Aitzaz" or "Main Aitzaz hoon" triggers immediate owner recognition: "Welcome back Sir Aitzaz. I am ready."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Live Emotion & Avatar States</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Detects Happy, Sad, Angry, Excited, Confused states and renders live thinking stages (Searching Memory &rarr; Planning &rarr; Executing).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Voice System Navigation</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Speech commands like "Open Memory", "Open Workflows", "Open Studio" execute hands-free page navigation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 10-Phase Roadmap Progress */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/30 mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                Enterprise Architecture Roadmap
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Phase 11 / 11 Complete</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {phaseRoadmap.map((p, idx) => (
                <div
                  key={p.phase}
                  className={`p-3 rounded-xl border transition-all ${
                    idx === 10
                      ? 'bg-purple-950/60 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/40 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      {p.phase}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Deployed
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{p.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vector Memory & Knowledge Graph Panel */}
      <DashboardMemoryPanel />
    </div>
  );
}
