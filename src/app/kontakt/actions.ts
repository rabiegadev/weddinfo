"use server";

import { insertInquiry } from "@/data/inquiries";
import type { AttachmentKind } from "@/db/schema";
import { verifyCaptchaAnswer } from "@/lib/captcha";
import { generatePublicInquiryId } from "@/lib/id";
import { MAX_INQUIRY_FILES, saveInquiryFiles, validateUploadFile } from "@/lib/inquiry-uploads";
import { sendInquiryAdminNotificationEmail, sendInquiryConfirmationEmail } from "@/lib/mail";
import { generateGuestPassword, hashGuestPassword } from "@/lib/password";
import { consumeRateLimit, formatRetryAfter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-context";
import { checkInquiryForSpam } from "@/lib/spam-heuristics";
import { isTurnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";
import { parseInquiryFormData } from "@/lib/validation/inquiry-form";
import { extractMysqlErrorCode, extractMysqlErrorMessage } from "@/lib/mysql-errors";
import { ZodError } from "zod";

const INQUIRY_RATE_LIMIT = 6;
const INQUIRY_RATE_WINDOW_SECONDS = 10 * 60;

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

function formatSubmitError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Sprawdź poprawność pól formularza.";
  }

  const mysqlMessage = extractMysqlErrorMessage(error);
  const mysqlCode = extractMysqlErrorCode(error);
  const message = error instanceof Error ? error.message : String(error);
  const code =
    mysqlCode ??
    (error && typeof error === "object" && "code" in error ? String(error.code) : "");

  if (process.env.NODE_ENV !== "production") {
    if (code === "ECONNREFUSED" && message.includes("3306")) {
      return "Brak połączenia z MySQL. Na localu użyj hosta SeoHost (np. h63.seohost.pl), nie localhost.";
    }
    if (code === "ER_ACCESS_DENIED_ERROR") {
      return "MySQL odrzucił połączenie — dodaj swój adres IP w panelu SeoHost (zdalny dostęp MySQL).";
    }
    if (code === "ER_NO_DEFAULT_FOR_FIELD" || mysqlMessage?.includes("doesn't have a default value")) {
      return "Tabela inquiries wymaga AUTO_INCREMENT na kolumnie id — uruchom SQL z drizzle/fix_inquiries_autoincrement.sql w phpMyAdmin.";
    }
    if (message.includes("DATABASE_URL is not set")) {
      return "Brak DATABASE_URL w .env.local.";
    }
    if (mysqlMessage) {
      return `Błąd MySQL (${code ?? "?"}): ${mysqlMessage}`;
    }
    return `Błąd serwera (dev): ${code ? `${code} — ` : ""}${message}`;
  }

  return "Nie udało się wysłać formularza. Spróbuj ponownie później.";
}

function collectTextFields(parsed: ReturnType<typeof parseInquiryFormData>): string[] {
  const keys = [
    "contactMessage",
    "scheduleNotes",
    "lodgingInfo",
    "afterpartyInfo",
    "guestInfo",
    "colorPreferences",
    "moodClimate",
    "themesMotifs",
    "suggestions",
    "additionalInfo",
    "correctionRequests",
    "qrCodeNotes",
    "rsvpNotes",
  ] as const;
  const out: string[] = [];
  for (const key of keys) {
    if (key in parsed) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string") out.push(value);
    }
  }
  return out;
}

export async function submitInquiryForm(fd: FormData): Promise<SubmitInquiryResult> {
  try {
    const ip = await getClientIp();
    const limit = await consumeRateLimit(`inquiry:${ip}`, INQUIRY_RATE_LIMIT, INQUIRY_RATE_WINDOW_SECONDS);
    if (limit.blocked) {
      return {
        ok: false,
        error: `Zbyt wiele zgłoszeń z tego urządzenia. Spróbuj ponownie za ${formatRetryAfter(limit.retryAfterSeconds)}.`,
      };
    }

    const parsed = parseInquiryFormData(fd);

    if (parsed.inquiryType !== "contact") {
      return {
        ok: false,
        error:
          "Formularze pakietów są tymczasowo niedostępne. Skorzystaj z formularza kontaktowego na stronie Kontakt.",
      };
    }

    if (parsed.website) {
      return { ok: true, publicId: "000000" };
    }

    if (isTurnstileEnabled()) {
      const passed = await verifyTurnstileToken(parsed.turnstileToken, ip);
      if (!passed) {
        return { ok: false, error: "Weryfikacja antyspamowa nie powiodła się — odśwież stronę i spróbuj ponownie." };
      }
    } else if (!verifyCaptchaAnswer(parsed.captchaToken, parsed.captchaAnswer)) {
      return { ok: false, error: "Niepoprawna captcha — spróbuj ponownie." };
    }

    const spam = checkInquiryForSpam({ email: parsed.clientEmail, textFields: collectTextFields(parsed) });
    if (!spam.ok) {
      return { ok: false, error: spam.reason };
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
    console.error("[submitInquiryForm]", error);
    return { ok: false, error: formatSubmitError(error) };
  }
}
