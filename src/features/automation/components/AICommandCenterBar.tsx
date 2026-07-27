import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Play } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';

export const AICommandCenterBar: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { executeAIPromptCommand } = useAutomationStore();

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      await executeAIPromptCommand(prompt);
      setPrompt('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/30 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-100 tracking-wide">
            AI Playwright Pipeline Command Center
          </h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
          Natural Language DOM Engine
        </span>
      </div>

      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Scrape top 10 AI engineering leads on LinkedIn and dispatch thread to X (Twitter)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 transition-all font-mono"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isProcessing}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all shadow-md shrink-0"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Workflow</span>
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono overflow-x-auto pt-1">
        <span className="text-slate-500">Quick Commands:</span>
        <button
          onClick={() => setPrompt('Monitor X.com AI hashtag and draft post summary')}
          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
        >
          X.com Hashtag Monitor
        </button>
        <button
          onClick={() => setPrompt('LinkedIn outreach to Tech VPs with delay')}
          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
        >
          LinkedIn Outreach
        </button>
        <button
          onClick={() => setPrompt('Scrape Facebook group posts matching Generative AI')}
          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
        >
          FB Group Scraping
        </button>
      </div>
    </div>
  );
};
