import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialAI Hub | Premium Social Media Management & Meta Graph API Automation",
  description:
    "AI-Powered Social Media Management Platform for Facebook Pages, Instagram, and LinkedIn. Schedule, queue, generate AI posts, and analyze growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        {/* SessionProvider powers useSession()/signIn()/signOut() in client components. */}
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
