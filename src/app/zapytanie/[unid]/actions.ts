"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb, inquiries } from "@/db";
import { verifyInquiryViewToken, signInquiryViewToken } from "@/lib/inquiry-session";
import { verifyGuestPassword } from "@/lib/password";

const COOKIE = "weddinfo_inquiry_view";

export async function unlockInquiryWithPassword(
  publicId: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!password.trim()) {
    return { ok: false, error: "Podaj hasło dostępu." };
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.publicId, publicId))
    .limit(1);
  if (!row) {
    return { ok: false, error: "Nie znaleziono zapytania." };
  }
  const match = await verifyGuestPassword(password, row.guestPasswordHash);
  if (!match) {
    return { ok: false, error: "Nieprawidłowe hasło." };
  }
  let token: string;
  try {
    token = signInquiryViewToken(publicId);
  } catch {
    return { ok: false, error: "Błąd konfiguracji serwera (brak klucza sesji)." };
  }
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return { ok: true };
}

export async function inquiryViewCookieValid(
  publicId: string,
): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  return verifyInquiryViewToken(raw, publicId);
}
