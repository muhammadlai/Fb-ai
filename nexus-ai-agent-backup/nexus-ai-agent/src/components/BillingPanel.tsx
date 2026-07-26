import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Download,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { BillingPlan, InvoiceItem } from '../types';
import { BILLING_PLANS, INVOICES } from '../data/mockData';

export const BillingPanel: React.FC = () => {
  const [plans, setPlans] = useState<BillingPlan[]>(BILLING_PLANS);
  const [invoices] = useState<InvoiceItem[]>(INVOICES);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<BillingPlan | null>(null);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  const handleSelectPlan = (plan: BillingPlan) => {
    if (plan.current) return;
    setSelectedPlanForUpgrade(plan);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForUpgrade) return;
    setPlans(
      plans.map((p) => ({
        ...p,
        current: p.id === selectedPlanForUpgrade.id,
      }))
    );
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              Billing & Subscriptions
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your Stripe billing plans, token usage limits, payment methods, and historical tax invoices.
          </p>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-1 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              !isAnnual ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              isAnnual ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Usage Quota Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Token Usage Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900/90 to-purple-950/40 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Monthly Tokens Used</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            1,420,500 <span className="text-xs font-normal text-slate-400">/ 5,000,000</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-amber-400 h-full w-[28.4%]" />
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center justify-between">
            <span>28.4% Quota Consumed</span>
            <span className="text-emerald-400">Resets in 7 days</span>
          </div>
        </div>

        {/* Vector RAG Storage Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900/90 to-cyan-950/40 border border-cyan-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Pinecone Vectors</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            12,480 <span className="text-xs font-normal text-slate-400">/ 50,000</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full w-[24.9%]" />
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center justify-between">
            <span>24.9% Capacity Used</span>
            <span className="text-cyan-400">Optimal</span>
          </div>
        </div>

        {/* Active AI Agents Seat Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900/90 to-indigo-950/40 border border-indigo-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active AI Agents</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            5 Agents <span className="text-xs font-normal text-slate-400">(Unlimited)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full w-[100%]" />
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center justify-between">
            <span>Pro Tier Privilege</span>
            <span className="text-indigo-300">Active</span>
          </div>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-100">Select Enterprise Plan</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = isAnnual ? Math.round(plan.price_monthly * 0.8) : plan.price_monthly;
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative ${
                  plan.current
                    ? 'bg-gradient-to-b from-purple-950/50 via-slate-900 to-slate-950 border-purple-500 shadow-2xl shadow-purple-950/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                {plan.current && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                    Current Active Plan
                  </span>
                )}

                <div>
                  <h4 className="text-lg font-black text-white">{plan.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{plan.tokens_limit}</p>

                  <div className="my-6">
                    <span className="text-4xl font-black text-white">${price}</span>
                    <span className="text-xs text-slate-400 font-mono"> / month</span>
                    {isAnnual && price > 0 && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">Billed annually</div>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={plan.current}
                    className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      plan.current
                        ? 'bg-slate-800 text-slate-400 cursor-default border border-white/5'
                        : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-950/50'
                    }`}
                  >
                    <span>{plan.current ? 'Current Plan' : 'Upgrade Plan'}</span>
                    {!plan.current && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Payment Method */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Payment Method (Stripe)
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs">
                VISA
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-100">{cardNumber}</div>
                <div className="text-[10px] text-slate-400 font-mono">Expires 08/2028 • Default Payment</div>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-medium"
            >
              Update Card
            </button>
          </div>
        </div>

        {/* Invoice History */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            Invoice & Tax History
          </h3>

          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{inv.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{inv.date}</div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-100">{inv.amount}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    Paid
                  </span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading receipt PDF for ${inv.id}`);
                    }}
                    className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-cyan-400"
                    title="Download Receipt PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stripe Payment Upgrade Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Stripe Payment Checkout
              </h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUpgrade} className="space-y-4">
              {selectedPlanForUpgrade && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
                  <span className="text-slate-400">Upgrading to: </span>
                  <span className="font-bold text-white">{selectedPlanForUpgrade.name}</span>
                  <div className="text-sm font-black text-purple-300 mt-1">
                    ${selectedPlanForUpgrade.price_monthly} / month
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full bg-slate-950 text-slate-100 text-xs font-mono border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    defaultValue="08/28"
                    className="w-full bg-slate-950 text-slate-100 text-xs font-mono border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    defaultValue="888"
                    className="w-full bg-slate-950 text-slate-100 text-xs font-mono border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Confirm Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
