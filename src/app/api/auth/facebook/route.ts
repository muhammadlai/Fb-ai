import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { FacebookGraphAPI } from "@/lib/facebook-api";
import { db } from "@/db";
import { metaAppSettings } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const redirectUri = `${url.origin}/api/auth/facebook/callback`;

  // Check if Meta App credentials configured in admin settings
  const [settings] = await db.select().from(metaAppSettings);
  const appId = settings?.appId || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  const fb = new FacebookGraphAPI(appId);
  const authUrl = fb.getOAuthUrl(redirectUri, `ws_${user.id}`);

  return NextResponse.json({ url: authUrl, appId });
}
