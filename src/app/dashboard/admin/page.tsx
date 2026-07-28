"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Users,
  Key,
  Database,
  Activity,
  CheckCircle2,
  RefreshCw,
  Save,
} from "lucide-react";

export default function AdminConsolePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Meta App Credentials Form
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [environment, setEnvironment] = useState("sandbox");
  const [webhookToken, setWebhookToken] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin");
      const json = await res.json();
      if (res.ok) {
        setData(json);
        if (json.metaSettings) {
          setAppId(json.metaSettings.appId || "");
          setEnvironment(json.metaSettings.environment || "sandbox");
          setWebhookToken(json.metaSettings.webhookVerifyToken || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetaConfig = async () => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_meta_config",
          appId,
          appSecret,
          environment,
          webhookVerifyToken: webhookToken,
        }),
      });

      if (res.ok) {
        setStatusMsg("Meta App Credentials updated successfully!");
        setAppSecret("");
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || { totalUsers: 0, mrr: 0, totalConnectedAccounts: 0, totalPostsCount: 0 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-600" /> Platform Admin Control Console
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage system users, Meta OAuth App ID/Secret, Stripe plans, and system logs.
        </p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalUsers}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated MRR</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${stats.mrr}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Accounts</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalConnectedAccounts}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Posts</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalPostsCount}</p>
        </div>
      </div>

      {/* Meta OAuth Configuration Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-500" /> Meta Graph OAuth Application Keys
          </h3>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded uppercase">
            Graph API v19.0
          </span>
        </div>

        {statusMsg && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{statusMsg}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Facebook App ID</label>
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="e.g., 782910384759201"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Facebook App Secret (AES Encrypted)
            </label>
            <input
              type="password"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              placeholder={data?.metaSettings?.appSecretMasked || "Enter new app secret..."}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Environment Mode</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <option value="sandbox">Sandbox (Development / Demo Simulation)</option>
              <option value="live">Live Meta Production Mode</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Webhook Verify Token</label>
            <input
              type="text"
              value={webhookToken}
              onChange={(e) => setWebhookToken(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveMetaConfig}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Meta Settings
          </button>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Registered Users</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Subscription</th>
                <th className="pb-3">AI Credits Used</th>
                <th className="pb-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {(data?.users || []).map((u: any) => (
                <tr key={u.id}>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{u.name} ({u.email})</td>
                  <td className="py-3 uppercase font-bold text-purple-600">{u.role}</td>
                  <td className="py-3 uppercase font-bold text-emerald-600">{u.subscriptionTier}</td>
                  <td className="py-3">{u.aiCreditsUsed} / {u.aiCreditsLimit}</td>
                  <td className="py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
