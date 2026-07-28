import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext adapter configuration for Cloudflare Workers.
 *
 * Defaults are intentionally kept: the in-memory/no-op incremental cache works
 * out of the box and requires no extra Cloudflare resources, so `build` and
 * `deploy` succeed on a bare account.
 *
 * To enable persistent ISR/SSG caching, create an R2 bucket, uncomment the
 * `NEXT_INC_CACHE_R2_BUCKET` binding in wrangler.toml and swap the export for:
 *
 *   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
 *   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
 */
export default defineCloudflareConfig();
