"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  Sparkles,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MoreVertical,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function PostsManagerPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts?status=${activeTab}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      setPosts(posts.filter((p) => p.post.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter((item) =>
    item.post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Posts & Drafts Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your published, scheduled, queued, and draft posts in one place.
          </p>
        </div>

        <Link
          href="/dashboard/composer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
          {["all", "published", "scheduled", "queued", "draft", "pending_approval"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search post text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Posts List Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No posts found matching filter.</p>
          <Link
            href="/dashboard/composer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create New Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((item) => {
            const p = item.post;
            const acc = item.account;
            const pa = item.analytics;

            return (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {acc && (
                      <img
                        src={acc.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80"}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {acc?.name || "Connected Social Account"}
                      </h4>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {acc?.platform?.replace("_", " ") || "Facebook"} • Created {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        p.status === "published"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : p.status === "scheduled" || p.status === "queued"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {p.status}
                    </span>
                    <button
                      onClick={() => handleDeletePost(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {p.content}
                </p>

                {p.mediaUrls && p.mediaUrls.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-48 w-full sm:w-72">
                    <img src={p.mediaUrls[0]} alt="Post Media" className="w-full h-48 object-cover" />
                  </div>
                )}

                {/* Published Post Stats */}
                {p.status === "published" && pa && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                    <div><span className="font-bold text-slate-900 dark:text-white">{pa.impressions}</span> Impressions</div>
                    <div><span className="font-bold text-slate-900 dark:text-white">{pa.reach}</span> Reach</div>
                    <div><span className="font-bold text-slate-900 dark:text-white">{pa.likes}</span> Likes</div>
                    <div><span className="font-bold text-slate-900 dark:text-white">{pa.comments}</span> Comments</div>
                    <div><span className="font-bold text-emerald-600 dark:text-emerald-400">{pa.engagementRate}%</span> Engagement Rate</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
