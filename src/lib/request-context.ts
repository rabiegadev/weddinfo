import { headers } from "next/headers";

/**
 * Najlepsze możliwe przybliżenie IP klienta za proxy (SeoHost / Vercel).
 * Zwraca "unknown", gdy nagłówki nie są dostępne — wtedy bucket jest współdzielony.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();

  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}
