# Authentication & Facebook Login

Auth is handled by **Auth.js (NextAuth v5)** with two providers:

| Provider      | Purpose                                            |
| ------------- | -------------------------------------------------- |
| `facebook`    | "Continue with Facebook" one-click login            |
| `credentials` | Email + password (register / log in)                |

Sessions are **JWT-based**, so no `accounts`/`sessions` tables are needed and
the existing Drizzle schema is unchanged.

---

## What was broken and why

| Symptom | Cause |
| --- | --- |
| `/register` returned **404** | The page simply did not exist — `/login` linked to it, but there was no `src/app/register/page.tsx`. |
| Facebook login did nothing | There was **no `/api/auth/callback/facebook` route**. The old `/api/auth/facebook` endpoint required an *already logged-in* user, so on the login page it returned `401` and the click silently failed. |
| No NextAuth at all | `next-auth` was not installed. Sessions were a hand-rolled, **unsigned** base64 cookie (`session_token`) that anyone could forge. |

### The forgeable-cookie problem

The previous `createSessionToken()` was:

```ts
Buffer.from(JSON.stringify({ userId, exp })).toString("base64url")
```

No signature. Anyone could base64-encode `{"userId":"usr_demo_admin_2026"}`
and become an admin. It is now a signed Auth.js JWT.

---

## Required environment variables

Set these in **Vercel → Project → Settings → Environment Variables**
(Production *and* Preview):

| Variable | Required | Value |
| --- | --- | --- |
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | `https://fb-ai-tau.vercel.app` |
| `AUTH_FACEBOOK_ID` | ✅ | Facebook App ID |
| `AUTH_FACEBOOK_SECRET` | ✅ | Facebook App Secret |
| `DATABASE_URL` | ✅ | Postgres connection string |
| `ENCRYPTION_SECRET` | ✅ | Long random string |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | optional | Only for the Page-connect flow |

`NEXTAUTH_SECRET` and `AUTH_URL` are accepted as aliases.

> **Why `NEXTAUTH_URL` matters.** Auth.js derives the OAuth `redirect_uri` from
> it. Without it, a Vercel *preview* deployment would send its own
> `*-git-branch.vercel.app` URL to Facebook, which is not in the allow-list and
> fails with **"URL Blocked"**. Pinning it guarantees the callback is always
> `https://fb-ai-tau.vercel.app/api/auth/callback/facebook`.

---

## Facebook App configuration

In <https://developers.facebook.com/apps> → your app:

1. **Settings → Basic** — copy *App ID* and *App Secret*.
2. Add **Facebook Login** as a product.
3. **Facebook Login → Settings** → *Valid OAuth Redirect URIs*, add exactly:

   ```
   https://fb-ai-tau.vercel.app/api/auth/callback/facebook
   ```

   For local development also add `http://localhost:3000/api/auth/callback/facebook`.
4. **Client OAuth Login** and **Web OAuth Login**: **On**.
5. **App Review → Permissions**: `email` and `public_profile` are granted
   automatically. Page-management scopes require App Review.
6. Switch the app to **Live** so users other than admins/testers can log in.

---

## The flow

```
/login  ──"Continue with Facebook"──▶  signIn("facebook")
        ──▶ /api/auth/signin/facebook
        ──▶ https://www.facebook.com/v19.0/dialog/oauth?client_id=…&redirect_uri=…
        ──▶ user approves
        ──▶ https://fb-ai-tau.vercel.app/api/auth/callback/facebook?code=…
        ──▶ signIn callback upserts the user in `users`
        ──▶ redirect to /dashboard
```

`src/app/api/auth/[...nextauth]/route.ts` serves every `/api/auth/*` endpoint.

---

## Routes

| Route | Notes |
| --- | --- |
| `/login` | Login (server component, redirects if already signed in) |
| `/register` | Registration — **the 404 is fixed** |
| `/api/auth/[...nextauth]` | All Auth.js endpoints incl. the Facebook callback |
| `/api/auth/register` | Creates the user, then the client calls `signIn()` |
| `/api/auth/me` | Current user + workspace |
| `/api/auth/facebook` + `/callback` | Separate **Page-connection** flow (business scopes), requires an existing session |

`/api/auth/login` and `/api/auth/logout` were **removed** — Auth.js provides
`/api/auth/callback/credentials` and `/api/auth/signout`.

---

## Route protection

There is **no `middleware.ts` / `proxy.ts`**. `src/app/dashboard/layout.tsx`
calls `getCurrentUser()` and redirects to
`/login?callbackUrl=…` when there is no session.

This is deliberate:

- A proxy could only do a cookie **presence** check; the layout validates the
  session against the database.
- Next.js 16 proxies run on the **Node.js runtime**, which the Cloudflare
  Workers adapter rejects (`Node.js middleware is not currently supported`).
  Removing it keeps Vercel and Cloudflare on identical code.

Consequently nothing can ever block `/api/auth/**`.

---

## Local development

```bash
cp .env.example .env.local     # fill in AUTH_SECRET + Facebook keys
bun install
bun run dev
```

Set `NEXTAUTH_URL=http://localhost:3000` locally.

If `AUTH_FACEBOOK_ID` / `AUTH_FACEBOOK_SECRET` are absent, the Facebook button
is replaced by a short "not configured" note and email/password still works —
so the app never shows a dead button.

---

## Verified

- `/`, `/login`, `/register` → **200** (no 404s)
- `/api/auth/{providers,csrf,session,signin,signout}` → no 404s
- `/api/auth/callback/facebook` → **302** (route exists)
- Advertised callback URL is exactly
  `https://fb-ai-tau.vercel.app/api/auth/callback/facebook`
- `signIn("facebook")` → `https://www.facebook.com/v19.0/dialog/oauth` with the
  correct `client_id`, `redirect_uri`, `scope` and PKCE verifier
- Credentials login issues a session cookie and `/dashboard` renders
- Wrong password → `?error=CredentialsSignin`, **no** cookie
- `next build` (Vercel, npm, clean clone) and `opennextjs-cloudflare build` both pass
