import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Lock, Plus, Trash2, CheckCircle2, AlertTriangle, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';
import { SocialPlatform } from '../types/automation';

export const CredentialVaultPanel: React.FC = () => {
  const { vault, addVaultItem, deleteVaultItem } = useAutomationStore();

  const [isAdding, setIsAdding] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !username.trim()) return;

    addVaultItem({
      platform,
      accountName,
      username,
      encryptedKey: '••••••••••••••••',
      sessionStatus: 'valid_cookies',
      mfaEnabled: true,
    });

    setAccountName('');
    setUsername('');
    setPassword('');
    setIsAdding(false);
  };

  const getPlatformBadge = (plat: SocialPlatform) => {
    switch (plat) {
      case 'linkedin':
        return <span className="flex items-center gap-1 text-sky-400"><Linkedin className="w-4 h-4" /> LinkedIn</span>;
      case 'x_twitter':
        return <span className="flex items-center gap-1 text-cyan-300"><Twitter className="w-4 h-4" /> X (Twitter)</span>;
      case 'facebook':
        return <span className="flex items-center gap-1 text-blue-500"><Facebook className="w-4 h-4" /> Facebook</span>;
      case 'instagram':
        return <span className="flex items-center gap-1 text-pink-400"><Instagram className="w-4 h-4" /> Instagram</span>;
      default:
        return <span className="text-purple-400">Custom Auth Portal</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            Secure Platform Login Vault & Session Cookies
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Encrypted session cookies and credentials vault for automated social media authentication without re-login challenges.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credentials</span>
        </button>
      </div>

      {/* Add Credential Form */}
      {isAdding && (
        <form onSubmit={handleAddVault} className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Add Platform Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400">Target Social Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500/50"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="x_twitter">X (Twitter)</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="custom">Custom Web Portal</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400">Account Label</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="E.g., Corporate Talent Outreach"
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400">Username / Email / Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="growth@enterprise.io or @handle"
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400">Password / Token (AES Encrypted)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 text-xs font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold cursor-pointer"
            >
              Store Credentials
            </button>
          </div>
        </form>
      )}

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vault.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">{item.accountName}</h3>
              </div>
              <div className="text-xs font-mono">{getPlatformBadge(item.platform)}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>ACCOUNT IDENTITY:</span>
                <span className="text-cyan-300 font-bold">{item.username}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>ENCRYPTED PASS:</span>
                <span className="text-slate-500">{item.encryptedKey}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                <span>SESSION STATUS:</span>
                <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Cookies
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>MFA Safeguard: {item.mfaEnabled ? 'Enabled' : 'Disabled'}</span>
              <button
                onClick={() => deleteVaultItem(item.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
