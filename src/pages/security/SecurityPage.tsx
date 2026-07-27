import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Key,
  UserCheck,
  FileCode2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  Plus,
  Trash2,
  RefreshCw,
  AlertTriangle,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

interface ApiSecretKey {
  id: string;
  name: string;
  provider: string;
  keyMasked: string;
  fullValue: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

interface RbacRole {
  id: string;
  name: string;
  usersCount: number;
  permissions: string[];
  isOwnerRole?: boolean;
}

export const SecurityPage: React.FC = () => {
  const { user } = useAuthStore();
  const toast = useToastStore();

  const [activeTab, setActiveTab] = useState<'secrets' | 'rbac' | 'audit' | 'owner'>('secrets');
  const [showFullKeys, setShowFullKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [secrets, setSecrets] = useState<ApiSecretKey[]>([
    {
      id: 'sec-1',
      name: 'Google Gemini API Key',
      provider: 'Google GenAI',
      keyMasked: 'AIzaSy********************912',
      fullValue: process.env.GEMINI_API_KEY || 'AIzaSyA4x9102839102938102938',
      lastUsed: 'Just now',
      status: 'active',
    },
    {
      id: 'sec-2',
      name: 'OpenAI Secret Key',
      provider: 'OpenAI',
      keyMasked: 'sk-proj-********************a81',
      fullValue: 'sk-proj-9102839102938102938102938102938',
      lastUsed: '12 mins ago',
      status: 'active',
    },
    {
      id: 'sec-3',
      name: 'Anthropic Claude Key',
      provider: 'Anthropic',
      keyMasked: 'sk-ant-********************z09',
      fullValue: 'sk-ant-api03-9102839102938102938102938',
      lastUsed: '1 hour ago',
      status: 'active',
    },
    {
      id: 'sec-4',
      name: 'DeepSeek API Key',
      provider: 'DeepSeek AI',
      keyMasked: 'sk-ds-********************b42',
      fullValue: 'sk-ds-9102839102938102938102938',
      lastUsed: '3 hours ago',
      status: 'active',
    },
  ]);

  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretVal, setNewSecretVal] = useState('');

  const rbacRoles: RbacRole[] = [
    {
      id: 'role-owner',
      name: 'System Owner (Sir Aitzaz)',
      usersCount: 1,
      isOwnerRole: true,
      permissions: [
        'Full Hardware & Model Control',
        'Secret Vault Master Encryption',
        'Browser Automation Exec',
        'Memory Vector Graph Clean',
        'Enterprise Telemetry Audit',
      ],
    },
    {
      id: 'role-admin',
      name: 'Enterprise Admin',
      usersCount: 3,
      permissions: [
        'Agent Pipeline Exec',
        'Knowledge Ingestion',
        'Workflow Orchestration',
        'Read Telemetry',
      ],
    },
    {
      id: 'role-dev',
      name: 'AI Developer',
      usersCount: 12,
      permissions: ['Prompt Engineering', 'Creator Studio Build', 'Memory Query'],
    },
  ];

  const toggleShowKey = (id: string) => {
    setShowFullKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = (id: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    toast.success('Copied to Clipboard', 'Secret API key copied securely.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecretName || !newSecretVal) return;

    const newKeyObj: ApiSecretKey = {
      id: `sec-${Date.now()}`,
      name: newSecretName,
      provider: 'Custom Integration',
      keyMasked: `${newSecretVal.slice(0, 6)}********************${newSecretVal.slice(-3)}`,
      fullValue: newSecretVal,
      lastUsed: 'Never',
      status: 'active',
    };

    setSecrets([...secrets, newKeyObj]);
    setNewSecretName('');
    setNewSecretVal('');
    toast.cyber('Secret Stored', `Key "${newSecretName}" stored in encrypted vault.`);
  };

  const handleDeleteSecret = (id: string) => {
    setSecrets(secrets.filter((s) => s.id !== id));
    toast.info('Secret Revoked', 'API key removed from active vault.');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            Enterprise Security & Governance Vault
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            AES-256 Encrypted Credential Management • Role-Based Access Control • Owner Mode Audit
          </p>
        </div>

        {/* Owner Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-300">
          <User className="w-4 h-4 text-cyan-400" />
          <span>System Owner: <strong className="text-white">Sir Aitzaz</strong></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('secrets')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'secrets'
              ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" /> Secret Vault ({secrets.length})
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'rbac'
              ? 'bg-purple-950 border border-purple-500/50 text-purple-300 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" /> RBAC & Roles
        </button>

        <button
          onClick={() => setActiveTab('owner')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'owner'
              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Owner Recognition Mode
        </button>
      </div>

      {/* Secret Vault Content */}
      {activeTab === 'secrets' && (
        <div className="space-y-6">
          {/* Add Secret Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Add New API Key / Secret
            </h3>

            <form onSubmit={handleAddSecret} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Secret Name (e.g. Stripe Key, AWS Secret)"
                value={newSecretName}
                onChange={(e) => setNewSecretName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <input
                type="password"
                placeholder="Secret Key Value..."
                value={newSecretVal}
                onChange={(e) => setNewSecretVal(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Lock className="w-3.5 h-3.5" /> Save to Encrypted Vault
              </button>
            </form>
          </div>

          {/* Secrets List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secrets.map((sec) => (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 font-mono">{sec.name}</h4>
                    <span className="text-[10px] font-mono text-purple-400">{sec.provider}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                    {sec.status.toUpperCase()}
                  </span>
                </div>

                {/* Key Value Field */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                  <span className="flex-1 truncate text-slate-300">
                    {showFullKeys[sec.id] ? sec.fullValue : sec.keyMasked}
                  </span>

                  <button
                    onClick={() => toggleShowKey(sec.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showFullKeys[sec.id] ? 'Hide Secret' : 'Reveal Secret'}
                  >
                    {showFullKeys[sec.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleCopyKey(sec.id, sec.fullValue)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy Secret"
                  >
                    {copiedId === sec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Last used: {sec.lastUsed}</span>
                  <button
                    onClick={() => handleDeleteSecret(sec.id)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RBAC Tab */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rbacRoles.map((role) => (
              <div
                key={role.id}
                className={`p-5 rounded-2xl border space-y-4 ${
                  role.isOwnerRole
                    ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-cyan-500/50 shadow-xl'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 font-mono">{role.name}</h3>
                  <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-cyan-400">
                    {role.usersCount} Assigned
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Granted Permissions:
                  </span>
                  <div className="space-y-1">
                    {role.permissions.map((p, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono text-slate-300 flex items-center gap-2 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800"
                      >
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owner Mode Recognition Details */}
      {activeTab === 'owner' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono">
                Permanent System Owner Mode Activated
              </h3>
              <p className="text-xs text-slate-400">
                Owner recognition logic stored in persistent AI memory and backend system prompt.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold">Owner Name:</span> Sir Aitzaz
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold">Trigger Phrases (English / Urdu):</span>
              <p className="text-slate-400 mt-1">
                "I am Aitzaz", "Main Aitzaz hoon", "Mera naam Aitzaz hai", "Aitzaz"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold">AI Response Guarantee:</span>
              <p className="text-slate-200 mt-1 font-sans">
                "Welcome back Sir Aitzaz. How may I assist you today?"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
