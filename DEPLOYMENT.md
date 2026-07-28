# Deployment

> **Authentication / Facebook Login:** see [AUTHENTICATION.md](./AUTHENTICATION.md)
> for the required `AUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_FACEBOOK_ID` and
> `AUTH_FACEBOOK_SECRET` variables and the Meta dashboard setup.

## Vercel

The default target. Vercel auto-detects Next.js — no `vercel.json` needed.

| Setting | Value |
| --- | --- |
| Framework | Next.js (auto) |
| Build command | `next build` (auto) |
| Install command | `npm install` (auto) |

Add every variable from `.env.example` under
**Settings → Environment Variables**, then deploy. The OAuth callback is
`https://fb-ai-tau.vercel.app/api/auth/callback/facebook`.

---

# Deploying to Cloudflare Workers

This app runs on Cloudflare Workers via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

## Why the build was failing

`bunx opennextjs-cloudflare build` failed because **`@opennextjs/cloudflare` was
never a dependency of this project**. `bunx` therefore fell back to npm and
downloaded the unrelated placeholder package `opennextjs-cloudflare`
("For Security Holding Purposes"), which ships no executable — hence:

```
error: could not determine executable to run for package opennextjs-cloudflare
Running custom build `bunx opennextjs-cloudflare build` failed.
```

The adapter (plus `wrangler`, `wrangler.toml` and `open-next.config.ts`) is now
installed and configured, so the command resolves to the real local binary.

## One-time setup

```bash
bun install
bunx wrangler login
```

Pick a unique Worker name in `wrangler.toml` (`name = "socialai-hub"`) and make
sure the `WORKER_SELF_REFERENCE` service binding uses the **same** name.

## Required secrets

Runtime secrets are **not** read from `.env` on Workers. Set them once:

```bash
bunx wrangler secret put DATABASE_URL
bunx wrangler secret put ENCRYPTION_SECRET
bunx wrangler secret put NEXT_PUBLIC_APP_URL
bunx wrangler secret put NEXT_PUBLIC_FACEBOOK_APP_ID   # optional
bunx wrangler secret put FACEBOOK_APP_SECRET           # optional
bunx wrangler secret put OPENAI_API_KEY                # optional
bunx wrangler secret put STRIPE_SECRET_KEY             # optional
```

`NEXT_PUBLIC_*` values are inlined into the client bundle at **build** time, so
for Cloudflare CI builds also add them as build-time environment variables in
**Workers & Pages → Settings → Build → Variables**.

## Database

Postgres over TCP works on Workers thanks to `nodejs_compat`, but every isolate
opens its own connection. For anything beyond light traffic use **Hyperdrive**:

```bash
bunx wrangler hyperdrive create socialai-db \
  --connection-string="postgresql://user:pass@host:5432/db"
```

Uncomment the `[[hyperdrive]]` block in `wrangler.toml` and paste the returned
id. `src/db/index.ts` prefers the Hyperdrive connection string automatically and
falls back to `DATABASE_URL` when the binding is absent.

Push the schema from your machine (never from a Worker):

```bash
bun run db:push
```

To insert the demo dataset once, set `SEED_DEMO_DATA=true`, hit `/api/health`,
then remove the variable. The seed is idempotent and single-flighted.

## Deploy

```bash
bun run deploy     # build + deploy
bun run preview    # build + run locally in the Workers runtime
bun run upload     # build + upload a new version without releasing it
```

Or connect the repo in **Workers & Pages → Create → Import a repository** with:

- **Build command:** `bunx opennextjs-cloudflare build`
- **Deploy command:** `bunx wrangler deploy`

## Cloudflare Pages

The same build output works on Pages. Use:

- **Build command:** `bunx opennextjs-cloudflare build`
- **Build output directory:** `.open-next/assets`
- **Deploy command:** `bunx wrangler pages deploy`

Keep `nodejs_compat` and a compatibility date of `2024-09-23` or later enabled
in the Pages project settings.

## Verifying

```bash
curl https://<your-worker>.workers.dev/api/health
```

```json
{ "ok": true, "database": "connected", "runtime": "cloudflare-workers" }
```

A `503` with `"database": "unreachable"` means the Worker is fine but
`DATABASE_URL` / Hyperdrive is not reachable.

## Runtime notes

- `export const runtime = "edge"` is **not** supported — none is used here.
- Reusing a global `pg.Pool` across requests triggers *"Cannot perform I/O on
  behalf of a different request"* (seen as a hung request). `src/db/index.ts`
  therefore scopes the pool to the request `ExecutionContext` on Workers and
  keeps the classic cached global pool on Node.
- `node:crypto` (`createHash`, `randomBytes`, `createCipheriv`/`createDecipheriv`
  with `aes-256-cbc`) is verified working under `nodejs_compat`.
