"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  ThumbsUp,
  Share2,
  MousePointer,
  Sparkles,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = data?.metrics || {
    totalFollowers: 85500,
    totalImpressions: 18450,
    totalReach: 14200,
    totalEngagements: 1240,
    avgEngagementRate: "5.4%",
  };

  const trendData = data?.reachTrend || [
    { day: "Mon", impressions: 1400, reach: 1100, engagement: 180 },
    { day: "Tue", impressions: 2100, reach: 1650, engagement: 240 },
    { day: "Wed", impressions: 3200, reach: 2400, engagement: 410 },
    { day: "Thu", impressions: 2800, reach: 2100, engagement: 310 },
    { day: "Fri", impressions: 3900, reach: 2900, engagement: 520 },
    { day: "Sat", impressions: 2300, reach: 1800, engagement: 290 },
    { day: "Sun", impressions: 2700, reach: 2200, engagement: 340 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Meta & Social Analytics Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time performance metrics, audience reach, and engagement insights.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading PDF Analytics Report...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <Download className="w-4 h-4" /> Export Report (PDF)
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reach</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalReach?.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% vs last week
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Impressions</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalImpressions?.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +22.1% viral score
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Engagements</span>
            <ThumbsUp className="w-4 h-4 text-pink-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalEngagements?.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Likes, Comments & Shares</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement Rate</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {metrics.avgEngagementRate}
          </p>
          <p className="text-xs text-slate-500">Top 5% in SaaS Industry</p>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Weekly Impressions & Reach Growth
          </h3>
          <span className="text-xs font-semibold text-slate-400">Last 7 Days</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorImp)" />
              <Area type="monotone" dataKey="reach" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Performance Audit Insights */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-slate-900/20 border border-purple-500/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-extrabold text-sm">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>AI Audience Audit Recommendations</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Best Posting Time</span>
            <p className="text-slate-500">Wednesdays at 2:15 PM PST generated 42% higher comments.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Top Media Format</span>
            <p className="text-slate-500">Short MP4 video posts got 2.8x more shares than static photos.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Top Performing Hashtags</span>
            <p className="text-slate-500">#SaaS #AIMarketing driving 65% of external search reach.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
