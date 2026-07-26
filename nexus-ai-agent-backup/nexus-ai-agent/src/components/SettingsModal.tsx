import React, { useState, useEffect } from 'react';
import { Settings, Save, Key, Sliders, ShieldCheck, RefreshCw, Cpu, Workflow } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsModalProps {
  settings: SystemSettings | null;
  onSaveSettings: (newSettings: SystemSettings) => Promise<void>;
  saving: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  saving,
}) => {
  const [formData, setFormData] = useState<SystemSettings>({
    system_prompt: 'You are Nexus AI Agent, an autonomous full-stack AI engineering assistant.',
    temperature: 0.7,
    selected_model: 'gemini-3.6-flash',
    n8n_webhook_url: 'http://localhost:5678/webhook/nexus-agent',
    n8n_webhook_secret: 'nexus_secret_key_2026',
    openai_api_key_set: false,
    gemini_api_key_set: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">System Configuration & Settings</h2>
            <p className="text-xs text-slate-400">Configure AI model params, system prompt instructions, and n8n endpoints</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full animate-fade-in">
            Settings Saved to Backend!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* Model & Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              AI Model Alias
            </label>
            <select
              value={formData.selected_model}
              onChange={(e) => setFormData({ ...formData, selected_model: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg p-3 font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="gemini-3.6-flash">gemini-3.6-flash (Fast & Intelligent • Default)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Reasoning & Code)</option>
              <option value="gpt-4o">gpt-4o (OpenAI Integration ready)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Temperature Creativity ({formData.temperature})
              </label>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>0.0 (Precise & Deterministic)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Agent System Persona Instruction
          </label>
          <textarea
            value={formData.system_prompt}
            onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 text-indigo-200 text-xs rounded-xl p-3.5 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            placeholder="Define the agent persona..."
          />
        </div>

        {/* n8n Webhook Endpoint Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-indigo-400" />
              n8n Webhook Target URL
            </label>
            <input
              type="text"
              value={formData.n8n_webhook_url}
              onChange={(e) => setFormData({ ...formData, n8n_webhook_url: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg p-3 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              HMAC Signature Webhook Secret
            </label>
            <input
              type="password"
              value={formData.n8n_webhook_secret}
              onChange={(e) => setFormData({ ...formData, n8n_webhook_secret: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg p-3 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* API Key Status Check */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Environment API Keys:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Gemini API: {formData.gemini_api_key_set ? '🟢 Configured' : '🟡 Injected from secrets'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
              OpenAI API: {formData.openai_api_key_set ? '🟢 Configured' : '⚪ Phase 3 Ready'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Updating System Configuration...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save System Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
};
