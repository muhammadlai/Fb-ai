import { FC } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { CREATOR_MODULES } from '../data/modulesAndTemplates';

export const ModuleWizardModal: FC = () => {
  const {
    isWizardOpen,
    closeWizard,
    activeModuleId,
    wizardStepIndex,
    setWizardStepIndex,
    wizardValues,
    updateWizardValues,
    generateProject,
    isGenerating,
  } = useCreatorStore();

  if (!isWizardOpen) return null;

  const activeModule = CREATOR_MODULES.find((m) => m.id === activeModuleId) || CREATOR_MODULES[0];
  const steps = activeModule.wizardSteps;
  const currentStep = steps[wizardStepIndex] || steps[0];

  const isLastStep = wizardStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      generateProject();
    } else {
      setWizardStepIndex(wizardStepIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {activeModule.name} Architecture Wizard
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Step {wizardStepIndex + 1} of {steps.length}: {currentStep.title}
              </p>
            </div>
          </div>
          <button
            onClick={closeWizard}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Form Fields */}
        <div className="space-y-4">
          <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            {currentStep.description}
          </p>

          <div className="space-y-4">
            {currentStep.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  {field.label}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={wizardValues[field.id] ?? field.defaultValue ?? ''}
                    onChange={(e) => updateWizardValues({ [field.id]: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={3}
                    value={wizardValues[field.id] ?? field.defaultValue ?? ''}
                    onChange={(e) => updateWizardValues({ [field.id]: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={wizardValues[field.id] ?? field.defaultValue ?? ''}
                    onChange={(e) => updateWizardValues({ [field.id]: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'multiselect' && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {field.options?.map((opt) => {
                      const selectedList: string[] = wizardValues[field.id] ?? field.defaultValue ?? [];
                      const isSelected = selectedList.includes(opt);

                      const toggleOpt = () => {
                        const updated = isSelected
                          ? selectedList.filter((item) => item !== opt)
                          : [...selectedList, opt];
                        updateWizardValues({ [field.id]: updated });
                      };

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={toggleOpt}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 font-bold'
                              : 'bg-slate-950 text-slate-500 border-slate-800'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={wizardStepIndex === 0}
            onClick={() => setWizardStepIndex(wizardStepIndex - 1)}
            className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-mono disabled:opacity-30 cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs font-bold text-white font-mono flex items-center gap-2 cursor-pointer shadow-lg"
          >
            {isLastStep ? (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Build & Architect</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
