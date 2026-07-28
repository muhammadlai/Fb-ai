import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

/**
 * Cloudflare Workers vs Node.js
 * -----------------------------
 * On Workers a TCP socket (and therefore a `pg` connection) is an I/O object
 * owned by the request that created it. Reusing a module-scope / global `Pool`
 * across requests makes workerd throw
 *
 *   "Cannot perform I/O on behalf of a different request"
 *
 * which surfaces as a hung request ("Worker's code had hung and would never
 * generate a response"). So on Workers we build one short-lived `Pool` per
 * request and cache it on the request-scoped `ExecutionContext`.
 *
 * On Node (next dev / next start / any Node host) the classic cached global
 * pool is correct and much cheaper, so we keep it there.
 */
const isCloudflareWorkers =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

type Scope = {
  __socialaiPool?: Pool;
  __socialaiDb?: Database;
};

const globalScope = globalThis as typeof globalThis & Scope;

function readEnv(key: string): string | undefined {
  // `process.env` is populated by @opennextjs/cloudflare from the Worker env,
  // but fall back to the raw Cloudflare env for safety.
  const fromProcess = typeof process !== "undefined" ? process.env?.[key] : undefined;
  if (fromProcess) return fromProcess;

  const cfEnv = getCloudflareEnv();
  const value = cfEnv?.[key];
  return typeof value === "string" ? value : undefined;
}

function getCloudflareEnv(): Record<string, unknown> | undefined {
  if (!isCloudflareWorkers) return undefined;
  try {
    // Lazy require so Node builds never touch the adapter.
    const { getCloudflareContext } = requireCloudflareAdapter();
    return getCloudflareContext().env as unknown as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

/**
 * Resolves the connection string.
 * Prefers a Hyperdrive binding when present: Hyperdrive pools connections on
 * Cloudflare's edge so each isolate does not hold a direct Postgres connection.
 */
function getConnectionString(): string {
  const cfEnv = getCloudflareEnv();
  const hyperdrive = cfEnv?.HYPERDRIVE as { connectionString?: string } | undefined;
  if (hyperdrive?.connectionString) return hyperdrive.connectionString;

  return (
    readEnv("DATABASE_URL") ??
    "postgresql://postgres:postgres@127.0.0.1:5432/app_db"
  );
}

function createPool(): Pool {
  const connectionString = getConnectionString();
  const useTls = !/^postgres(ql)?:\/\/[^/]*(localhost|127\.0\.0\.1)/.test(connectionString);

  return new Pool({
    connectionString,
    // One connection per isolate keeps us far below Postgres connection limits.
    max: isCloudflareWorkers ? 1 : 10,
    connectionTimeoutMillis: 10_000,
    // Managed Postgres (Neon/Supabase/Railway/RDS) requires TLS; local does not.
    ssl:
      useTls && !/sslmode=disable/.test(connectionString)
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

function requireCloudflareAdapter(): {
  getCloudflareContext: () => { env: unknown; ctx: ExecutionContextLike };
} {
  return require("@opennextjs/cloudflare");
}

type ExecutionContextLike = {
  waitUntil?: (promise: Promise<unknown>) => void;
} & Scope;

/**
 * Best-effort close: waits until every checked-out connection went back to the
 * pool, then drains it. Runs inside `waitUntil` so it never delays the response
 * and never closes a socket that is still in use by the current request.
 */
function scheduleClose(pool: Pool, ctx: ExecutionContextLike): void {
  if (typeof ctx.waitUntil !== "function") return;

  ctx.waitUntil(
    (async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      for (let i = 0; i < 200; i++) {
        await sleep(25);
        const busy = pool.totalCount - pool.idleCount;
        if (pool.totalCount > 0 && busy === 0 && pool.waitingCount === 0) break;
      }
      await pool.end().catch(() => undefined);
    })()
  );
}

function getScope(): Scope {
  if (!isCloudflareWorkers) return globalScope;
  try {
    const { getCloudflareContext } = requireCloudflareAdapter();
    // `ctx` (ExecutionContext) is a fresh object per request -> perfect cache key.
    return getCloudflareContext().ctx as Scope;
  } catch {
    // Outside a request context (build / static generation). Falling back to the
    // global scope is safe because no request-owned I/O exists yet.
    return globalScope;
  }
}

function resolveDb(): Database {
  const scope = getScope();
  if (scope.__socialaiDb) return scope.__socialaiDb;

  const pool = createPool();
  const database = drizzle(pool, { schema });

  scope.__socialaiPool = pool;
  scope.__socialaiDb = database;

  if (isCloudflareWorkers && scope !== globalScope) {
    scheduleClose(pool, scope as ExecutionContextLike);
  }

  return database;
}

function resolvePool(): Pool {
  const scope = getScope();
  if (!scope.__socialaiPool) resolveDb();
  return scope.__socialaiPool!;
}

/**
 * Lazy proxies: nothing connects at import time, so `next build` and Workers
 * cold starts never open a socket. The pool is created on first real query.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const client = resolveDb();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const target = resolvePool();
    const value = Reflect.get(target as object, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
