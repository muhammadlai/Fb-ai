import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MessageSquare,
  FileCode,
  Folder,
  Bot,
  Brain,
  Zap,
  Workflow,
  FileText,
  Settings,
  Terminal,
  X,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useDockStore } from '../../store/useDockStore';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category:
    | 'Chats'
    | 'Files'
    | 'Projects'
    | 'Agents'
    | 'Memories'
    | 'APIs'
    | 'Workflows'
    | 'Documents'
    | 'Settings'
    | 'Commands';
  actionPath?: string;
  actionId?: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  { id: 's-1', title: 'Gemini 2.5 Pro Architect Chat Session', subtitle: 'AI Engine • Active context window', category: 'Chats', actionPath: '/studio' },
  { id: 's-2', title: 'src/features/telemetry/TelemetryDashboard.tsx', subtitle: 'Phase 8 Live Telemetry & FinOps Component', category: 'Files', actionPath: '/analytics' },
  { id: 's-3', title: 'Nexus AI Creator OS Master Workspace', subtitle: 'Project • 142 Active Agents & Swarms', category: 'Projects', actionPath: '/workspace' },
  { id: 's-4', title: 'Playwright Web Scraping Swarm Agent #14', subtitle: 'Agent • Crawling competitor pricing data', category: 'Agents', actionPath: '/workspace' },
  { id: 's-5', title: 'User Preference Vector Embeddings Vault', subtitle: 'Memory • 25,000 Qdrant index vectors', category: 'Memories', actionPath: '/knowledge' },
  { id: 's-6', title: 'Google Gemini 2.5 Flash @google/genai SDK', subtitle: 'API • REST proxy endpoints operational', category: 'APIs', actionPath: '/analytics' },
  { id: 's-7', title: 'Nightly ETL Pipeline & Database Sync', subtitle: 'Workflow • Scheduled trigger every 24 hours', category: 'Workflows', actionPath: '/workflows' },
  { id: 's-8', title: 'Enterprise Compliance Architecture Spec', subtitle: 'Document • PDF & Markdown documentation', category: 'Documents', actionPath: '/knowledge' },
  { id: 's-9', title: 'Cyber UI Theme & System Preferences', subtitle: 'Settings • Dark mode & glowing accents', category: 'Settings', actionPath: '/dashboard' },
  { id: 's-10', title: 'Spawn Playwright Browser Cluster Task', subtitle: 'Command • Executable Quick Action', category: 'Commands', actionId: 'launch-agent' },
  { id: 's-11', title: 'Capture High-Res Workspace Screenshot', subtitle: 'Command • Executable Quick Action', category: 'Commands', actionId: 'screenshot' },
  { id: 's-12', title: 'Toggle Voice Command Synthesis', subtitle: 'Command • Executable Quick Action', category: 'Commands', actionId: 'voice-command' },
];

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const { globalSearchOpen, setGlobalSearchOpen, triggerQuickAction } = useDockStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard listener for Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      } else if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [globalSearchOpen]);

  const filtered = SEARCH_DATABASE.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSelectItem = (item: SearchItem) => {
    setGlobalSearchOpen(false);
    if (item.actionPath) {
      navigate(item.actionPath);
    } else if (item.actionId) {
      triggerQuickAction(item.actionId);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelectItem(filtered[selectedIndex]);
    }
  };

  const getCategoryIcon = (cat: SearchItem['category']) => {
    switch (cat) {
      case 'Chats':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'Files':
        return <FileCode className="w-4 h-4 text-purple-400" />;
      case 'Projects':
        return <Folder className="w-4 h-4 text-indigo-400" />;
      case 'Agents':
        return <Bot className="w-4 h-4 text-amber-400" />;
      case 'Memories':
        return <Brain className="w-4 h-4 text-rose-400" />;
      case 'APIs':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'Workflows':
        return <Workflow className="w-4 h-4 text-cyan-300" />;
      case 'Documents':
        return <FileText className="w-4 h-4 text-purple-300" />;
      case 'Settings':
        return <Settings className="w-4 h-4 text-amber-300" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-300" />;
    }
  };

  if (!globalSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={() => setGlobalSearchOpen(false)} />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl p-5 space-y-4 font-mono text-xs z-10"
        >
          {/* Top Search Bar */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Search className="w-5 h-5 text-cyan-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownInput}
              placeholder="Search chats, files, projects, agents, memories, APIs, workflows (Ctrl+K)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => setGlobalSearchOpen(false)}
              className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
            {(
              [
                'all',
                'Chats',
                'Files',
                'Projects',
                'Agents',
                'Memories',
                'APIs',
                'Workflows',
                'Documents',
                'Settings',
                'Commands',
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg border font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-500 italic">
                No matching results found for "{query}".
              </div>
            ) : (
              filtered.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    idx === selectedIndex
                      ? 'bg-purple-950/80 border-cyan-500 text-slate-100 shadow-lg shadow-purple-950/50'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-sans">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold uppercase">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Key Hints Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">Enter</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">Esc</kbd> Close</span>
            </div>
            <span className="text-cyan-400 font-bold">Nexus Search Engine v2.5</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
