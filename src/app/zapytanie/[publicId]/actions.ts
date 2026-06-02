"use server";

import { getInquiryByPublicId } from "@/data/inquiries";
import { setGuestViewCookie } from "@/lib/inquiry-session";
import { verifyGuestPassword } from "@/lib/password";

export async function unlockInquiryWithPassword(
  publicIdRaw: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const publicId = publicIdRaw.trim().replace(/^#/, "");
  if (!publicId) return { ok: false, error: "Podaj numer zgłoszenia." };
  if (!password.trim()) return { ok: false, error: "Podaj hasło." };

  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return { ok: false, error: "Nie znaleziono zgłoszenia o podanym numerze." };

  const valid = await verifyGuestPassword(password, inquiry.guestPasswordHash);
  if (!valid) return { ok: false, error: "Nieprawidłowe hasło." };

  await setGuestViewCookie(publicId);
  return { ok: true };
}
