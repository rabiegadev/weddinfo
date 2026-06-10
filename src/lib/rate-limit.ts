import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { rateLimits } from "@/db/schema";
import { mysqlDateTimeNow } from "@/lib/mysql-datetime";

export type RateLimitResult = {
  blocked: boolean;
  /** Sekundy do końca aktualnego okna (gdy blocked). */
  retryAfterSeconds: number;
};

const NOT_BLOCKED: RateLimitResult = { blocked: false, retryAfterSeconds: 0 };

/** `YYYY-MM-DD HH:MM:SS` (czas lokalny, jak mysqlDateTimeNow) → ms. */
function parseMysqlDateTime(value: string): number {
  return new Date(value.replace(" ", "T")).getTime();
}

async function getRow(bucket: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.bucket, bucket))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Sprawdza, czy bucket jest już zablokowany — bez zwiększania licznika.
 * Fail-open: w razie błędu bazy nie blokujemy (formularz i tak wymaga DB do zapisu).
 */
export async function peekRateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  try {
    const row = await getRow(bucket);
    if (!row) return NOT_BLOCKED;

    const elapsedMs = Date.now() - parseMysqlDateTime(row.windowStartedAt);
    const windowMs = windowSeconds * 1000;
    if (elapsedMs >= windowMs) return NOT_BLOCKED;

    if (row.count >= limit) {
      return { blocked: true, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000)) };
    }
    return NOT_BLOCKED;
  } catch (error) {
    console.error("[rate-limit] peek failed", error);
    return NOT_BLOCKED;
  }
}

/** Rejestruje jedno „trafienie" w buckecie (zakłada/resetuje okno w razie potrzeby). */
export async function registerRateLimitHit(bucket: string, windowSeconds: number): Promise<void> {
  try {
    const db = getDb();
    const now = mysqlDateTimeNow();
    const row = await getRow(bucket);

    if (!row) {
      await db.insert(rateLimits).values({ bucket, count: 1, windowStartedAt: now, updatedAt: now });
      return;
    }

    const elapsedMs = Date.now() - parseMysqlDateTime(row.windowStartedAt);
    if (elapsedMs >= windowSeconds * 1000) {
      await db
        .update(rateLimits)
        .set({ count: 1, windowStartedAt: now, updatedAt: now })
        .where(eq(rateLimits.bucket, bucket));
    } else {
      await db
        .update(rateLimits)
        .set({ count: sql`${rateLimits.count} + 1`, updatedAt: now })
        .where(eq(rateLimits.bucket, bucket));
    }
  } catch (error) {
    console.error("[rate-limit] register failed", error);
  }
}

/** Zeruje bucket (np. po udanym logowaniu). */
export async function clearRateLimit(bucket: string): Promise<void> {
  try {
    const db = getDb();
    await db.delete(rateLimits).where(eq(rateLimits.bucket, bucket));
  } catch (error) {
    console.error("[rate-limit] clear failed", error);
  }
}

/**
 * Sprawdza limit i — jeśli niezablokowany — od razu rejestruje trafienie.
 * Używane dla zwykłych endpointów (każde wywołanie liczone).
 */
export async function consumeRateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const peek = await peekRateLimit(bucket, limit, windowSeconds);
  if (peek.blocked) return peek;
  await registerRateLimitHit(bucket, windowSeconds);
  return NOT_BLOCKED;
}

/** Czytelny komunikat „spróbuj ponownie za …". */
export function formatRetryAfter(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} min`;
  }
  return `${Math.max(1, seconds)} s`;
}
