import { NextResponse } from "next/server";
import { getCurrentUser, ensureDefaultWorkspace } from "@/lib/auth";
import { db } from "@/db";
import { connectedAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encryptToken } from "@/lib/encryption";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = await ensureDefaultWorkspace(user.id);
  const accounts = await db.select().from(connectedAccounts).where(eq(connectedAccounts.workspaceId, workspaceId));

  // Exclude raw encrypted tokens from API response
  const sanitized = accounts.map((acc) => ({
    id: acc.id,
    platform: acc.platform,
    platformId: acc.platformId,
    name: acc.name,
    username: acc.username,
    category: acc.category,
    avatarUrl: acc.avatarUrl,
    followersCount: acc.followersCount,
    status: acc.status,
    createdAt: acc.createdAt,
  }));

  return NextResponse.json({ accounts: sanitized });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = await ensureDefaultWorkspace(user.id);
  const body = await req.json();

  const { platform, name, username, category } = body;
  if (!platform || !name) {
    return NextResponse.json({ error: "Platform and name are required" }, { status: 400 });
  }

  const accId = "acc_" + platform.slice(0, 2) + "_" + crypto.randomUUID().slice(0, 8);
  const mockToken = `EAAG_SIMULATED_TOKEN_${Date.now()}`;

  const [newAccount] = await db
    .insert(connectedAccounts)
    .values({
      id: accId,
      workspaceId,
      platform,
      platformId: "plat_" + crypto.randomUUID().slice(0, 8),
      name,
      username: username || `@${name.toLowerCase().replace(/\s+/g, "")}`,
      category: category || "Social Business",
      avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80`,
      followersCount: Math.floor(Math.random() * 8000) + 1200,
      encryptedAccessToken: encryptToken(mockToken),
      status: "connected",
    })
    .returning();

  return NextResponse.json({
    account: {
      id: newAccount.id,
      platform: newAccount.platform,
      name: newAccount.name,
      username: newAccount.username,
      category: newAccount.category,
      avatarUrl: newAccount.avatarUrl,
      followersCount: newAccount.followersCount,
      status: newAccount.status,
    },
  });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 });
  }

  await db.delete(connectedAccounts).where(eq(connectedAccounts.id, id));

  return NextResponse.json({ success: true });
}
