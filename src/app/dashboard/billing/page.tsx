"use client";

import React, { useState } from "react";
import { CreditCard, Sparkles, Check, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { PLAN_TIERS } from "@/lib/stripe";

export default function BillingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [upgrading, setUpgrading] = useState(false);

  const handleCheckout = async (planId: string) => {
    try {
      setUpgrading(true);
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingInterval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5" /> Flexible Pricing & Subscription Tiers
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Scale Your Brand with SocialAI
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Unlock unlimited Facebook page posting, AI credits, team collaboration, and Meta Graph API analytics.
        </p>

        {/* Toggle Interval */}
        <div className="inline-flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold mt-2">
          <button
            onClick={() => setBillingInterval("monthly")}
            className={`px-4 py-1.5 rounded-lg transition ${
              billingInterval === "monthly" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow" : "text-slate-500"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval("yearly")}
            className={`px-4 py-1.5 rounded-lg transition flex items-center gap-1 ${
              billingInterval === "yearly" ? "bg-white dark:bg-slate-900 text-indigo-600 shadow" : "text-slate-500"
            }`}
          >
            <span>Yearly Billing</span>
            <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {Object.values(PLAN_TIERS).map((plan) => {
          const price = billingInterval === "yearly" ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border flex flex-col justify-between space-y-6 shadow-sm relative ${
                plan.id === "pro"
                  ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10 shadow-xl"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${price}</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={upgrading}
                className={`w-full py-3 rounded-xl font-extrabold text-xs transition shadow ${
                  plan.id === "pro"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white"
                }`}
              >
                {plan.id === "free" ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
