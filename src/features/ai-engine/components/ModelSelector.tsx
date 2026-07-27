import React, { useState } from 'react';
import { ChevronDown, Zap, Sparkles, Check, Brain, Eye } from 'lucide-react';
import { AI_MODELS } from '../data/modelsAndTemplates';
import { AIModel, AIProvider } from '../types/ai';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

const PROVIDER_COLORS: Record<AIProvider, { badge: string; text: string }> = {
  google: { badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400', text: 'Google' },
  openai: { badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', text: 'OpenAI' },
  anthropic: { badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400', text: 'Anthropic' },
  deepseek: { badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400', text: 'DeepSeek' },
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
      >
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
            PROVIDER_COLORS[selectedModel.provider].badge
          }`}
        >
          {selectedModel.provider.toUpperCase()}
        </span>
        <span className="truncate max-w-[130px]">{selectedModel.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-40 p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl backdrop-blur-2xl divide-y divide-slate-800/60 scrollbar-thin">
            {(['google', 'openai', 'anthropic', 'deepseek'] as AIProvider[]).map((provider) => {
              const providerModels = AI_MODELS.filter((m) => m.provider === provider);
              return (
                <div key={provider} className="py-2 first:pt-0 last:pb-0">
                  <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {PROVIDER_COLORS[provider].text} Models
                  </div>
                  <div className="space-y-1 mt-1">
                    {providerModels.map((model) => {
                      const isSelected = model.id === selectedModelId;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            onSelectModel(model.id);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 text-cyan-300'
                              : 'hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="space-y-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs">{model.name}</span>
                              {model.speedRating === 'Ultra-Fast' && (
                                <Zap className="w-3 h-3 text-amber-400" />
                              )}
                              {model.supportsReasoning && (
                                <Brain className="w-3 h-3 text-purple-400" />
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              {model.description}
                            </p>
                            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
                              <span>{(model.contextWindow / 1000).toFixed(0)}k ctx</span>
                              <span>•</span>
                              <span>{model.speedRating}</span>
                            </div>
                          </div>

                          {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
