/** Weryfikacja sesji admina w Edge (middleware) — bez node:crypto. */
import { ADMIN_SESSION_TTL_SECONDS } from "@/lib/admin-session-config";

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

function bytesToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

export async function verifyAdminSessionTokenEdge(
  token: string | undefined,
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sig] = token.split(".") as [string, string];
  if (!payloadB64 || !sig) return false;
  const secret = process.env.WEDDINFO_COOKIE_SECRET;
  if (!secret || secret.length < 16) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`admin:${payloadB64}`),
  );
  const expectedSig = bytesToBase64Url(mac);
  const sigBytes = base64UrlToBytes(sig);
  const expectedBytes = base64UrlToBytes(expectedSig);
  if (!timingSafeEqualBytes(sigBytes, expectedBytes)) return false;

  let payload: { typ?: string; exp?: number };
  try {
    payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payloadB64)),
    ) as { typ?: string; exp?: number };
  } catch {
    return false;
  }
  if (payload.typ !== "admin") return false;
  if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;
  return true;
}

export async function signAdminSessionTokenEdge(): Promise<string> {
  const secret = process.env.WEDDINFO_COOKIE_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set (min. 16 znaków)");
  }
  const payload = {
    typ: "admin",
    exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)).buffer);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`admin:${payloadB64}`),
  );
  const sig = bytesToBase64Url(mac);
  return `${payloadB64}.${sig}`;
}
