"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, Sparkles, Zap } from "lucide-react";

/** Official Facebook "f" glyph - lucide v1 no longer ships brand icons. */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.931-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

/** Maps Auth.js error codes to messages a user can act on. */
function humanizeError(code?: string): string {
  if (!code) return "";
  switch (code) {
    case "CredentialsSignin":
      return "Invalid email or password.";
    case "OAuthAccountNotLinked":
      return "That email is already registered with a different sign-in method.";
    case "OAuthSignin":
    case "OAuthCallback":
      return "Could not reach Facebook. Please try again.";
    case "AccessDenied":
      return "Access denied. You cancelled the Facebook prompt or the app lacks permission.";
    case "Configuration":
      return "Authentication is not configured correctly. Check the server environment variables.";
    default:
      return code;
  }
}

interface AuthFormProps {
  mode: "login" | "register";
  facebookEnabled: boolean;
  callbackUrl: string;
  initialError?: string;
}

export function AuthForm({ mode, facebookEnabled, callbackUrl, initialError }: AuthFormProps) {
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(isRegister ? "" : "demo@socialai.com");
  const [password, setPassword] = useState(isRegister ? "" : "password123");
  const [loading, setLoading] = useState<"credentials" | "facebook" | null>(null);
  const [errorMsg, setErrorMsg] = useState(humanizeError(initialError));

  const submitCredentials = async (e?: React.FormEvent, override?: { email: string; password: string }) => {
    e?.preventDefault();
    const creds = override ?? { email, password };

    try {
      setLoading("credentials");
      setErrorMsg("");

      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: creds.email, password: creds.password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Registration failed");
      }

      // `redirect: false` lets us surface the error inline instead of bouncing
      // to Auth.js' own error page.
      const result = await signIn("credentials", {
        email: creds.email,
        password: creds.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) throw new Error(humanizeError(result.error));
      window.location.href = result?.url || callbackUrl;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  const handleFacebook = async () => {
    setLoading("facebook");
    setErrorMsg("");
    // Full-page redirect to Facebook; Auth.js handles the callback.
    await signIn("facebook", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              SocialAI
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-white">
            {isRegister ? "Create your SocialAI account" : "Log in to SocialAI Control Hub"}
          </h2>
          <p className="text-xs text-slate-400">
            Manage your Facebook Pages and AI social campaigns
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
          {facebookEnabled ? (
            <button
              type="button"
              onClick={handleFacebook}
              disabled={loading !== null}
              className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>
                {loading === "facebook" ? "Redirecting to Facebook..." : "Continue with Facebook"}
              </span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-300">Facebook Login is not configured.</span>{" "}
              Set <code className="text-indigo-300">AUTH_FACEBOOK_ID</code> and{" "}
              <code className="text-indigo-300">AUTH_FACEBOOK_SECRET</code> in your environment to
              enable it.
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <span className="bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 z-10">
              Or email credentials
            </span>
            <div className="absolute inset-0 border-t border-slate-800" />
          </div>

          <form onSubmit={submitCredentials} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-bold text-slate-300">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={isRegister ? 6 : undefined}
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>
                {loading === "credentials"
                  ? isRegister
                    ? "Creating account..."
                    : "Authenticating..."
                  : isRegister
                    ? "Create Account"
                    : "Log In"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {!isRegister && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Instant Demo Account
                </span>
                <button
                  type="button"
                  disabled={loading !== null}
                  onClick={() => {
                    setEmail("demo@socialai.com");
                    setPassword("password123");
                    submitCredentials(undefined, {
                      email: "demo@socialai.com",
                      password: "password123",
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] disabled:opacity-50"
                >
                  1-Click Demo Login
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Requires the demo dataset (<code>SEED_DEMO_DATA=true</code>).
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 font-bold hover:underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-400 font-bold hover:underline">
                Register here
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
