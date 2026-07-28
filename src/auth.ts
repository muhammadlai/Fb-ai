import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

import { db } from "@/db";
import { connectedAccounts, users, workspaceMembers, workspaces } from "@/db/schema";
import { hashPassword } from "@/lib/auth-utils";
import { encryptToken } from "@/lib/encryption";
import { FacebookGraphAPI } from "@/lib/facebook-api";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * The Facebook provider is always registered so the login page can always start
 * the real Meta OAuth flow. If the production environment is missing the
 * Facebook App ID/secret, Auth.js returns a configuration error instead of
 * falling back to a fake/demo login.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscriptionTier: string;
      aiCreditsUsed: number;
      aiCreditsLimit: number;
    } & DefaultSession["user"];
  }
}

export const facebookConfigured = true;

type DbUser = typeof users.$inferSelect;

function facebookClientId() {
  return (
    process.env.AUTH_FACEBOOK_ID ||
    process.env.FACEBOOK_CLIENT_ID ||
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ||
    ""
  );
}

function facebookClientSecret() {
  return (
    process.env.AUTH_FACEBOOK_SECRET ||
    process.env.FACEBOOK_CLIENT_SECRET ||
    process.env.FACEBOOK_APP_SECRET ||
    ""
  );
}

async function findUserByEmail(email: string): Promise<DbUser | undefined> {
  const [row] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return row;
}

/** Creates the user on first Facebook login, or links an existing email. */
async function upsertOAuthUser(params: {
  email: string;
  name: string;
  image?: string | null;
  providerAccountId?: string | null;
}): Promise<DbUser> {
  const email = params.email.toLowerCase();
  const existing = await findUserByEmail(email);

  if (existing) {
    await db
      .update(users)
      .set({
        facebookId: params.providerAccountId ?? existing.facebookId,
        avatarUrl: params.image ?? existing.avatarUrl ?? null,
        name: params.name || existing.name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
    return {
      ...existing,
      facebookId: params.providerAccountId ?? existing.facebookId,
      avatarUrl: params.image ?? existing.avatarUrl,
      name: params.name || existing.name,
    };
  }

  const id = "usr_" + crypto.randomUUID().slice(0, 12);
  const [created] = await db
    .insert(users)
    .values({
      id,
      email,
      name: params.name || email.split("@")[0],
      avatarUrl: params.image ?? null,
      facebookId: params.providerAccountId ?? null,
      role: "user",
      subscriptionTier: "free",
      aiCreditsUsed: 0,
      aiCreditsLimit: 50,
    })
    .returning();

  return created;
}

async function ensureUserWorkspace(userId: string, userName?: string | null): Promise<string> {
  const existingMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId))
    .limit(1);

  if (existingMemberships[0]) return existingMemberships[0].workspaceId;

  const workspaceId = "ws_" + crypto.randomUUID().slice(0, 8);

  await db
    .insert(workspaces)
    .values({
      id: workspaceId,
      name: `${userName || "Facebook User"}'s Workspace`,
      ownerId: userId,
      plan: "free",
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

async function storeFacebookConnection(params: {
  userId: string;
  workspaceId: string;
  userAccessToken: string;
  tokenExpiresAt: Date | null;
}) {
  const fb = new FacebookGraphAPI(facebookClientId(), facebookClientSecret());

  const profile = await fb.getUserProfile(params.userAccessToken);
  const encryptedUserToken = encryptToken(params.userAccessToken);

  await db
    .insert(connectedAccounts)
    .values({
      id: `acc_fb_user_${params.userId}`,
      workspaceId: params.workspaceId,
      platform: "facebook_user",
      platformId: profile.id,
      name: profile.name || "Facebook User",
      username: profile.email || null,
      category: "Facebook Account",
      avatarUrl: profile.picture?.data?.url || null,
      followersCount: 0,
      encryptedAccessToken: encryptedUserToken,
      tokenExpiresAt: params.tokenExpiresAt,
      status: "connected",
    })
    .onConflictDoUpdate({
      target: connectedAccounts.id,
      set: {
        platformId: profile.id,
        name: profile.name || "Facebook User",
        username: profile.email || null,
        avatarUrl: profile.picture?.data?.url || null,
        encryptedAccessToken: encryptedUserToken,
        tokenExpiresAt: params.tokenExpiresAt,
        status: "connected",
      },
    });

  const pages = await fb.getUserPages(params.userAccessToken);

  for (const page of pages) {
    if (!page.access_token) continue;

    const encryptedPageToken = encryptToken(page.access_token);
    const pageAccountId = `acc_fb_page_${params.workspaceId}_${page.id}`;

    await db
      .insert(connectedAccounts)
      .values({
        id: pageAccountId,
        workspaceId: params.workspaceId,
        platform: "facebook_page",
        platformId: page.id,
        name: page.name,
        username: page.username || null,
        category: page.category || "Facebook Page",
        avatarUrl: page.picture?.data?.url || null,
        followersCount: page.fan_count || 0,
        encryptedAccessToken: encryptedPageToken,
        tokenExpiresAt: null,
        status: "connected",
      })
      .onConflictDoUpdate({
        target: connectedAccounts.id,
        set: {
          name: page.name,
          username: page.username || null,
          category: page.category || "Facebook Page",
          avatarUrl: page.picture?.data?.url || null,
          followersCount: page.fan_count || 0,
          encryptedAccessToken: encryptedPageToken,
          status: "connected",
        },
      });
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Vercel sets VERCEL_URL; AUTH_TRUST_HOST lets Auth.js honour the forwarded
  // host so callback URLs are correct on preview and production deployments.
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Facebook({
      clientId: facebookClientId(),
      clientSecret: facebookClientSecret(),
      authorization: {
        url: "https://www.facebook.com/v19.0/dialog/oauth",
        params: {
          scope: [
            "email",
            "public_profile",
            "pages_show_list",
            "pages_read_engagement",
            "pages_manage_posts",
          ].join(","),
          auth_type: "rerequest",
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email || `${profile.id}@facebook.local`,
          image: profile.picture?.data?.url,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const email = typeof raw?.email === "string" ? raw.email.trim().toLowerCase() : "";
        const password = typeof raw?.password === "string" ? raw.password : "";
        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user) return null;

        // Users created through Facebook have no password set.
        if (!user.passwordHash) return null;

        const candidate = hashPassword(password);
        // Constant-time compare to avoid leaking hash prefixes.
        const a = Buffer.from(candidate);
        const b = Buffer.from(user.passwordHash);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "facebook") return true;

      // Facebook can return a profile without an email (phone-only accounts).
      const email =
        user.email ||
        (typeof profile?.email === "string" ? profile.email : "") ||
        `${account.providerAccountId}@facebook.local`;

      const record = await upsertOAuthUser({
        email,
        name: user.name || "Facebook User",
        image: user.image,
        providerAccountId: account.providerAccountId,
      });

      const workspaceId = await ensureUserWorkspace(record.id, record.name);

      const shortLivedAccessToken = typeof account.access_token === "string" ? account.access_token : "";
      if (shortLivedAccessToken) {
        const fb = new FacebookGraphAPI(facebookClientId(), facebookClientSecret());
        const token = await fb.exchangeShortLivedTokenForLongLived(shortLivedAccessToken);
        await storeFacebookConnection({
          userId: record.id,
          workspaceId,
          userAccessToken: token.accessToken,
          tokenExpiresAt: token.expiresIn ? new Date(Date.now() + token.expiresIn * 1000) : null,
        });
      }

      // Hand the internal id to the jwt callback.
      user.id = record.id;
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user?.id) token.sub = user.id;

      // Refresh the cached claims on sign-in and on session updates.
      if (token.sub && (user || trigger === "update" || token.role === undefined)) {
        const [row] = await db.select().from(users).where(eq(users.id, token.sub)).limit(1);
        if (row) {
          token.name = row.name;
          token.email = row.email;
          token.picture = row.avatarUrl;
          token.role = row.role;
          token.subscriptionTier = row.subscriptionTier;
          token.aiCreditsUsed = row.aiCreditsUsed;
          token.aiCreditsLimit = row.aiCreditsLimit;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = (token.role as string) ?? "user";
      session.user.subscriptionTier = (token.subscriptionTier as string) ?? "free";
      session.user.aiCreditsUsed = (token.aiCreditsUsed as number) ?? 0;
      session.user.aiCreditsLimit = (token.aiCreditsLimit as number) ?? 50;
      if (token.picture !== undefined) session.user.image = token.picture as string | null;
      return session;
    },

    // Keep users inside the app after login and block open redirects.
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        /* fall through */
      }
      return `${baseUrl}/dashboard`;
    },
  },
});
