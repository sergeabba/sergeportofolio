export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h in seconds

async function hmac(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a token encoding `issuedAt` so it expires server-side
 * even if the cookie max-age is bypassed.
 * Format: <issuedAt_hex>.<signature>
 */
export async function generateToken(secret: string): Promise<string> {
  const issuedAt = Date.now().toString(16);
  const payload = `admin-session:${issuedAt}`;
  const signature = await hmac(secret, payload);
  return `${issuedAt}.${signature}`;
}

export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const dot = token.indexOf(".");
    if (dot === -1) return false;

    const issuedAtHex = token.slice(0, dot);
    const signature = token.slice(dot + 1);

    const issuedAt = parseInt(issuedAtHex, 16);
    if (isNaN(issuedAt)) return false;

    // Reject tokens older than ADMIN_COOKIE_MAX_AGE
    if (Date.now() - issuedAt > ADMIN_COOKIE_MAX_AGE * 1000) return false;

    const payload = `admin-session:${issuedAtHex}`;
    const expected = await hmac(secret, payload);

    // Constant-time compare
    if (expected.length !== signature.length) return false;
    const enc = new TextEncoder();
    const a = enc.encode(expected);
    const b = enc.encode(signature);
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  } catch {
    return false;
  }
}
