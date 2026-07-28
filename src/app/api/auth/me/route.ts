import { NextResponse } from "next/server";
import { getCurrentUser, ensureDefaultWorkspace } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const workspaceId = await ensureDefaultWorkspace(user.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        workspaceId,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
