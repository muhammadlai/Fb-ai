import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/db";
import { users, workspaces, workspaceMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  subscriptionTier: string;
  avatarUrl?: string | null;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "socialai_salt_2026").digest("hex");
}

export function createSessionToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeSessionToken(token: string): { userId: string; exp: number } | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const decoded = decodeSessionToken(token);
  if (!decoded) return null;

  const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
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

  // Create workspace
  const workspaceId = "ws_" + crypto.randomUUID().slice(0, 8);
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  await db.insert(workspaces).values({
    id: workspaceId,
    name: `${user?.name || "User"}'s Workspace`,
    ownerId: userId,
    plan: user?.subscriptionTier || "free",
  });

  await db.insert(workspaceMembers).values({
    id: "wm_" + crypto.randomUUID().slice(0, 8),
    workspaceId,
    userId,
    role: "owner",
    status: "active",
  });

  return workspaceId;
}
