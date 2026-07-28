import crypto from "node:crypto";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, workspaces, workspaceMembers } from "@/db/schema";
import { hashPassword, type UserSession } from "./auth-utils";

export type { UserSession };
export { hashPassword };

/**
 * Reads the current user from the Auth.js session.
 *
 * Every API route already calls this, so switching the session source here
 * migrates the whole app to Auth.js without touching each route.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    avatarUrl: user.avatarUrl,
    aiCreditsUsed: user.aiCreditsUsed,
    aiCreditsLimit: user.aiCreditsLimit,
  };
}

export async function ensureDefaultWorkspace(userId: string): Promise<string> {
  const existingMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId));

  if (existingMemberships.length > 0) {
    return existingMemberships[0].workspaceId;
  }

  const workspaceId = "ws_" + crypto.randomUUID().slice(0, 8);
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  await db
    .insert(workspaces)
    .values({
      id: workspaceId,
      name: `${user?.name || "User"}'s Workspace`,
      ownerId: userId,
      plan: user?.subscriptionTier || "free",
    })
    .onConflictDoNothing();

  await db
    .insert(workspaceMembers)
    .values({
      id: "wm_" + crypto.randomUUID().slice(0, 8),
      workspaceId,
      userId,
      role: "owner",
      status: "active",
    })
    .onConflictDoNothing();

  return workspaceId;
}
