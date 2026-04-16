/** Najlepszy dostępny adres IP klienta z nagłówków proxy (Vercel / nginx). */
export function getClientIpFromHeaders(headersList: Headers): string {
  const xff = headersList.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headersList.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
