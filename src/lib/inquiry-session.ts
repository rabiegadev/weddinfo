import { createHmac, timingSafeEqual } from "crypto";

type Payload = { publicId: string; exp: number };

function getSecret(): string {
  const s = process.env.WEDDINFO_COOKIE_SECRET;
  if (!s || s.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set (min. 16 znaków)");
  }
  return s;
}

export function signInquiryViewToken(publicId: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload: Payload = { publicId, exp };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyInquiryViewToken(
  token: string | undefined,
  expectedPublicId: string,
): boolean {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sig] = token.split(".") as [string, string];
  if (!payloadB64 || !sig) return false;
  const expectedSig = createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  let payload: Payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  if (payload.publicId !== expectedPublicId) return false;
  if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;
  return true;
}
