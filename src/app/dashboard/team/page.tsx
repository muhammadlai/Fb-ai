"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Shield, Trash2, Mail, CheckCircle2, Clock } from "lucide-react";

export default function TeamCollaborationPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (res.ok) {
        setStatusMsg(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove team member?")) return;
    try {
      await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      setMembers(members.filter((m) => m.memberId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" /> Team Workspaces & Permissions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Collaborate with marketers, content creators, and clients with granular role controls.
        </p>
      </div>

      {/* Invite Member Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-indigo-500" /> Invite Team Member
        </h3>

        {statusMsg && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{statusMsg}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 sm:col-span-1"
          />

          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="admin">Workspace Admin</option>
            <option value="editor">Editor (Can create & schedule)</option>
            <option value="viewer">Viewer (Read-only)</option>
          </select>

          <button
            onClick={handleInvite}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
          >
            Send Invite
          </button>
        </div>
      </div>

      {/* Team Members List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Workspace Members ({members.length})</h3>

        <div className="space-y-3">
          {members.map((m) => (
            <div
              key={m.memberId}
              className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"}
                  alt="Member"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.user?.name || m.invitedEmail}
                  </h4>
                  <p className="text-[10px] text-slate-400">{m.user?.email || m.invitedEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {m.role}
                </span>

                {m.role !== "owner" && (
                  <button
                    onClick={() => handleRemove(m.memberId)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
