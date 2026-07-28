"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Share2,
  Calendar,
  Clock,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Layers,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SocialAI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#meta-api" className="hover:text-white transition">Meta Graph v19.0</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition"
          >
            Log In
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Next-Gen AI Social Media Management Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
          Automate Facebook Pages & Social Channels with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Predictive AI Intelligence
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Official Meta Graph API integration. Schedule posts, generate high-converting captions, manage custom queue slots, collaborate with teams, and analyze ROI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Try SocialAI Workspace Free</span>
          </Link>

          <Link
            href="/login"
            className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-sm flex items-center gap-2 transition"
          >
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>Connect Facebook Page</span>
          </Link>
        </div>

        {/* Floating Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Meta Graph API Policy Banner */}
      <section id="meta-api" className="py-12 bg-slate-900/60 border-y border-slate-800/80 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Official Meta Platform Policies Compliant
            </div>
            <h3 className="text-lg font-extrabold text-white">Meta Graph API v19.0 Standard</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Authenticates using official Facebook OAuth 2.0 with granular permissions (`pages_show_list`, `pages_manage_posts`, `pages_read_engagement`).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 Token Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold">All-In-One Social Automation Suite</h2>
          <p className="text-xs text-slate-400">Designed for agencies, brands, and modern marketing teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">AI Copywriter & Hashtag Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate platform-optimized post captions with custom brand tone, call-to-actions, and trending hashtags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Queue Slot Automation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define daily posting slots for each connected Facebook Page. Queue posts effortlessly with automatic slot distribution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Predictive Analytics & ROI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track impressions, unique reach, likes, comments, and engagement rates with downloadable reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 SocialAI Platform. All rights reserved. Meta & Facebook are trademarks of Meta Platforms, Inc.</p>
      </footer>
    </div>
  );
}
