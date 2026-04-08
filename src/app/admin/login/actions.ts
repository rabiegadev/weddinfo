"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signAdminSessionToken } from "@/lib/admin-session";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function adminLogin(password: string): Promise<AdminLoginResult> {
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
    maxAge: 14 * 24 * 60 * 60,
  });
  return { ok: true };
}
