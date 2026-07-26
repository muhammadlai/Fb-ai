import React, { useState } from 'react';
import {
  Settings,
  Key,
  Cpu,
  Brain,
  ShieldCheck,
  CreditCard,
  Users,
  CheckCircle2,
  Save,
  Lock,
  Plus,
  Trash2,
  UserCheck
} from 'lucide-react';
import { SystemSettings, TeamMember } from '../types';
import { TEAM_MEMBERS } from '../data/mockData';

interface SettingsViewProps {
  settings: SystemSettings | null;
  onSaveSettings: (newSettings: SystemSettings) => void;
  saving: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  saving,
}) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'llm' | 'memory' | 'security' | 'billing' | 'team'>('keys');
  const [localSettings, setLocalSettings] = useState<SystemSettings>(
    settings || {
      system_prompt: 'You are Nexus AI Agent, an autonomous full-stack AI coding and automation engineer.',
      temperature: 0.7,
      top_p: 0.9,
      selected_model: 'gemini-3.6-flash',
      n8n_webhook_url: 'http://localhost:5678/webhook/nexus-agent',
      n8n_webhook_secret: 'nexus_secret_key_2026',
      openai_api_key_set: true,
      gemini_api_key_set: true,
      anthropic_api_key_set: true,
      openrouter_api_key_set: true,
      memory_mode: 'vector_rag',
      auto_web_search: true,
      context_length: 128000,
    }
  );

  const [team, setTeam] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const [apiKeyInputs, setApiKeyInputs] = useState({
    gemini: '••••••••••••••••••••••••••••••••',
    openai: '••••••••••••••••••••••••••••••••',
    anthropic: '••••••••••••••••••••••••••••••••',
    openrouter: '••••••••••••••••••••••••••••••••',
  });

  const handleSave = () => {
    onSaveSettings(localSettings);
  };

  const handleInviteMember = () => {
    if (!newMemberEmail.trim()) return;
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'Member',
      status: 'Invited',
      lastActive: 'Never',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    setTeam(prev => [...prev, newMember]);
    setNewMemberEmail('');
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-400" />
            Nexus System & Provider Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage API credentials, LLM model providers, vector memory configuration, billing, and team permissions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-purple-950/60 flex items-center gap-2 transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-medium overflow-x-auto">
        {[
          { id: 'keys', label: 'API Keys & Secrets', icon: Key },
          { id: 'llm', label: 'LLM Providers', icon: Cpu },
          { id: 'memory', label: 'Vector & Memory', icon: Brain },
          { id: 'security', label: 'Security & JWT', icon: ShieldCheck },
          { id: 'billing', label: 'Billing & Credits', icon: CreditCard },
          { id: 'team', label: 'Team Members', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 text-xs">
        {/* Tab 1: API Keys */}
        {activeTab === 'keys' && (
          <div className="space-y-4">
            <div className="text-sm font-bold text-slate-100">API Provider Key Management</div>
            <p className="text-slate-400">
              API keys are stored securely server-side in environment configurations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                { key: 'gemini', label: 'Google Gemini API Key', provider: 'Google AI Studio', isSet: localSettings.gemini_api_key_set },
                { key: 'openai', label: 'OpenAI API Secret Key', provider: 'OpenAI Platform', isSet: localSettings.openai_api_key_set },
                { key: 'anthropic', label: 'Anthropic Claude Key', provider: 'Anthropic Console', isSet: true },
                { key: 'openrouter', label: 'OpenRouter Unified Key', provider: 'OpenRouter.ai', isSet: true },
              ].map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{item.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Configured
                    </span>
                  </div>
                  <input
                    type="password"
                    value={apiKeyInputs[item.key as keyof typeof apiKeyInputs]}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, [item.key]: e.target.value }))}
                    className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg p-2.5 border border-white/10 font-mono focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">Source: {item.provider}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: LLM Providers */}
        {activeTab === 'llm' && (
          <div className="space-y-4">
            <div className="text-sm font-bold text-slate-100">LLM Provider Routing & Fallbacks</div>
            <p className="text-slate-400">
              Configure automatic failover priorities across OpenAI, Gemini, Claude, and DeepSeek.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { name: 'Google GenAI (Gemini 3.6 Flash / 2.5 Pro)', priority: 'Primary (Priority 1)', status: 'Active' },
                { name: 'Anthropic Claude (Sonnet 3.5 / Opus)', priority: 'Secondary (Priority 2)', status: 'Active' },
                { name: 'OpenAI GPT-5 Omni', priority: 'Tertiary (Priority 3)', status: 'Active' },
                { name: 'DeepSeek R1 / V3 Reasoning Engine', priority: 'Fallback (Priority 4)', status: 'Active' },
              ].map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{p.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{p.priority}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Team Members */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-100">Workspace Team Members</div>
                <p className="text-slate-400">Manage developer permissions and access roles.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Colleague email..."
                  className="bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2 border border-white/10 focus:outline-none"
                />
                <button
                  onClick={handleInviteMember}
                  className="px-3 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-purple-500 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Invite
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {team.map((member) => (
                <div key={member.id} className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-slate-200">{member.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-500/20">
                      {member.role}
                    </span>
                    <span className="text-emerald-400">{member.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
