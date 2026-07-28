import { NextResponse } from "next/server";
import { getCurrentUser, ensureDefaultWorkspace } from "@/lib/auth";
import { FacebookGraphAPI } from "@/lib/facebook-api";
import { db } from "@/db";
import { metaAppSettings, connectedAccounts } from "@/db/schema";
import { decryptToken, encryptToken } from "@/lib/encryption";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorReason = url.searchParams.get("error_reason");

  const baseUrl = `${url.protocol}//${url.host}`;

  if (error || errorReason) {
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=${encodeURIComponent(errorReason || "Facebook Login canceled")}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=${encodeURIComponent("Facebook did not return an OAuth code")}`);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(`${baseUrl}/login?error=SessionExpired`);
  }

  const workspaceId = await ensureDefaultWorkspace(user.id);

  try {
    const [settings] = await db.select().from(metaAppSettings).limit(1);
    const appId =
      settings?.appId ||
      process.env.AUTH_FACEBOOK_ID ||
      process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const appSecret = settings?.encryptedAppSecret
      ? decryptToken(settings.encryptedAppSecret)
      : process.env.AUTH_FACEBOOK_SECRET || process.env.FACEBOOK_APP_SECRET;

    const fb = new FacebookGraphAPI(appId, appSecret);
    const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

    const tokenRes = await fb.exchangeCodeForToken(code, redirectUri);
    const userPages = await fb.getUserPages(tokenRes.accessToken);

    for (const page of userPages) {
      const encryptedToken = encryptToken(page.access_token);
      const accId = "acc_fb_" + page.id;

      await db
        .insert(connectedAccounts)
        .values({
          id: accId,
          workspaceId,
          platform: "facebook_page",
          platformId: page.id,
          name: page.name,
          username: page.username || page.name.toLowerCase().replace(/\s+/g, ""),
          category: page.category || "Business Page",
          avatarUrl: page.picture?.data?.url || null,
          followersCount: page.fan_count || 0,
          encryptedAccessToken: encryptedToken,
          tokenExpiresAt: new Date(Date.now() + tokenRes.expiresIn * 1000),
          status: "connected",
        })
        .onConflictDoUpdate({
          target: connectedAccounts.id,
          set: {
            encryptedAccessToken: encryptedToken,
            tokenExpiresAt: new Date(Date.now() + tokenRes.expiresIn * 1000),
            status: "connected",
          },
        });
    }

    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?connected=true&count=${userPages.length}`);
  } catch (err: any) {
    console.error("Meta OAuth Callback Error:", err);
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=${encodeURIComponent(err.message || "Failed to connect Facebook Page")}`);
  }
}
