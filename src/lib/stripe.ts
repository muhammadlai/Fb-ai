export interface PlanTier {
  id: "free" | "pro" | "premium";
  name: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  features: string[];
  maxAccounts: number;
  maxPostsPerMonth: number;
  maxTeamMembers: number;
  aiCreditsMonthly: number;
  badge?: string;
}

export const PLAN_TIERS: Record<string, PlanTier> = {
  free: {
    id: "free",
    name: "Free Plan",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Connect 2 Social Accounts",
      "50 Scheduled Posts / month",
      "1 Team Member",
      "50 AI Credits / month",
      "Basic Analytics & Calendar",
      "Standard Facebook OAuth Integration",
    ],
    maxAccounts: 2,
    maxPostsPerMonth: 50,
    maxTeamMembers: 1,
    aiCreditsMonthly: 50,
  },
  pro: {
    id: "pro",
    name: "Pro Growth",
    priceMonthly: 29,
    priceYearly: 24,
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
    features: [
      "Connect 10 Social Accounts",
      "Unlimited Scheduled Posts",
      "5 Team Members",
      "500 AI Credits / month",
      "Advanced AI Caption & Hashtag Generator",
      "Queue Slot Automation & Optimal Times",
      "Post Approval Workflows",
      "Export PDF Analytics Reports",
    ],
    maxAccounts: 10,
    maxPostsPerMonth: 99999,
    maxTeamMembers: 5,
    aiCreditsMonthly: 500,
    badge: "Most Popular",
  },
  premium: {
    id: "premium",
    name: "Agency & Enterprise",
    priceMonthly: 79,
    priceYearly: 65,
    stripePriceIdMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_premium_monthly",
    features: [
      "Connect Unlimited Social Accounts",
      "Unlimited Scheduled & Queued Posts",
      "25 Team Members with custom permissions",
      "5,000 AI Credits / month",
      "Custom Meta App Integration & Webhooks",
      "Priority 24/7 Dedicated Support",
      "White-label Reports & Workspace branding",
      "Automated AI Sentiment Analysis",
    ],
    maxAccounts: 999,
    maxPostsPerMonth: 99999,
    maxTeamMembers: 25,
    aiCreditsMonthly: 5000,
    badge: "Enterprise Choice",
  },
};

export class StripeService {
  static async createCheckoutSession(userId: string, planId: "pro" | "premium", billingInterval: "monthly" | "yearly" = "monthly") {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const plan = PLAN_TIERS[planId];

    if (!stripeSecret) {
      // Return simulated checkout session URL if Stripe key isn't provided
      return {
        url: `/dashboard/billing?checkout_success=true&plan=${planId}&interval=${billingInterval}`,
        sessionId: `sim_cs_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        simulated: true,
      };
    }

    try {
      const priceId = billingInterval === "yearly" ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[]": "card",
          mode: "subscription",
          "line_items[0][price]": priceId || "price_default",
          "line_items[0][quantity]": "1",
          client_reference_id: userId,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?canceled=true`,
        }).toString(),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      return {
        url: data.url,
        sessionId: data.id,
        simulated: false,
      };
    } catch (err: any) {
      console.error("Stripe error:", err);
      return {
        url: `/dashboard/billing?checkout_success=true&plan=${planId}`,
        sessionId: `sim_cs_fallback_${Date.now()}`,
        simulated: true,
      };
    }
  }
}
