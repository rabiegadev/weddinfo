"use server";

import { getDb, inquiries } from "@/db";
import { createPublicId } from "@/lib/id";
import { sendInquiryConfirmationEmail } from "@/lib/mail";
import { generateGuestPassword, hashGuestPassword } from "@/lib/password";
import { inquiryFormSchema } from "@/lib/validation/inquiry";

export type SubmitInquiryResult =
  | {
      ok: true;
      publicId: string;
      /** Tylko gdy e-mail nie został wysłany — zapisz hasło i przekaż parze. */
      guestPassword?: string;
      mailSent: boolean;
    }
  | { ok: false; error: string };

function splitNameParts(fullName: string): { firstName: string; lastName: string } {
  const normalized = fullName.trim();
  if (!normalized) {
    return { firstName: "Kontakt", lastName: "Formularz" };
  }
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0] ?? "Kontakt", lastName: "Formularz" };
  }
  const firstName = parts.shift() ?? "Kontakt";
  const lastName = parts.join(" ") || "Formularz";
  return { firstName, lastName };
}

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
  const isContact = data.inquiryType === "contact";
  const contactNameParts = splitNameParts(data.contactFullName ?? "");
  const partner1FirstName = isContact
    ? contactNameParts.firstName
    : data.partner1FirstName;
  const partner1LastName = isContact ? contactNameParts.lastName : data.partner1LastName;
  const partner2FirstName = isContact ? "-" : data.partner2FirstName;
  const partner2LastName = isContact ? "-" : data.partner2LastName;

  try {
    await db.insert(inquiries).values({
      publicId,
      inquiryType: data.inquiryType,
      partner1FirstName,
      partner1LastName,
      partner2FirstName,
      partner2LastName,
      weddingDate,
      locationName: data.locationName || null,
      locationLat: data.locationLat || null,
      locationLng: data.locationLng || null,
      weddingVenueName: data.weddingVenueName || null,
      weddingVenuePostalCode: data.weddingVenuePostalCode || null,
      weddingVenueCity: data.weddingVenueCity || null,
      weddingVenueStreet: data.weddingVenueStreet || null,
      weddingVenueMapLink: data.weddingVenueMapLink || null,
      ceremonyType: data.ceremonyType || null,
      ceremonyName: data.ceremonyName || null,
      ceremonyPostalCode: data.ceremonyPostalCode || null,
      ceremonyCity: data.ceremonyCity || null,
      ceremonyStreet: data.ceremonyStreet || null,
      ceremonyMapLink: data.ceremonyMapLink || null,
      ceremonyOtherDetails: data.ceremonyOtherDetails || null,
      travelDetails: data.travelDetails || null,
      colorPalette: data.colorPalette || null,
      themes: data.themes || null,
      templateName: data.templateName || null,
      heroPhotoName: data.heroPhotoName || null,
      inspirationFilesNames: data.inspirationFilesNames ?? [],
      schedulePreferences: data.schedulePreferences || null,
      scheduleSuggestions: data.scheduleSuggestions ?? [],
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone || null,
      schedule: data.schedule ?? [],
      accommodationNote: data.accommodationNote || null,
      overnightTransportNote: data.overnightTransportNote || null,
      afterpartyNote: data.afterpartyNote || null,
      guestInfoNote: data.guestInfoNote || null,
      rsvpEnabled: data.rsvpEnabled ?? false,
      rsvpDeadline: data.rsvpDeadline || null,
      rsvpNotes: data.rsvpNotes || null,
      extraNotes: data.extraNotes || null,
      contactFullName: data.contactFullName || null,
      contactMessage: data.contactMessage || null,
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

  const coupleLabel = isContact
    ? (data.contactFullName?.trim() || "Formularz kontaktowy")
    : `${data.partner1FirstName} ${data.partner1LastName} & ${data.partner2FirstName} ${data.partner2LastName}`;
  const inquiryPath = `/zapytanie/${encodeURIComponent(publicId)}`;

  const mail = await sendInquiryConfirmationEmail({
    to: data.clientEmail,
    publicId,
    guestPassword,
    coupleLabel,
    inquiryPath,
  });

  const mailSent = mail.ok;
  if (!mailSent) {
    console.error("[submitInquiry] E-mail nie wysłany:", mail.error);
  }

  const devShowPassword = process.env.WEDDINFO_DEV_RETURN_PASSWORD === "true";

  return {
    ok: true,
    publicId,
    mailSent,
    ...(!mailSent || devShowPassword ? { guestPassword } : {}),
  };
}
