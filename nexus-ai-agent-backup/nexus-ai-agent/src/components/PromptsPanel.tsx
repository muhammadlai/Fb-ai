import React, { useState } from 'react';
import {
  Lightbulb,
  Search,
  Star,
  Copy,
  Check,
  Plus,
  Sparkles,
  Tag
} from 'lucide-react';
import { PROMPT_LIBRARY } from '../data/mockData';
import { PromptTemplate } from '../types';

interface PromptsPanelProps {
  onSelectPrompt?: (promptText: string) => void;
}

export const PromptsPanel: React.FC<PromptsPanelProps> = ({ onSelectPrompt }) => {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(PROMPT_LIBRARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Engineering', 'Backend', 'Automation', 'AI & Data', 'Strategy'];

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            Prompt Engineering Library ({prompts.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated system prompts for React refactoring, FastAPI backends, vector search, and n8n webhooks.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/40"
          />
        </div>
      </div>

      {/* Grid of Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/40 backdrop-blur-xl shadow-xl space-y-3 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                {p.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {p.category}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>

            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-white/5 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {p.prompt}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-1">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(p.id, p.prompt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1 transition-colors"
                >
                  {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
