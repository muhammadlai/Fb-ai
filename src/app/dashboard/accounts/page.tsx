"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  RefreshCw,
} from "lucide-react";

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAccounts();

    const params = new URLSearchParams(window.location.search);
    if (params.get("connected")) {
      setErrorMsg("");
    }
    if (params.get("error")) {
      setErrorMsg(params.get("error") || "OAuth authorization failed");
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/accounts");
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectFacebookOAuth = async () => {
    try {
      setConnecting(true);
      const res = await fetch("/api/auth/facebook");
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("Failed to initialize Meta OAuth URL");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectDemoPage = async (platform: string, name: string) => {
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          name,
          username: `@${name.toLowerCase().replace(/\s+/g, "")}`,
          category: "Business",
        }),
      });
      const data = await res.json();
      if (data.account) {
        setAccounts([...accounts, data.account]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;
    try {
      await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      setAccounts(accounts.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-600" /> Social Channels & Meta OAuth
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect Facebook Pages, Instagram, and social channels with AES-256 token encryption.
          </p>
        </div>

        <button
          onClick={handleConnectFacebookOAuth}
          disabled={connecting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition"
        >
          {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
          <span>Connect via Official Facebook OAuth</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-extrabold flex items-center gap-2">
              AES-256 Access Token Encryption Active
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">
                Meta Compliant
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              Page access tokens are encrypted with military-grade AES-256 prior to database storage.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Connected Channels List */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Social Channels</h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Share2 className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No accounts connected yet.</p>
            <button
              onClick={handleConnectFacebookOAuth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Connect Facebook Page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80"}
                      alt={acc.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{acc.platform.replace("_", " ")}</p>
                      <p className="text-[10px] text-slate-500">{acc.followersCount?.toLocaleString()} followers</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">ID: {acc.platformId}</span>
                  <button
                    onClick={() => handleDisconnect(acc.id)}
                    className="text-slate-400 hover:text-red-600 transition text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Connect Sandbox Preset Accounts */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Sandbox & Demo Account Shortcuts
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleConnectDemoPage("facebook_page", "Acme Enterprise Facebook")}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            + Connect Demo Facebook Page
          </button>
          <button
            onClick={() => handleConnectDemoPage("instagram", "Acme Design IG Business")}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            + Connect Demo Instagram Business
          </button>
          <button
            onClick={() => handleConnectDemoPage("linkedin", "Acme LinkedIn Organization")}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            + Connect Demo LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}
