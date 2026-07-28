import { db } from "@/db";
import { sql } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await db.execute(sql`select 1`);
    // No-op unless SEED_DEMO_DATA=true.
    await seedDatabaseIfEmpty();

    return Response.json({
      ok: true,
      database: "connected",
      runtime:
        typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"
          ? "cloudflare-workers"
          : "nodejs",
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        database: "unreachable",
        error: err instanceof Error ? err.message : String(err),
        hint: "Set the DATABASE_URL secret (bunx wrangler secret put DATABASE_URL) or bind Hyperdrive.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
