"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getDb, inquiries } from "@/db";
import { insertInquiryMessage } from "@/data/inquiry-messages";
import {
  getInquiryByPublicId,
  getInquiryInternalIdByPublicId,
} from "@/data/inquiries";
import { insertRsvpResponse } from "@/data/rsvp-responses";
import { verifyInquiryViewToken, signInquiryViewToken } from "@/lib/inquiry-session";
import { verifyGuestPassword } from "@/lib/password";
import {
  messageBodySchema,
  rsvpFormSchema,
} from "@/lib/validation/correspondence";
import { z } from "zod";

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

export type GuestActionResult = { ok: true } | { ok: false; error: string };

export async function postGuestMessage(
  publicId: string,
  bodyRaw: string,
): Promise<GuestActionResult> {
  const unlocked = await inquiryViewCookieValid(publicId);
  if (!unlocked) {
    return { ok: false, error: "Sesja wygasła — zaloguj się ponownie hasłem." };
  }
  const body = messageBodySchema.safeParse(bodyRaw);
  if (!body.success) {
    return { ok: false, error: "Treść wiadomości jest nieprawidłowa." };
  }
  const inquiryId = await getInquiryInternalIdByPublicId(publicId);
  if (!inquiryId) return { ok: false, error: "Nie znaleziono zapytania." };
  await insertInquiryMessage(inquiryId, "guest", body.data);
  revalidatePath(`/zapytanie/${publicId}`);
  return { ok: true };
}

export async function submitGuestRsvp(
  publicId: string,
  raw: unknown,
): Promise<GuestActionResult> {
  const unlocked = await inquiryViewCookieValid(publicId);
  if (!unlocked) {
    return { ok: false, error: "Sesja wygasła — zaloguj się ponownie hasłem." };
  }
  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return { ok: false, error: "Nie znaleziono zapytania." };
  if (!inquiry.rsvpEnabled) {
    return { ok: false, error: "RSVP nie jest włączone dla tego zapytania." };
  }
  const parsed = rsvpFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Sprawdź poprawność pól formularza." };
  }
  const emailTrim = parsed.data.guestEmail?.trim();
  let guestEmail: string | null = null;
  if (emailTrim) {
    const em = z.string().email().safeParse(emailTrim);
    if (!em.success) {
      return { ok: false, error: "Nieprawidłowy adres e-mail." };
    }
    guestEmail = em.data;
  }
  const inquiryId = await getInquiryInternalIdByPublicId(publicId);
  if (!inquiryId) return { ok: false, error: "Nie znaleziono zapytania." };
  await insertRsvpResponse(inquiryId, {
    guestName: parsed.data.guestName,
    guestEmail,
    attending: parsed.data.attending,
    dietaryNote: parsed.data.dietaryNote?.trim() || null,
  });
  revalidatePath(`/zapytanie/${publicId}`);
  revalidatePath(`/admin/zapytanie/${publicId}`);
  return { ok: true };
}
