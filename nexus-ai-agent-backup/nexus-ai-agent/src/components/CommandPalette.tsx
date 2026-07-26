import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Command,
  Bot,
  Workflow,
  Database,
  Cpu,
  Zap,
  X,
  ChevronRight,
  Globe,
  Smartphone,
  Image as ImageIcon,
  Video,
  FileText,
  Code,
  Settings,
  Radio,
  Layers,
  Wand2
} from 'lucide-react';
import { ActiveView } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView, initialPrompt?: string) => void;
  onSelectModel?: (modelId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'intent_web',
      title: 'Build Website (React + Tailwind)',
      category: 'AI Intent Creator',
      intentTag: 'WEB BUILDER',
      icon: Globe,
      action: () =>
        onNavigate('chat', 'Build a modern React + Tailwind website with glassmorphism design and responsive layout.'),
    },
    {
      id: 'intent_mobile',
      title: 'Build Mobile App (React Native)',
      category: 'AI Intent Creator',
      intentTag: 'MOBILE APP',
      icon: Smartphone,
      action: () =>
        onNavigate('chat', 'Build a React Native Expo application with clean architecture and navigation.'),
    },
    {
      id: 'intent_img',
      title: 'Generate Images (Imagen 3)',
      category: 'AI Intent Creator',
      intentTag: '8K IMAGEN',
      icon: ImageIcon,
      action: () => onNavigate('imagegen'),
    },
    {
      id: 'intent_video',
      title: 'Generate Video Prompt & Storyboard',
      category: 'AI Intent Creator',
      intentTag: 'VEO SYNTHESIS',
      icon: Video,
      action: () =>
        onNavigate('chat', 'Generate a cinematic 30-second AI video prompt script with visual stage directions.'),
    },
    {
      id: 'intent_code',
      title: 'Generate Full-Stack Code (FastAPI + SQL)',
      category: 'AI Intent Creator',
      intentTag: 'CODE SYNTHESIS',
      icon: Code,
      action: () =>
        onNavigate('chat', 'Generate a FastAPI Python backend router with Pydantic schemas and SQL queries.'),
    },
    {
      id: 'intent_saas',
      title: 'Build SaaS Multi-Tenant Platform',
      category: 'AI Intent Creator',
      intentTag: 'SAAS ENGINE',
      icon: Layers,
      action: () =>
        onNavigate('chat', 'Architect a full-stack SaaS platform with auth, Stripe webhooks, and team roles.'),
    },
    { id: 'c_creator_home', title: 'Open AI Creator Operating System', category: 'Navigation', icon: Wand2, action: () => onNavigate('creator_home') },
    { id: 'c_chat', title: 'Open AI Agent Chat', category: 'Navigation', icon: Sparkles, action: () => onNavigate('chat') },
    { id: 'c_flow', title: 'Launch Workflow Automation Canvas', category: 'Automation', icon: Workflow, action: () => onNavigate('workflows') },
    { id: 'c_agent', title: 'Manage Autonomous AI Agents', category: 'Automation', icon: Bot, action: () => onNavigate('agents') },
    { id: 'c_rag', title: 'Open Vector Knowledge Base', category: 'Data & RAG', icon: Database, action: () => onNavigate('knowledge') },
    { id: 'c_dash', title: 'View Platform Metrics & Telemetry', category: 'Analytics', icon: Cpu, action: () => onNavigate('dashboard') },
    { id: 'c_integ', title: 'Configure 20+ Tool Integrations', category: 'System', icon: Settings, action: () => onNavigate('integrations') },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-white/10 bg-slate-950/80">
          <Wand2 className="w-5 h-5 text-cyan-400 shrink-0 mr-3 animate-pulse" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type intent or command (e.g. 'Build website', 'Generate code', 'Workflow', 'Agents')..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-600/15 hover:border-purple-500/30 border border-transparent text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-purple-600/30 text-cyan-400 group-hover:text-cyan-300 transition-colors shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 flex items-center gap-2">
                        {cmd.title}
                        {cmd.intentTag && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                            {cmd.intentTag}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{cmd.category}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching intent actions found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd> to exit
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Command className="w-3.5 h-3.5" /> Nexus Smart Command Bar v3
          </span>
        </div>
      </div>
    </div>
  );
};
