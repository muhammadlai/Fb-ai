import { FC } from 'react';
import { Layers } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { TECH_STACK_LABELS, CREATOR_MODULES } from '../data/modulesAndTemplates';
import { TechnologyOption } from '../types/creator';

export const TechSelector: FC = () => {
  const { selectedTechStack, toggleTechStackOption, activeModuleId } = useCreatorStore();

  const activeModule = CREATOR_MODULES.find((m) => m.id === activeModuleId);
  const allowedStacks = activeModule?.allowedTechStacks || (Object.keys(TECH_STACK_LABELS) as TechnologyOption[]);

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 uppercase font-bold">
          <Layers className="w-4 h-4 text-purple-400" />
          Enterprise Technology Selector
        </span>
        <span className="text-slate-500">
          Selected: <strong className="text-cyan-400">{selectedTechStack.length} Technologies</strong>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {allowedStacks.map((option) => {
          const tech = TECH_STACK_LABELS[option];
          const isSelected = selectedTechStack.includes(option);

          return (
            <button
              key={option}
              onClick={() => toggleTechStackOption(option)}
              className={`px-3 py-1 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                isSelected
                  ? tech.color + ' shadow-sm scale-[1.02]'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
            >
              {isSelected ? '✓ ' : '+ '}
              {tech.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
