// CreatorHomeView.tsx - Creator Home Hub with 3D Voice Assistant & Multimodal Tools

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mic, Brain, Code, Palette, Zap, Play, ArrowRight, UserCheck } from 'lucide-react';
import { VoiceAssistant } from './VoiceAssistant';
import { DashboardMemoryPanel } from './assistant/DashboardMemoryPanel';
import { useNavigate } from 'react-router-dom';

export const CreatorHomeView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Welcome Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold uppercase">
              Phase 11 Active • Enterprise AI OS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 font-sans tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-indigo-400">Sir Aitzaz</span>
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            Nexus AI Creator OS Enterprise is ready. Interact via natural speech voice commands, access 10-Phase autonomous tools, or query vector memory.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/studio')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <Palette className="w-4 h-4" /> Creator Studio
          </button>
          <button
            onClick={() => navigate('/workflows')}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-cyan-500/50 text-cyan-300 hover:bg-slate-800 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Code className="w-4 h-4" /> Automations
          </button>
        </div>
      </div>

      {/* Grid: 3D Voice Assistant Core + Memory Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <VoiceAssistant />
        </div>

        <div className="lg:col-span-2">
          <DashboardMemoryPanel />
        </div>
      </div>
    </div>
  );
};
