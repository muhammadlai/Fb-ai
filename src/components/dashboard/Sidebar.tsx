"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  FileText,
  Calendar,
  Clock,
  BarChart3,
  Share2,
  Users,
  CreditCard,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

interface SidebarProps {
  user: any;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/composer", label: "AI Post Composer", icon: PenTool, highlight: true },
    { href: "/dashboard/posts", label: "Posts & Drafts", icon: FileText },
    { href: "/dashboard/calendar", label: "Schedule Calendar", icon: Calendar },
    { href: "/dashboard/queue", label: "Queue Automation", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics & ROI", icon: BarChart3 },
    { href: "/dashboard/accounts", label: "Connected Accounts", icon: Share2 },
    { href: "/dashboard/team", label: "Team Workspaces", icon: Users },
    { href: "/dashboard/billing", label: "Billing & Plans", icon: CreditCard },
  ];

  if (user?.role === "admin") {
    links.push({ href: "/dashboard/admin", label: "Admin Console", icon: ShieldAlert });
  }

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-base font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              SocialAI
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Meta Graph Engine
            </span>
          </div>
        </div>

        {/* Create Post Action */}
        <Link
          href="/dashboard/composer"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Post</span>
        </Link>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Meta Graph API Policy Banner */}
      <div className="p-4 m-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200 mb-1">
          <Share2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Meta Graph Compliant</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Official OAuth 2.0 & encrypted tokens compliant with Meta Platform Policies v19.0.
        </p>
      </div>
    </aside>
  );
}
