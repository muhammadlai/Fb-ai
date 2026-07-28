import crypto from "node:crypto";

/**
 * AES-256-CBC token encryption.
 *
 * `node:crypto` (createHash / randomBytes / createCipheriv) is supported on
 * Cloudflare Workers when the `nodejs_compat` flag is enabled - see
 * wrangler.toml.
 *
 * The key is derived lazily instead of at module scope: on Workers `process.env`
 * is only populated once a request is being handled, so reading
 * ENCRYPTION_SECRET at import time would silently fall back to the default and
 * make tokens undecryptable later.
 */
const DEFAULT_SECRET = "socialai-secret-key-32-chars-max!!";

let cachedKey: Buffer | null = null;
let cachedSecret: string | null = null;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || DEFAULT_SECRET;
  if (cachedKey && cachedSecret === secret) return cachedKey;

  // sha256 always yields the 32 bytes aes-256 requires.
  cachedKey = crypto.createHash("sha256").update(secret).digest();
  cachedSecret = secret;
  return cachedKey;
}

export function encryptToken(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptToken(encryptedText: string): string {
  if (!encryptedText) return "";
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 2) return encryptedText; // Fallback if plain
    const iv = Buffer.from(parts[0], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);
    let decrypted = decipher.update(parts[1], "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return encryptedText;
  }
}
