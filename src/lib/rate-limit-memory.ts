type Bucket = { resetAt: number; count: number };

const store = new Map<string, Bucket>();

function prune(key: string, now: number) {
  const b = store.get(key);
  if (b && b.resetAt <= now) {
    store.delete(key);
  }
}

/**
 * Prosty limiter w pamięci procesu (wystarczy dla dev i jednej instancji).
 * W środowisku wieloinstancyjnym warto podmienić na Redis / Upstash.
 */
export function checkRateLimitMemory(
  key: string,
  max: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(key, now);
  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { resetAt: now + windowMs, count: 1 });
    return { ok: true };
  }
  if (existing.count < max) {
    existing.count += 1;
    return { ok: true };
  }
  const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return { ok: false, retryAfterSec };
}
