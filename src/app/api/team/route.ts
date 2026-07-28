import { NextResponse } from "next/server";
import { getCurrentUser, ensureDefaultWorkspace } from "@/lib/auth";
import { db } from "@/db";
import { workspaceMembers, users, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = await ensureDefaultWorkspace(user.id);

  const members = await db
    .select({
      memberId: workspaceMembers.id,
      role: workspaceMembers.role,
      status: workspaceMembers.status,
      invitedEmail: workspaceMembers.invitedEmail,
      createdAt: workspaceMembers.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(workspaceMembers)
    .leftJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, workspaceId));

  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = await ensureDefaultWorkspace(user.id);
  const { email, role = "editor" } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if user exists
  const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

  const memberId = "wm_" + crypto.randomUUID().slice(0, 8);

  const [created] = await db
    .insert(workspaceMembers)
    .values({
      id: memberId,
      workspaceId,
      userId: existingUser ? existingUser.id : null,
      role,
      invitedEmail: email.toLowerCase(),
      status: existingUser ? "active" : "pending",
    })
    .returning();

  return NextResponse.json({ member: created });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Member ID required" }, { status: 400 });
  }

  await db.delete(workspaceMembers).where(eq(workspaceMembers.id, id));
  return NextResponse.json({ success: true });
}
