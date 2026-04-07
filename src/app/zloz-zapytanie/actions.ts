"use server";

import { getDb, inquiries } from "@/db";
import { createPublicId } from "@/lib/id";
import { generateGuestPassword, hashGuestPassword } from "@/lib/password";
import { inquiryFormSchema } from "@/lib/validation/inquiry";

export type SubmitInquiryResult =
  | { ok: true; publicId: string; guestPassword?: string }
  | { ok: false; error: string };

export async function submitInquiry(
  raw: unknown,
): Promise<SubmitInquiryResult> {
  const parsed = inquiryFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Sprawdź poprawność pól formularza." };
  }
  const data = parsed.data;
  const publicId = createPublicId();
  const guestPassword = generateGuestPassword();
  let guestPasswordHash: string;
  try {
    guestPasswordHash = await hashGuestPassword(guestPassword);
  } catch {
    return { ok: false, error: "Nie udało się zabezpieczyć hasła. Spróbuj ponownie." };
  }

  const db = getDb();
  const weddingDate =
    data.weddingDate?.trim() ? data.weddingDate.trim() : null;

  try {
    await db.insert(inquiries).values({
      publicId,
      partner1FirstName: data.partner1FirstName,
      partner1LastName: data.partner1LastName,
      partner2FirstName: data.partner2FirstName,
      partner2LastName: data.partner2LastName,
      weddingDate,
      locationName: data.locationName,
      locationLat: data.locationLat || null,
      locationLng: data.locationLng || null,
      colorPalette: data.colorPalette || null,
      themes: data.themes || null,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone || null,
      schedule: data.schedule,
      accommodationNote: data.accommodationNote || null,
      rsvpEnabled: data.rsvpEnabled,
      rsvpDeadline: data.rsvpDeadline || null,
      extraNotes: data.extraNotes || null,
      guestPasswordHash,
    });
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error:
        "Nie udało się zapisać zapytania. Sprawdź połączenie z bazą i spróbuj ponownie.",
    };
  }

  const devShowPassword = process.env.WEDDINFO_DEV_RETURN_PASSWORD === "true";
  return {
    ok: true,
    publicId,
    ...(devShowPassword ? { guestPassword } : {}),
  };
}
