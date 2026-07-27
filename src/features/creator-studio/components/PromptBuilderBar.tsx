import { useState, FC } from 'react';
import { Sparkles, Loader2, Play, Wand2 } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { CREATOR_MODULES } from '../data/modulesAndTemplates';

export const PromptBuilderBar: FC = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    activeModuleId,
    generateProject,
    isGenerating,
    openWizard,
  } = useCreatorStore();

  const [enhancedMode, setEnhancedMode] = useState(false);

  const activeModule = CREATOR_MODULES.find((m) => m.id === activeModuleId);

  const handleEnhancePrompt = () => {
    setEnhancedMode(true);
    const enhanced = `Architect a production-ready, highly modular ${activeModule?.name || 'application'} with robust TypeScript interfaces, JWT authentication middleware, PostgreSQL database schemas, Redis caching layer, and multi-stage Docker containerization. Prompt: ${currentPrompt}`;
    setCurrentPrompt(enhanced);
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/30 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-100 tracking-wide">
            AI Prompt & Architecture Generator Engine
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openWizard}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-mono text-cyan-300 transition-colors cursor-pointer"
          >
            Open Custom Wizard
          </button>
          <button
            onClick={handleEnhancePrompt}
            className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/30 hover:bg-purple-900 text-[11px] font-mono text-purple-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Wand2 className="w-3 h-3" />
            <span>AI Enhance Prompt</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder={`Describe your enterprise ${activeModule?.name || 'project'} specifications...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all font-mono"
        />
        <button
          onClick={generateProject}
          disabled={!currentPrompt.trim() || isGenerating}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Architecting...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Generate Architecture</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
