import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth-utils";
import { ensureDefaultWorkspace } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Creates the user record. The client then calls `signIn("credentials", ...)`
 * so Auth.js issues the session cookie - this route no longer sets one itself.
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Email address is already registered" },
        { status: 409 }
      );
    }

    const userId = "usr_" + crypto.randomUUID().slice(0, 12);

    await db.insert(users).values({
      id: userId,
      email: normalizedEmail,
      name: String(name).trim(),
      passwordHash: hashPassword(password),
      role: "user",
      subscriptionTier: "free",
      aiCreditsUsed: 0,
      aiCreditsLimit: 50,
    });

    const workspaceId = await ensureDefaultWorkspace(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: normalizedEmail,
        name,
        role: "user",
        subscriptionTier: "free",
        workspaceId,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Registration failed" },
      { status: 500 }
    );
  }
}
