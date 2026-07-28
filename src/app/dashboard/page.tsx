"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Share2,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  Zap,
} from "lucide-react";

export default function OverviewDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, accountsRes, postsRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/accounts"),
        fetch("/api/posts"),
      ]);

      const analyticsData = await analyticsRes.json();
      const accountsData = await accountsRes.json();
      const postsData = await postsRes.json();

      setMetrics(analyticsData.metrics || {});
      setAccounts(accountsData.accounts || []);
      setRecentPosts((postsData.posts || []).slice(0, 5));
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading SocialAI Workspace...</p>
        </div>
      </div>
    );
  }

  const scheduledCount = recentPosts.filter((p) => p.post.status === "scheduled" || p.post.status === "queued").length;
  const publishedCount = metrics?.totalPostsCount || recentPosts.filter((p) => p.post.status === "published").length;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Meta Graph v19.0 API Engine Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome to SocialAI Control Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Schedule, generate AI captions, manage Facebook Pages and social accounts with automated queue slots and predictive analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/composer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Compose AI Post</span>
            </Link>
            <Link
              href="/dashboard/accounts"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Connect Pages</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Followers</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalFollowers?.toLocaleString() || "85,500"}
          </p>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalImpressions?.toLocaleString() || "18,450"}
          </p>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.2% reach boost
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Published Posts</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{publishedCount}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Across {accounts.length} channels</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled & Queued</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{scheduledCount}</p>
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Next publish in 3 hours</p>
        </div>
      </div>

      {/* Main Content Split: Connected Accounts & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connected Channels */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Connected Pages</h3>
            <Link
              href="/dashboard/accounts"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {accounts.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                <Share2 className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">No social pages connected yet.</p>
                <Link
                  href="/dashboard/accounts"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Connect Facebook Page
                </Link>
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80"}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                        {acc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                        {acc.platform.replace("_", " ")} • {acc.followersCount?.toLocaleString()} fans
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent & Queued Posts Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Post Activities</h3>
            <Link
              href="/dashboard/posts"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View All Posts <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">No recent posts found.</p>
                <Link
                  href="/dashboard/composer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Create First Post
                </Link>
              </div>
            ) : (
              recentPosts.map((item) => {
                const p = item.post;
                const acc = item.account;
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-2">
                        {acc && (
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                            {acc.name}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            p.status === "published"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                              : p.status === "scheduled" || p.status === "queued"
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                        {p.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 self-end sm:self-center">
                      {p.status === "published" && item.analytics && (
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.analytics.impressions}
                          </span>{" "}
                          views
                        </div>
                      )}
                      {p.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(p.scheduledAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
