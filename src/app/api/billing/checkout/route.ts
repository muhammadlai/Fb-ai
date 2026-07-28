import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { StripeService } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId, billingInterval = "monthly" } = await req.json();

  if (planId === "free") {
    await db
      .update(users)
      .set({ subscriptionTier: "free", aiCreditsLimit: 50 })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, url: "/dashboard/billing?downgraded=true" });
  }

  const session = await StripeService.createCheckoutSession(user.id, planId, billingInterval);

  if (session.simulated) {
    // Instantly update user's plan for demo sandbox experience
    const creditLimit = planId === "premium" ? 5000 : 500;
    await db
      .update(users)
      .set({
        subscriptionTier: planId,
        aiCreditsLimit: creditLimit,
        subscriptionStatus: "active",
      })
      .where(eq(users.id, user.id));
  }

  return NextResponse.json({ url: session.url });
}
