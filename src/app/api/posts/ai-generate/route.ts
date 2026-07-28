import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { AIGenerator } from "@/lib/ai-generator";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check AI credit limit
  if (user.aiCreditsUsed >= user.aiCreditsLimit) {
    return NextResponse.json(
      { error: "AI Credit limit reached. Please upgrade your subscription to Pro or Premium for more AI generation credits." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { action = "generate_post", topic, tone, platform, targetAudience, callToAction, text, keyword } = body;

    let result: any = null;

    if (action === "generate_post") {
      result = await AIGenerator.generatePost({
        topic: topic || "Modern AI Social Media Automation",
        tone,
        platform,
        targetAudience,
        callToAction,
      });
    } else if (action === "hashtags") {
      result = {
        hashtags: AIGenerator.generateHashtags(keyword || topic || "socialmedia"),
      };
    } else if (action === "improve_text") {
      const improved = await AIGenerator.improveText(text || "", body.improvementType || "engaging");
      result = { text: improved };
    }

    // Deduct 1 AI Credit
    await db
      .update(users)
      .set({
        aiCreditsUsed: sql`${users.aiCreditsUsed} + 1`,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      data: result,
      remainingCredits: Math.max(0, user.aiCreditsLimit - user.aiCreditsUsed - 1),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI generation failed" }, { status: 500 });
  }
}
