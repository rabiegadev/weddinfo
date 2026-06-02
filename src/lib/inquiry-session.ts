import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "weddinfo_guest_view";
const TTL_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.WEDDINFO_COOKIE_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set.");
  }
  return secret;
}

function hmac(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function sign(publicId: string, exp: number): string {
  const payload = `${publicId}:${exp}`;
  return `${payload}.${hmac(payload)}`;
}

function verifyToken(token: string, publicId: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const [id, expRaw] = payload.split(":");
  const exp = Number(expRaw);
  if (id !== publicId || !Number.isFinite(exp) || exp < Date.now()) return false;

  const expected = hmac(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setGuestViewCookie(publicId: string): Promise<void> {
  const exp = Date.now() + TTL_SECONDS * 1000;
  const token = sign(publicId, exp);
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${publicId}:${token}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function hasGuestViewAccess(publicId: string): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const colon = raw.indexOf(":");
  if (colon <= 0) return false;
  const id = raw.slice(0, colon);
  const token = raw.slice(colon + 1);
  if (id !== publicId) return false;
  return verifyToken(token, publicId);
}
