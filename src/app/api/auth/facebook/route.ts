import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { FacebookGraphAPI } from "@/lib/facebook-api";
import { db } from "@/db";
import { metaAppSettings } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Starts the *Page connection* flow (Graph API business scopes).
 *
 * This is NOT the login flow - signing in with Facebook is handled by Auth.js
 * at /api/auth/signin/facebook. This endpoint requires an already
 * authenticated user and asks for the extra Page-management permissions.
 */
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = process.env.NEXTAUTH_URL || process.env.AUTH_URL || new URL(req.url).origin;
  const redirectUri = `${origin.replace(/\/$/, "")}/api/auth/facebook/callback`;

  // Admin-configured credentials win; otherwise fall back to the environment.
  let appId: string | undefined;
  try {
    const [settings] = await db.select().from(metaAppSettings).limit(1);
    appId = settings?.appId || undefined;
  } catch {
    // meta_app_settings may not be populated yet - not fatal.
  }

  appId =
    appId ||
    process.env.AUTH_FACEBOOK_ID ||
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ||
    undefined;

  if (!appId) {
    return NextResponse.json(
      {
        error:
          "Facebook App ID is not configured. Set AUTH_FACEBOOK_ID (or NEXT_PUBLIC_FACEBOOK_APP_ID).",
      },
      { status: 400 }
    );
  }

  const fb = new FacebookGraphAPI(appId);
  const authUrl = fb.getOAuthUrl(redirectUri, `ws_${user.id}`);

  return NextResponse.json({ url: authUrl, appId });
}
