import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_SESSION_TTL_SECONDS } from "@/lib/admin-session-config";

type AdminPayload = { typ: "admin"; exp: number };

function getSecret(): string {
  const s = process.env.WEDDINFO_COOKIE_SECRET;
  if (!s || s.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set (min. 16 znaków)");
  }
  return s;
}

export function signAdminSessionToken(): string {
  const exp = Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000;
  const payload: AdminPayload = { typ: "admin", exp };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(`admin:${payloadB64}`)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sig] = token.split(".") as [string, string];
  if (!payloadB64 || !sig) return false;
  const expectedSig = createHmac("sha256", getSecret())
    .update(`admin:${payloadB64}`)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  let payload: AdminPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  if (payload.typ !== "admin") return false;
  if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;
  return true;
}
