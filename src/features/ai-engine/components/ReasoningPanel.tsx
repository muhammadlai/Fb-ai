import React from 'react';
import { Brain, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReasoningStep } from '../types/ai';

interface ReasoningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  reasoningSteps: ReasoningStep[];
  isGenerating: boolean;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({
  isOpen,
  onClose,
  reasoningSteps,
  isGenerating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-950/90 backdrop-blur-xl flex flex-col h-full z-20 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-200">Reasoning Panel</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Reasoning Steps List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {reasoningSteps.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto" />
            <p className="text-xs text-slate-400">
              No reasoning trace active. Send a message with Reasoning Mode enabled or select a reasoning model like DeepSeek R1 or Gemini 3.1 Pro.
            </p>
          </div>
        ) : (
          reasoningSteps.map((step) => (
            <div
              key={step.id}
              className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">
                  Step {step.stepNumber}: {step.title}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {step.content}
              </p>
            </div>
          ))
        )}

        {isGenerating && (
          <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center gap-2 text-xs text-purple-300 animate-pulse">
            <Brain className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Formulating next reasoning step...</span>
          </div>
        )}
      </div>
    </div>
  );
};
