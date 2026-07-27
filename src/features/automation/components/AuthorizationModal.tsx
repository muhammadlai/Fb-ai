import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Lock, ArrowRight } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';

export const AuthorizationModal: React.FC = () => {
  const { pendingAuthorizationStep, confirmAuthorizationStep } = useAutomationStore();

  if (!pendingAuthorizationStep) return null;

  const { task, step } = pendingAuthorizationStep;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-amber-950/50 border-b border-amber-500/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-200">Security Safeguard Authorization Required</h3>
            <p className="text-xs text-amber-400/80 font-mono">User Confirmation Gate Active</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs font-sans">
          <p className="text-slate-300 leading-relaxed">
            The automated browser workflow <strong className="text-slate-100">"{task.name}"</strong> is attempting to execute an action marked for explicit user confirmation.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>ACTION TYPE</span>
              <span className="uppercase text-cyan-400">{step.action}</span>
            </div>
            <p className="text-sm font-bold text-slate-100">{step.description}</p>
            {step.targetSelector && (
              <p className="text-xs text-purple-400">Target Selector: {step.targetSelector}</p>
            )}
            {step.value && (
              <p className="text-xs text-emerald-400">Submitted Value: {step.value}</p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px] flex items-start gap-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Allowing this step will grant Playwright browser automation permission to execute DOM state mutations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              onClick={() => confirmAuthorizationStep(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline Action</span>
            </button>
            <button
              onClick={() => confirmAuthorizationStep(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize & Execute Step</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
