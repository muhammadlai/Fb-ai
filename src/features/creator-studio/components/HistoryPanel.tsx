import { FC } from 'react';
import { History, Trash2, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { MODULE_TEMPLATES, TECH_STACK_LABELS } from '../data/modulesAndTemplates';

export const HistoryPanel: FC = () => {
  const { history, deleteHistoryItem, loadHistoryProject, applyTemplate } = useCreatorStore();

  return (
    <div className="space-y-6">
      {/* Templates Showcase */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Enterprise Starter Blueprints & Templates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  {tpl.moduleId.toUpperCase()}
                </span>
                <h4 className="text-xs font-bold text-slate-100">{tpl.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{tpl.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex gap-1">
                  {tpl.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => applyTemplate(tpl.id)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 text-[10px] font-mono font-bold cursor-pointer flex items-center gap-1"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generation History Timeline */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          Architecture Generation History ({history.length})
        </h3>

        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono italic">No architecture history yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{item.summary}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/40">
                      {item.moduleName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 font-mono">{item.prompt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => loadHistoryProject(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono hover:bg-slate-800 cursor-pointer"
                  >
                    Load Architecture
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
