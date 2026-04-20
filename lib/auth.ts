/**
 * Shared authentication utilities for the admin panel.
 * Centralizes token generation and verification to avoid duplication.
 */

export async function generateToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = encoder.encode("admin-session");
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const data = encoder.encode("admin-session");
  const tokenBytes = new Uint8Array(
    token.match(/.{2}/g)!.map((b) => parseInt(b, 16))
  );
  return crypto.subtle.verify("HMAC", key, tokenBytes, data);
}

/** Max age for the admin cookie (24 hours in seconds) */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24;
