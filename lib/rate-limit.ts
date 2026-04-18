type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
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
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterMs: 0 };
    }

    entry.count++;
    if (entry.count > maxRequests) {
      return { allowed: false, retryAfterMs: entry.resetAt - now };
    }

    return { allowed: true, retryAfterMs: 0 };
  };
}
