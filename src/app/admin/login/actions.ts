"use server";

import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { signAdminSessionToken } from "@/lib/admin-session";
import { ADMIN_SESSION_TTL_SECONDS } from "@/lib/admin-session-config";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { getClientIpFromHeaders } from "@/lib/client-ip";
import { checkRateLimitMemory } from "@/lib/rate-limit-memory";

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; error: string };

const ADMIN_LOGIN_PER_IP_MAX = 15;
const ADMIN_LOGIN_PER_IP_WINDOW_MS = 15 * 60 * 1000;

export async function adminLogin(password: string): Promise<AdminLoginResult> {
  const headerList = await headers();
  const ip = getClientIpFromHeaders(headerList);
  const rl = checkRateLimitMemory(
    `admin-login:ip:${ip}`,
    ADMIN_LOGIN_PER_IP_MAX,
    ADMIN_LOGIN_PER_IP_WINDOW_MS,
  );
  if (!rl.ok) {
    return {
      ok: false,
      error: `Zbyt wiele prób logowania. Spróbuj ponownie za ${rl.retryAfterSec} s.`,
    };
  }

  const hash = process.env.WEDDINFO_ADMIN_PASSWORD_HASH?.trim();
  if (!hash) {
    return {
      ok: false,
      error:
        "Panel nie jest skonfigurowany (brak WEDDINFO_ADMIN_PASSWORD_HASH w środowisku).",
    };
  }
  const plain = password.trim();
  if (!plain) {
    return { ok: false, error: "Podaj hasło." };
  }
  const match = await bcrypt.compare(plain, hash);
  if (!match) {
    return { ok: false, error: "Nieprawidłowe hasło." };
  }
  let token: string;
  try {
    token = signAdminSessionToken();
  } catch {
    return {
      ok: false,
      error: "Błąd konfiguracji serwera (WEDDINFO_COOKIE_SECRET).",
    };
  }
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return { ok: true };
}
