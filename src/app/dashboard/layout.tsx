import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

/**
 * Server-side auth gate for every /dashboard route.
 *
 * This is the single source of truth for dashboard authorization. There is
 * deliberately no `proxy.ts` / `middleware.ts`:
 *   - a proxy could never be more than a cookie-presence check anyway, and
 *   - Next.js 16 proxies run on the Node.js runtime, which the Cloudflare
 *     Workers adapter rejects ("Node.js middleware is not currently
 *     supported"), breaking that deployment target.
 *
 * Checking here keeps Vercel and Cloudflare identical and guarantees the
 * session is actually valid rather than merely present.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    // Preserve the requested page so login can send the user back to it.
    const headerList = await headers();
    const pathname =
      headerList.get("x-invoke-path") ||
      headerList.get("next-url") ||
      "/dashboard";
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar user={user} />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
