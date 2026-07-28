"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Share2, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@socialai.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookOAuth = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/facebook");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              SocialAI
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-white">Log in to SocialAI Control Hub</h2>
          <p className="text-xs text-slate-400">Manage your Facebook Pages and AI social campaigns</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
          {/* Official Facebook Login Button */}
          <button
            onClick={handleFacebookOAuth}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Log in with Official Facebook OAuth</span>
          </button>

          <div className="relative flex items-center justify-center">
            <span className="bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 z-10">
              Or email credentials
            </span>
            <div className="absolute inset-0 border-t border-slate-800" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Log In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Instant Demo Account
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail("demo@socialai.com");
                  setPassword("password123");
                  handleLogin();
                }}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px]"
              >
                1-Click Demo Login
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Pre-loaded with Facebook Pages, AI credits, and scheduled posts.</p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
