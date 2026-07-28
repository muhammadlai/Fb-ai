import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth-utils";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Session strategy is JWT (not database), so no `accounts`/`sessions` tables
 * are required and the existing Drizzle schema works unchanged. Users are
 * still persisted to the `users` table by the `signIn` callback below.
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

/** Facebook is only offered when real credentials are configured. */
export const facebookConfigured = Boolean(
  process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET
);

type DbUser = typeof users.$inferSelect;

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
        avatarUrl: existing.avatarUrl ?? params.image ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
    return { ...existing, facebookId: params.providerAccountId ?? existing.facebookId };
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
    ...(facebookConfigured
      ? [
          Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID!,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
            authorization: {
              params: {
                // `email` + `public_profile` are granted without App Review.
                // Page-management scopes are requested separately from
                // /dashboard/accounts once the user connects a Page.
                scope: "email,public_profile",
              },
            },
            // Facebook may omit `email` when the account has none verified.
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

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
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* fall through */
      }
      return `${baseUrl}/dashboard`;
    },
  },
});
