import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET || "socialai-secret-key-32-chars-max!!"; 
// Ensure 32 bytes key
const KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();

export function encryptToken(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
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
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return encryptedText;
  }
}
