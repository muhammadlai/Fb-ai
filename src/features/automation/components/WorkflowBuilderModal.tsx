import React, { useState } from 'react';
import { X, Workflow, Plus, Trash2, ShieldCheck, Sparkles, Clock, Globe } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';
import { AutomationAction, AutomationStep } from '../types/automation';

interface WorkflowBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowBuilderModal: React.FC<WorkflowBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addTask, profiles } = useAutomationStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profileId, setProfileId] = useState(profiles[0]?.id || 'prof-1');
  const [triggerType, setTriggerType] = useState<'user_initiated' | 'scheduled'>('user_initiated');
  const [cronSchedule, setCronSchedule] = useState('0 9 * * 1-5');
  const [requiresUserAuthorization, setRequiresUserAuthorization] = useState(true);

  const [steps, setSteps] = useState<AutomationStep[]>([
    {
      id: 'step-1',
      action: 'open_url',
      description: 'Navigate to target web application',
      value: 'https://example.com/portal',
      status: 'pending',
    },
    {
      id: 'step-2',
      action: 'fill_form',
      description: 'Fill search query form',
      targetSelector: '#search-input',
      value: 'Enterprise AI Suite',
      status: 'pending',
    },
    {
      id: 'step-3',
      action: 'click',
      description: 'Click search submit button',
      targetSelector: '#submit-btn',
      requiresAuthConfirmation: true,
      status: 'pending',
    },
  ]);

  if (!isOpen) return null;

  const handleAddStep = () => {
    const newStep: AutomationStep = {
      id: `step-${Date.now()}`,
      action: 'extract_data',
      description: 'Extract table content & metrics',
      status: 'pending',
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const handleUpdateStep = (index: number, updates: Partial<AutomationStep>) => {
    setSteps(
      steps.map((s, idx) => (idx === index ? { ...s, ...updates } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || steps.length === 0) return;

    addTask({
      name,
      description,
      profileId,
      triggerType,
      cronSchedule: triggerType === 'scheduled' ? cronSchedule : undefined,
      requiresUserAuthorization,
      steps,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-100">Create Automation Workflow</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Workflow Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daily E-Commerce Price Audit"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Browser Profile</label>
              <select
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50 font-mono"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Automated Playwright browser script for form submission and report rendering"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Execution Trigger</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50 uppercase font-mono"
              >
                <option value="user_initiated">User Initiated (Manual Click)</option>
                <option value="scheduled">Scheduled Cron Automation</option>
              </select>
            </div>

            {triggerType === 'scheduled' && (
              <div>
                <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Cron Schedule (e.g., 0 9 * * 1-5)</label>
                <input
                  type="text"
                  value={cronSchedule}
                  onChange={(e) => setCronSchedule(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-slate-200">User Authorization Safeguard</p>
                <p className="text-[10px] text-slate-400">Require explicit user confirmation modal before mutation actions.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={requiresUserAuthorization}
              onChange={(e) => setRequiresUserAuthorization(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">Automation Steps ({steps.length})</span>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {steps.map((step, idx) => (
                <div key={step.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-cyan-400">Step {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={step.action}
                      onChange={(e) => handleUpdateStep(idx, { action: e.target.value as AutomationAction })}
                      className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono uppercase text-[10px]"
                    >
                      <option value="open_url">Open URL</option>
                      <option value="navigate">Navigate</option>
                      <option value="fill_form">Fill Form</option>
                      <option value="click">Click Element</option>
                      <option value="read_content">Read Page Content</option>
                      <option value="extract_data">Extract Data</option>
                      <option value="generate_report">Generate Report</option>
                      <option value="screenshot">Capture Screenshot</option>
                    </select>

                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleUpdateStep(idx, { description: e.target.value })}
                      placeholder="Step Description"
                      className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={step.targetSelector || ''}
                      onChange={(e) => handleUpdateStep(idx, { targetSelector: e.target.value })}
                      placeholder="CSS Selector (e.g. #input-id)"
                      className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[10px]"
                    />
                    <input
                      type="text"
                      value={step.value || ''}
                      onChange={(e) => handleUpdateStep(idx, { value: e.target.value })}
                      placeholder="Value / URL"
                      className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[10px]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`auth-chk-${idx}`}
                      checked={step.requiresAuthConfirmation || false}
                      onChange={(e) => handleUpdateStep(idx, { requiresAuthConfirmation: e.target.checked })}
                      className="w-3.5 h-3.5 accent-amber-400 cursor-pointer"
                    />
                    <label htmlFor={`auth-chk-${idx}`} className="text-[10px] font-mono text-slate-400 cursor-pointer">
                      Require authorization modal before this step
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 hover:from-purple-500 hover:to-cyan-500 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Save Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
