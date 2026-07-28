import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
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
