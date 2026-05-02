type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 10_000;

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
  // Hard cap: evict oldest entries if store is still too large
  if (store.size > MAX_STORE_SIZE) {
    const excess = store.size - MAX_STORE_SIZE;
    let i = 0;
    for (const key of store.keys()) {
      if (i++ >= excess) break;
      store.delete(key);
    }
  }
}

export function rateLimit(options: {
  windowMs: number;
  maxRequests: number;
}): (ip: string) => { allowed: boolean; retryAfterMs: number } {
  const { windowMs, maxRequests } = options;

  return (ip: string) => {
    cleanup();
    const now = Date.now();

    // Normalise IPv6 loopback to a consistent key
    const key = ip === "::1" ? "127.0.0.1" : ip;
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterMs: 0 };
    }

    entry.count++;
    if (entry.count > maxRequests) {
      return { allowed: false, retryAfterMs: entry.resetAt - now };
    }

    return { allowed: true, retryAfterMs: 0 };
  };
}
