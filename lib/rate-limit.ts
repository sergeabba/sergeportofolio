import { getSupabase, hasServiceRole } from "./supabase-server";

type RateLimitEntry = { count: number; resetAt: number };
type Result = { allowed: boolean; retryAfterMs: number };

const store = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 10_000;

function memoryLimit(key: string, windowMs: number, maxRequests: number): Result {
  const now = Date.now();
  for (const [k, entry] of store) if (now > entry.resetAt) store.delete(k);
  if (store.size > MAX_STORE_SIZE) store.clear();

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }
  entry.count++;
  return entry.count > maxRequests
    ? { allowed: false, retryAfterMs: entry.resetAt - now }
    : { allowed: true, retryAfterMs: 0 };
}

/**
 * Rate limiter shared across serverless instances.
 *
 * Uses the `check_rate_limit` Postgres function (supabase/schema.sql) when the
 * service-role key is configured, so the limit holds on Vercel where each
 * instance has its own memory. Falls back to an in-memory limiter otherwise.
 */
export function rateLimit(options: { name: string; windowMs: number; maxRequests: number }) {
  const { name, windowMs, maxRequests } = options;

  return async (ip: string): Promise<Result> => {
    const key = `${name}:${ip === "::1" ? "127.0.0.1" : ip}`;
    const supabase = hasServiceRole() ? getSupabase() : null;

    if (supabase) {
      const { data, error } = await supabase.rpc("check_rate_limit", {
        p_key: key,
        p_window_seconds: Math.ceil(windowMs / 1000),
        p_max: maxRequests,
      });
      if (!error && data && typeof data === "object") {
        const row = (Array.isArray(data) ? data[0] : data) as { allowed: boolean; retry_after_ms: number };
        if (row && typeof row.allowed === "boolean") {
          return { allowed: row.allowed, retryAfterMs: Number(row.retry_after_ms) || 0 };
        }
      }
    }
    return memoryLimit(key, windowMs, maxRequests);
  };
}
