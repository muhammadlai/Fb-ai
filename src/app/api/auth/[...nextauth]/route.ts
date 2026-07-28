import { handlers } from "@/auth";

/**
 * Auth.js catch-all handler.
 *
 * Serves every /api/auth/* endpoint, including the Facebook callback that
 * Meta redirects back to:
 *
 *   /api/auth/signin
 *   /api/auth/signin/facebook
 *   /api/auth/callback/facebook   <-- configure this in the Meta dashboard
 *   /api/auth/session
 *   /api/auth/csrf
 *   /api/auth/signout
 *
 * Explicit sibling routes (/api/auth/login, /api/auth/register, ...) still
 * take precedence over this catch-all, so they keep working.
 */
export const { GET, POST } = handlers;

// Auth.js needs the Node.js runtime and must never be statically optimised.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
