import crypto from "node:crypto";

/**
 * Pure, dependency-free auth helpers.
 *
 * Kept in their own module so `src/auth.ts` (Auth.js config) can import them
 * without pulling in `next/headers`, which would create an import cycle.
 */

const PASSWORD_SALT = "socialai_salt_2026";

/**
 * Hashes a password. Kept compatible with the original implementation so
 * existing rows in the `users` table keep working.
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + PASSWORD_SALT).digest("hex");
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  subscriptionTier: string;
  avatarUrl?: string | null;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}
