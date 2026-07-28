"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Lock,
  RefreshCw,
  UserCircle,
  Flag,
} from "lucide-react";

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("error") || "";
  });

  useEffect(() => {
    let active = true;

    async function loadAccounts() {
      try {
        setLoading(true);
        const res = await fetch("/api/accounts");
        const data = await res.json();
        if (active && data.accounts) {
          setAccounts(data.accounts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccounts();

    return () => {
      active = false;
    };
  }, []);

  const handleConnectFacebookOAuth = async () => {
    try {
      setConnecting(true);
      setErrorMsg("");
      const res = await fetch("/api/auth/facebook");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize Facebook OAuth");
      }

      if (data.url) {
        window.location.assign(data.url);
      } else {
        setErrorMsg("Failed to initialize Meta OAuth URL");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to initialize Facebook OAuth");
      setConnecting(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this Facebook account or Page?")) return;
    try {
      await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      setAccounts(accounts.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const facebookAccount = accounts.find((acc) => acc.platform === "facebook_user");
  const facebookPages = accounts.filter((acc) => acc.platform === "facebook_page");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-600" /> Facebook Account & Pages
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect a real Facebook account, fetch managed Pages from Graph API, and store tokens with AES-256 encryption.
          </p>
        </div>

        <button
          onClick={handleConnectFacebookOAuth}
          disabled={connecting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition disabled:opacity-60"
        >
          {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
          <span>{connecting ? "Opening Facebook..." : "Reconnect Facebook OAuth"}</span>
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
              Real Facebook OAuth + AES-256 Access Token Encryption
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">
                No Demo Tokens
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              User and Page access tokens are encrypted before storage and are never returned by the API.
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

      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Connected Facebook Account</h3>
            {facebookAccount ? (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {facebookAccount.avatarUrl ? (
                    <img
                      src={facebookAccount.avatarUrl}
                      alt={facebookAccount.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-900"
                    />
                  ) : (
                    <UserCircle className="w-14 h-14 text-slate-400" />
                  )}
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{facebookAccount.name}</h4>
                    <p className="text-xs text-slate-500">{facebookAccount.username || "Facebook profile connected"}</p>
                    <p className="text-[10px] text-slate-400">Facebook ID: {facebookAccount.platformId}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                <UserCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No Facebook account connected yet.</p>
                <button
                  onClick={handleConnectFacebookOAuth}
                  disabled={connecting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] text-white font-bold text-xs disabled:opacity-60"
                >
                  {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                  Continue with Facebook
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Facebook Pages from Graph API</h3>

            {facebookPages.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                <Flag className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No Facebook Pages returned yet.</p>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Reconnect Facebook and approve the Page permissions. Your Meta app must have Page permissions approved for production users.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facebookPages.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {acc.avatarUrl ? (
                          <img
                            src={acc.avatarUrl}
                            alt={acc.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                          />
                        ) : (
                          <Flag className="w-12 h-12 text-slate-400" />
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</h4>
                          <p className="text-[11px] text-slate-400">{acc.category || "Facebook Page"}</p>
                          <p className="text-[10px] text-slate-500">{acc.followersCount?.toLocaleString()} followers</p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Connected
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[10px]">Page ID: {acc.platformId}</span>
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
        </>
      )}
    </div>
  );
}
