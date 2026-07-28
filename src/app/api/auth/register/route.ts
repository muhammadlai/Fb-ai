import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSessionToken, ensureDefaultWorkspace } from "@/lib/auth";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing) {
      return NextResponse.json({ error: "Email address is already registered" }, { status: 400 });
    }

    const userId = "usr_" + crypto.randomUUID().slice(0, 8);
    const passHash = hashPassword(password);

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      name,
      passwordHash: passHash,
      role: "user",
      subscriptionTier: "free",
      aiCreditsUsed: 0,
      aiCreditsLimit: 50,
    });

    const workspaceId = await ensureDefaultWorkspace(userId);
    const token = createSessionToken(userId);

    const res = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        role: "user",
        subscriptionTier: "free",
        workspaceId,
      },
    });

    res.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}
