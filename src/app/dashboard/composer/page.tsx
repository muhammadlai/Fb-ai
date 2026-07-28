"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  Calendar,
  Clock,
  Send,
  Share2,
  ThumbsUp,
  MessageSquare,
  Share,
  Wand2,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Hash,
  RefreshCw,
  Eye,
  Paperclip,
} from "lucide-react";

export default function PostComposerPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<string>("none");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Action Mode
  const [action, setAction] = useState<string>("publish_now"); // 'publish_now' | 'schedule' | 'queue' | 'draft' | 'submit_review'
  const [scheduledAt, setScheduledAt] = useState<string>("");

  // AI Modal & Panel States
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState<any>("engaging");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [suggestedHashtags, setSuggestedHashtags] = useState<any[]>([]);

  // Preview Mode
  const [previewPlatform, setPreviewPlatform] = useState<string>("facebook");

  // Publishing Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      if (data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
        setSelectedAccountId(data.accounts[0].id);
      }
    } catch (err) {
      console.error("Accounts fetch error:", err);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  // Handle AI Post Generation
  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) {
      setStatusMessage({ type: "error", msg: "Please enter a topic or subject for AI post generation" });
      return;
    }

    try {
      setIsAILoading(true);
      setStatusMessage(null);

      const res = await fetch("/api/posts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_post",
          topic: aiTopic,
          tone: aiTone,
          platform: previewPlatform,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI generation failed");
      }

      if (data.data) {
        setContent(data.data.caption || "");
        if (data.data.hashtags) {
          setHashtags(data.data.hashtags);
        }
        setShowAIPanel(false);
        setStatusMessage({ type: "success", msg: "AI Content generated successfully!" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: err.message });
    } finally {
      setIsAILoading(false);
    }
  };

  // Handle AI Hashtags
  const handleGenerateHashtags = async () => {
    if (!content.trim() && !aiTopic.trim()) return;
    try {
      const res = await fetch("/api/posts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hashtags",
          keyword: aiTopic || content.slice(0, 30),
        }),
      });
      const data = await res.json();
      if (data.data?.hashtags) {
        setSuggestedHashtags(data.data.hashtags);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle AI Text Improvement
  const handleImproveText = async (type: string) => {
    if (!content) return;
    try {
      setIsAILoading(true);
      const res = await fetch("/api/posts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "improve_text",
          text: content,
          improvementType: type,
        }),
      });
      const data = await res.json();
      if (data.data?.text) {
        setContent(data.data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Handle Media URL Addition
  const handleAddMedia = (url: string, type: "image" | "video") => {
    setMediaUrls([url]);
    setMediaType(type);
  };

  // Submit Post Action
  const handleSubmitPost = async () => {
    if (!selectedAccountId) {
      setStatusMessage({ type: "error", msg: "Please select a social page to post to." });
      return;
    }
    if (!content.trim()) {
      setStatusMessage({ type: "error", msg: "Post content cannot be empty." });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectedAccountId: selectedAccountId,
          content,
          mediaUrls,
          mediaType,
          action,
          scheduledAt: action === "schedule" ? scheduledAt : undefined,
          hashtags,
          aiTone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process post");
      }

      if (action === "publish_now") {
        if (data.post.status === "published") {
          setStatusMessage({
            type: "success",
            msg: "🎉 Post published live to Facebook Page via Meta Graph API!",
          });
          setContent("");
          setMediaUrls([]);
        } else {
          setStatusMessage({
            type: "error",
            msg: data.post.errorMessage || "Failed to publish post via Graph API",
          });
        }
      } else {
        setStatusMessage({
          type: "success",
          msg: `Post successfully set to [${action}] status!`,
        });
        setContent("");
        setMediaUrls([]);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            AI Post Composer Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Craft, preview, and publish multi-channel social media posts with Meta Graph API compliance.
          </p>
        </div>

        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-purple-500 hover:to-indigo-500 transition"
        >
          <Wand2 className="w-4 h-4" />
          <span>{showAIPanel ? "Close AI Writer" : "AI Content Generator"}</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.msg}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AI Writer Expandable Panel */}
      {showAIPanel && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 via-indigo-900/10 to-slate-900/20 border border-purple-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-purple-600 dark:text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Social Copywriter Engine
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">1 Credit / Prompt</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Post Topic / Brief</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Top 5 AI strategies for Facebook page engagement in 2026..."
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800"
              >
                <option value="engaging">Engaging & Friendly</option>
                <option value="professional">Professional & Corporate</option>
                <option value="playful">Playful & Casual</option>
                <option value="educational">Educational & Masterclass</option>
                <option value="persuasive">Persuasive & Sales</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleAIGenerate}
              disabled={isAILoading}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isAILoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Generate Copy & Hashtags</span>
            </button>
          </div>
        </div>
      )}

      {/* Workspace Grid: Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Editor (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Account Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Publishing Channel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                    selectedAccountId === acc.id
                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={acc.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80"}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{acc.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{acc.platform.replace("_", " ")}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Editor */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Post Caption</label>
              <span className={`text-xs font-semibold ${content.length > 2000 ? "text-red-500" : "text-slate-400"}`}>
                {content.length} / 2,200 chars
              </span>
            </div>

            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share with your audience? Write here or use AI Copywriter..."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />

            {/* AI Assistant Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3" /> AI Quick Actions:
              </span>
              <button
                onClick={() => handleImproveText("engaging")}
                className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-semibold hover:bg-purple-100 transition"
              >
                🔥 Make Engaging
              </button>
              <button
                onClick={() => handleImproveText("shorten")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-slate-200 transition"
              >
                ✂️ Shorten
              </button>
              <button
                onClick={() => handleImproveText("add_emojis")}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-semibold hover:bg-amber-100 transition"
              >
                ✨ Add Emojis
              </button>
              <button
                onClick={handleGenerateHashtags}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 transition"
              >
                # Generate Hashtags
              </button>
            </div>

            {/* Suggested Hashtags */}
            {suggestedHashtags.length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs">
                <p className="font-bold text-blue-900 dark:text-blue-300 text-[11px]">Suggested Hashtags (Click to add):</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedHashtags.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!content.includes(item.hashtag)) {
                          setContent((prev) => prev + " " + item.hashtag);
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-[11px] font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition"
                    >
                      {item.hashtag} <span className="text-[9px] text-slate-400">({item.relevance})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Media Attachments */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Media Attachments</label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  handleAddMedia("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&fit=crop&q=80", "image")
                }
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold hover:border-indigo-500 transition"
              >
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                <span>Add Stock Photo</span>
              </button>

              <button
                onClick={() =>
                  handleAddMedia("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "video")
                }
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold hover:border-indigo-500 transition"
              >
                <VideoIcon className="w-4 h-4 text-purple-500" />
                <span>Add Video</span>
              </button>
            </div>

            {mediaUrls.length > 0 && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 group">
                {mediaType === "video" ? (
                  <video src={mediaUrls[0]} controls className="w-full h-48 object-cover" />
                ) : (
                  <img src={mediaUrls[0]} alt="Media preview" className="w-full h-48 object-cover" />
                )}
                <button
                  onClick={() => {
                    setMediaUrls([]);
                    setMediaType("none");
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action & Scheduling Options */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Publishing Mode</label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setAction("publish_now")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  action === "publish_now"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                ⚡ Publish Now
              </button>
              <button
                onClick={() => setAction("schedule")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  action === "schedule"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                📅 Schedule
              </button>
              <button
                onClick={() => setAction("queue")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  action === "queue"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                ⏰ Add to Queue
              </button>
              <button
                onClick={() => setAction("draft")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  action === "draft"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                💾 Save Draft
              </button>
            </div>

            {action === "schedule" && (
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}

            {/* Execute Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmitPost}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>
                  {action === "publish_now"
                    ? "Publish Live to Facebook Page"
                    : action === "schedule"
                    ? "Confirm Post Schedule"
                    : action === "queue"
                    ? "Queue Post automatically"
                    : "Save Post Draft"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Multi-Channel Live Card Preview (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-500" /> Multi-Platform Preview Card
            </h3>
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setPreviewPlatform("facebook")}
                className={`px-2.5 py-1 rounded-md transition ${
                  previewPlatform === "facebook" ? "bg-white dark:bg-slate-900 text-blue-600 shadow" : "text-slate-500"
                }`}
              >
                Facebook
              </button>
              <button
                onClick={() => setPreviewPlatform("instagram")}
                className={`px-2.5 py-1 rounded-md transition ${
                  previewPlatform === "instagram" ? "bg-white dark:bg-slate-900 text-pink-600 shadow" : "text-slate-500"
                }`}
              >
                Instagram
              </button>
            </div>
          </div>

          {/* Realistic Facebook Post Preview Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
              <img
                src={selectedAccount?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80"}
                alt="Account"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedAccount?.name || "Your Facebook Page"}
                </h4>
                <p className="text-[10px] text-slate-400">Just now • Published via SocialAI</p>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {content || "Your post text preview will appear here as you type in the editor..."}
              </p>

              {/* Media Preview */}
              {mediaUrls.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 mt-2">
                  {mediaType === "video" ? (
                    <video src={mediaUrls[0]} controls className="w-full h-56 object-cover" />
                  ) : (
                    <img src={mediaUrls[0]} alt="Media Preview" className="w-full h-56 object-cover" />
                  )}
                </div>
              )}
            </div>

            {/* Card Actions Footer */}
            <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
