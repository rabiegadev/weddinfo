"use server";

import { insertInquiry } from "@/data/inquiries";
import type { AttachmentKind } from "@/db/schema";
import { verifyCaptchaAnswer } from "@/lib/captcha";
import { generatePublicInquiryId } from "@/lib/id";
import { MAX_INQUIRY_FILES, saveInquiryFiles, validateUploadFile } from "@/lib/inquiry-uploads";
import { sendInquiryAdminNotificationEmail, sendInquiryConfirmationEmail } from "@/lib/mail";
import { generateGuestPassword, hashGuestPassword } from "@/lib/password";
import { parseInquiryFormData } from "@/lib/validation/inquiry-form";
import { ZodError } from "zod";

export type SubmitInquiryResult =
  | { ok: true; publicId: string; guestPassword?: string }
  | { ok: false; error: string };

function collectFiles(fd: FormData): { file: File; kind: AttachmentKind }[] {
  const out: { file: File; kind: AttachmentKind }[] = [];
  for (const [key, value] of fd.entries()) {
    if (!(value instanceof File) || !value.size) continue;
    if (key === "inspirationFiles") out.push({ file: value, kind: "inspiration" });
    if (key === "couplePhotoFiles") out.push({ file: value, kind: "couple_photo" });
    if (key === "contactFiles") out.push({ file: value, kind: "contact_file" });
  }
  return out;
}

function mapParsedToInsert(parsed: ReturnType<typeof parseInquiryFormData>) {
  if (parsed.inquiryType === "contact") {
    return {
      inquiryType: parsed.inquiryType,
      clientEmail: parsed.clientEmail,
      clientPhone: parsed.clientPhone ?? null,
      contactFullName: parsed.contactFullName,
      contactMessage: parsed.contactMessage,
      displayName: parsed.contactFullName,
    };
  }

  const common = {
    inquiryType: parsed.inquiryType,
    clientEmail: parsed.clientEmail,
    clientPhone: parsed.clientPhone ?? null,
    brideName: parsed.brideName,
    groomName: parsed.groomName,
    weddingDate: parsed.weddingDate,
    ceremonyLocation: parsed.ceremonyLocation,
    receptionLocation: parsed.receptionLocation,
    scheduleNotes: parsed.scheduleNotes ?? null,
    lodgingInfo: parsed.lodgingInfo ?? null,
    afterpartyInfo: parsed.afterpartyInfo ?? null,
    guestInfo: parsed.guestInfo ?? null,
    displayName: `${parsed.brideName} & ${parsed.groomName}`,
  };

  if (parsed.inquiryType === "individual") {
    return {
      ...common,
      colorPreferences: parsed.colorPreferences ?? null,
      moodClimate: parsed.moodClimate ?? null,
      themesMotifs: parsed.themesMotifs ?? null,
      suggestions: parsed.suggestions ?? null,
      wantsQrCode: parsed.wantsQrCode,
      qrCodeNotes: parsed.qrCodeNotes ?? null,
      wantsRsvp: parsed.wantsRsvp,
      rsvpNotes: parsed.rsvpNotes ?? null,
      wantsPasswordProtection: parsed.wantsPasswordProtection,
      wantsGallery: parsed.wantsGallery,
    };
  }

  if (parsed.inquiryType === "premium") {
    return {
      ...common,
      templateName: parsed.templateName,
      additionalInfo: parsed.additionalInfo ?? null,
      correctionRequests: parsed.correctionRequests ?? null,
      wantsRsvp: parsed.wantsRsvp,
      rsvpNotes: parsed.rsvpNotes ?? null,
      wantsQrCode: parsed.wantsQrCode,
      qrCodeNotes: parsed.qrCodeNotes ?? null,
    };
  }

  return {
    ...common,
    templateName: parsed.templateName,
    additionalInfo: parsed.additionalInfo ?? null,
    correctionRequests: parsed.correctionRequests ?? null,
  };
}

export async function submitInquiryForm(fd: FormData): Promise<SubmitInquiryResult> {
  try {
    const parsed = parseInquiryFormData(fd);

    if (parsed.website) {
      return { ok: true, publicId: "000000" };
    }

    if (!verifyCaptchaAnswer(parsed.captchaToken, parsed.captchaAnswer)) {
      return { ok: false, error: "Niepoprawna captcha — spróbuj ponownie." };
    }

    const files = collectFiles(fd);
    if (files.length > MAX_INQUIRY_FILES) {
      return { ok: false, error: `Można przesłać maksymalnie ${MAX_INQUIRY_FILES} pliki graficzne.` };
    }
    for (const { file } of files) {
      const err = validateUploadFile(file);
      if (err) return { ok: false, error: err };
    }

    const publicId = generatePublicInquiryId();
    const guestPassword = generateGuestPassword(8);
    const guestPasswordHash = await hashGuestPassword(guestPassword);
    const mapped = mapParsedToInsert(parsed);

    const savedFiles = files.length > 0 ? await saveInquiryFiles(publicId, files) : [];

    await insertInquiry(
      {
        publicId,
        guestPasswordHash,
        inquiryType: mapped.inquiryType,
        clientEmail: mapped.clientEmail,
        clientPhone: mapped.clientPhone,
        contactFullName: "contactFullName" in mapped ? mapped.contactFullName : null,
        contactMessage: "contactMessage" in mapped ? mapped.contactMessage : null,
        brideName: "brideName" in mapped ? mapped.brideName : null,
        groomName: "groomName" in mapped ? mapped.groomName : null,
        weddingDate: "weddingDate" in mapped ? mapped.weddingDate : null,
        ceremonyLocation: "ceremonyLocation" in mapped ? mapped.ceremonyLocation : null,
        receptionLocation: "receptionLocation" in mapped ? mapped.receptionLocation : null,
        scheduleNotes: "scheduleNotes" in mapped ? mapped.scheduleNotes : null,
        lodgingInfo: "lodgingInfo" in mapped ? mapped.lodgingInfo : null,
        afterpartyInfo: "afterpartyInfo" in mapped ? mapped.afterpartyInfo : null,
        guestInfo: "guestInfo" in mapped ? mapped.guestInfo : null,
        colorPreferences: "colorPreferences" in mapped ? mapped.colorPreferences : null,
        moodClimate: "moodClimate" in mapped ? mapped.moodClimate : null,
        themesMotifs: "themesMotifs" in mapped ? mapped.themesMotifs : null,
        suggestions: "suggestions" in mapped ? mapped.suggestions : null,
        additionalInfo: "additionalInfo" in mapped ? mapped.additionalInfo : null,
        correctionRequests: "correctionRequests" in mapped ? mapped.correctionRequests : null,
        templateName: "templateName" in mapped ? mapped.templateName : null,
        wantsQrCode: "wantsQrCode" in mapped ? mapped.wantsQrCode : null,
        qrCodeNotes: "qrCodeNotes" in mapped ? mapped.qrCodeNotes : null,
        wantsRsvp: "wantsRsvp" in mapped ? mapped.wantsRsvp : null,
        rsvpNotes: "rsvpNotes" in mapped ? mapped.rsvpNotes : null,
        wantsPasswordProtection:
          "wantsPasswordProtection" in mapped ? mapped.wantsPasswordProtection : null,
        wantsGallery: "wantsGallery" in mapped ? mapped.wantsGallery : null,
      },
      savedFiles,
    );

    const mailPayload = {
      publicId,
      guestPassword,
      inquiryType: mapped.inquiryType,
      clientEmail: mapped.clientEmail,
      displayName: mapped.displayName,
    };

    const confirm = await sendInquiryConfirmationEmail(mailPayload);
    if (!confirm.ok) {
      return { ok: false, error: "Zapisano zgłoszenie, ale nie udało się wysłać e-maila potwierdzającego." };
    }

    const admin = await sendInquiryAdminNotificationEmail(mailPayload);
    if (!admin.ok) {
      console.error("[submitInquiryForm] admin mail failed", admin.error);
    }

    const devReturn =
      process.env.WEDDINFO_DEV_RETURN_PASSWORD === "true" &&
      process.env.NODE_ENV !== "production";

    return { ok: true, publicId, guestPassword: devReturn ? guestPassword : undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0]?.message ?? "Sprawdź poprawność pól formularza.";
      return { ok: false, error: first };
    }
    console.error("[submitInquiryForm]", error);
    return { ok: false, error: "Nie udało się wysłać formularza. Spróbuj ponownie później." };
  }
}
