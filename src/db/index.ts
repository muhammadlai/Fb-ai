import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: NodePgDatabase<typeof schema>;
};

function getDb(): NodePgDatabase<typeof schema> {
  if (globalForDb.__arenaNextJsPostgresqlDb) {
    return globalForDb.__arenaNextJsPostgresqlDb;
  }

  const databaseUrl =
    process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

  const pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  const instance = drizzle(pool, { schema });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlDb = instance;
  }

  return instance;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    if (!globalForDb.__arenaNextJsPostgresqlPool) {
      const databaseUrl =
        process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
      globalForDb.__arenaNextJsPostgresqlPool = new Pool({ connectionString: databaseUrl });
    }
    const targetPool = globalForDb.__arenaNextJsPostgresqlPool;
    const value = (targetPool as any)[prop];
    return typeof value === "function" ? value.bind(targetPool) : value;
  },
});

export const db: NodePgDatabase<typeof schema> = new Proxy(
  {} as NodePgDatabase<typeof schema>,
  {
    get(_target, prop) {
      const client = getDb();
      const value = (client as any)[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);
