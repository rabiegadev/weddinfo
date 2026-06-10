import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyGuestPassword } from "@/lib/password";

const COOKIE_NAME = "weddinfo_admin_session";
const TTL_SECONDS = 60 * 60 * 8;

function getSecret(): string {
  const secret = process.env.WEDDINFO_COOKIE_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set.");
  }
  return secret;
}

function isValidBcryptHash(hash: string): boolean {
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(hash);
}

function getAdminPasswordHash(): string | null {
  const b64 = process.env.WEDDINFO_ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      if (isValidBcryptHash(decoded)) return decoded;
    } catch {
      // fall through
    }
  }

  const raw = process.env.WEDDINFO_ADMIN_PASSWORD_HASH?.trim().replace(/^['"]|['"]$/g, "");
  if (raw && isValidBcryptHash(raw)) return raw;

  if (raw && process.env.NODE_ENV !== "production") {
    console.error(
      "[admin] Hash hasła wygląda na uszkodzony (Next.js interpretuje $ w .env). " +
        "Uruchom: npm run admin:hash-password -- \"haslo\" i wklej linię WEDDINFO_ADMIN_PASSWORD_HASH_B64.",
    );
  }

  return null;
}

function hmac(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function sign(exp: number): string {
  const payload = `admin:${exp}`;
  return `${payload}.${hmac(payload)}`;
}

function verifyToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const [, expRaw] = payload.split(":");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const expected = hmac(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function loginAdmin(password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const hash = getAdminPasswordHash();
  if (!hash) return { ok: false, error: "Panel admina nie jest skonfigurowany." };

  const valid = await verifyGuestPassword(password, hash);
  if (!valid) return { ok: false, error: "Nieprawidłowe hasło." };

  const exp = Date.now() + TTL_SECONDS * 1000;
  const token = sign(exp);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  });
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function hasAdminSession(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function requireAdminSession(): Promise<void> {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }
}
