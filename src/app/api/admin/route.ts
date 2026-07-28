import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, metaAppSettings, systemLogs, posts, connectedAccounts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { encryptToken, decryptToken } from "@/lib/encryption";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  const [metaSettings] = await db.select().from(metaAppSettings);
  const logs = await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(20);
  const totalPosts = await db.select().from(posts);
  const totalAccounts = await db.select().from(connectedAccounts);

  return NextResponse.json({
    stats: {
      totalUsers: allUsers.length,
      totalConnectedAccounts: totalAccounts.length,
      totalPostsCount: totalPosts.length,
      mrr: allUsers.reduce((sum, u) => {
        if (u.subscriptionTier === "pro") return sum + 29;
        if (u.subscriptionTier === "premium") return sum + 79;
        return sum;
      }, 0),
    },
    users: allUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      subscriptionTier: u.subscriptionTier,
      aiCreditsUsed: u.aiCreditsUsed,
      aiCreditsLimit: u.aiCreditsLimit,
      createdAt: u.createdAt,
    })),
    metaSettings: {
      appId: metaSettings?.appId || "",
      appSecretMasked: metaSettings?.encryptedAppSecret ? "••••••••••••" + decryptToken(metaSettings.encryptedAppSecret).slice(-4) : "",
      environment: metaSettings?.environment || "sandbox",
      webhookVerifyToken: metaSettings?.webhookVerifyToken || "socialai_verify_token",
    },
    logs,
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === "update_meta_config") {
    const { appId, appSecret, environment, webhookVerifyToken } = body;

    const [existing] = await db.select().from(metaAppSettings);

    if (existing) {
      await db
        .update(metaAppSettings)
        .set({
          appId: appId || existing.appId,
          encryptedAppSecret: appSecret ? encryptToken(appSecret) : existing.encryptedAppSecret,
          environment: environment || existing.environment,
          webhookVerifyToken: webhookVerifyToken || existing.webhookVerifyToken,
          updatedAt: new Date(),
        })
        .where(eq(metaAppSettings.id, existing.id));
    } else {
      await db.insert(metaAppSettings).values({
        id: "meta_cfg_" + crypto.randomUUID().slice(0, 8),
        appId,
        encryptedAppSecret: encryptToken(appSecret || ""),
        environment: environment || "sandbox",
        webhookVerifyToken: webhookVerifyToken || "socialai_verify_token",
      });
    }

    await db.insert(systemLogs).values({
      id: "log_" + crypto.randomUUID().slice(0, 8),
      level: "info",
      category: "meta_api",
      message: `Meta App configuration updated by admin ${user.email}`,
    });

    return NextResponse.json({ success: true });
  }

  if (action === "update_user_role") {
    const { targetUserId, role, subscriptionTier } = body;
    await db
      .update(users)
      .set({
        role: role || undefined,
        subscriptionTier: subscriptionTier || undefined,
      })
      .where(eq(users.id, targetUserId));

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
