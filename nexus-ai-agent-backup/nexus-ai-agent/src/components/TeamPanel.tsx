import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Building2,
  Mail,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  Lock,
  Plus,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { TeamMember, Organization } from '../types';
import { TEAM_MEMBERS, ORGANIZATIONS } from '../data/mockData';

export const TeamPanel: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [orgs, setOrgs] = useState<Organization[]>(ORGANIZATIONS);
  const [selectedOrgId, setSelectedOrgId] = useState('org_nexus');
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  const currentOrg = orgs.find((o) => o.id === selectedOrgId) || orgs[0];

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
      lastActive: 'Pending Acceptance',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
    };
    setMembers([newMember, ...members]);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName) return;
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: newOrgName,
      plan: 'Pro',
      members_count: 1,
      api_calls_this_month: 0,
      owner_email: 'aitzazji91@gmail.com',
      created_at: new Date().toISOString().split('T')[0],
    };
    setOrgs([...orgs, newOrg]);
    setSelectedOrgId(newOrg.id);
    setNewOrgName('');
    setIsCreateOrgOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              Team & Organization Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage organizations, invite team members, configure enterprise RBAC permissions, and track active seats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOrgOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:border-purple-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>New Organization</span>
          </button>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Organization Switcher Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-sm">
            {currentOrg.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">{currentOrg.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                {currentOrg.plan} Plan
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
              <span>Owner: {currentOrg.owner_email}</span>
              <span>•</span>
              <span>Created: {currentOrg.created_at}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-purple-500/40"
          >
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.plan})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roles & Permissions Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { role: 'Owner', count: '1 User', desc: 'Full billing, security, and team admin capabilities', color: 'from-amber-500 to-orange-500' },
          { role: 'Admin', count: '1 User', desc: 'Can invite members, manage agents, and generate API keys', color: 'from-purple-500 to-indigo-500' },
          { role: 'Member', count: '2 Users', desc: 'Can run workflows, execute chats, and build knowledge bases', color: 'from-cyan-500 to-blue-500' },
          { role: 'Viewer', count: '0 Users', desc: 'Read-only access to analytics, logs, and dashboard metrics', color: 'from-slate-500 to-slate-700' },
        ].map((card) => (
          <div
            key={card.role}
            className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${card.color}`}>
                  {card.role} Role
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {card.count}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
            <div className="mt-3 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Configured in RBAC Policy
            </div>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Team Members ({filteredMembers.length})</h3>
            <p className="text-xs text-slate-400">Manage seat assignments and access control for this workspace.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member or email..."
              className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
                      />
                      <div>
                        <div className="font-semibold text-slate-100">{m.name}</div>
                        <div className="text-[11px] text-slate-400">{m.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        m.role === 'Owner'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : m.role === 'Admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    {m.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Seat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Invite Sent
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {m.lastActive}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {m.role !== 'Owner' && (
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Revoke Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                Invite Team Member
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full bg-slate-950 text-slate-100 text-xs border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-slate-950 text-slate-100 text-xs border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Admin">Admin (Can manage agents & keys)</option>
                  <option value="Member">Member (Can run chats & workflows)</option>
                  <option value="Viewer">Viewer (Read-only dashboards)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Org Modal */}
      {isCreateOrgOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                Create New Organization
              </h3>
              <button onClick={() => setIsCreateOrgOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Acme AI Corp"
                  className="w-full bg-slate-950 text-slate-100 text-xs border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOrgOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
