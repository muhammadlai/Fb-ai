import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { queueSchedules, connectedAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    const schedules = await db.select().from(queueSchedules);
    return NextResponse.json({ schedules });
  }

  const schedules = await db.select().from(queueSchedules).where(eq(queueSchedules.connectedAccountId, accountId));
  return NextResponse.json({ schedules });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { connectedAccountId, dayOfWeek, timeSlot } = await req.json();

  if (!connectedAccountId || dayOfWeek === undefined || !timeSlot) {
    return NextResponse.json({ error: "AccountId, dayOfWeek and timeSlot required" }, { status: 400 });
  }

  const id = "qs_" + crypto.randomUUID().slice(0, 8);
  const [slot] = await db
    .insert(queueSchedules)
    .values({
      id,
      connectedAccountId,
      dayOfWeek: Number(dayOfWeek),
      timeSlot,
      isEnabled: true,
    })
    .returning();

  return NextResponse.json({ slot });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Slot ID required" }, { status: 400 });
  }

  await db.delete(queueSchedules).where(eq(queueSchedules.id, id));
  return NextResponse.json({ success: true });
}
