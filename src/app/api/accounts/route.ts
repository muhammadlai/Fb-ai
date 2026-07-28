import { NextResponse } from "next/server";
import { getCurrentUser, ensureDefaultWorkspace } from "@/lib/auth";
import { db } from "@/db";
import { connectedAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";


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

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Manual/demo account creation is disabled. Connect a real Facebook account with OAuth so Graph API tokens can be stored securely.",
    },
    { status: 405 }
  );
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
