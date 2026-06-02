import { z } from "zod";
import { weddingTemplateOptions } from "@/data/wedding-templates";
import { inquiryTypeEnum } from "@/db/schema";

const optionalText = z.string().trim().optional().transform((v) => (v && v.length > 0 ? v : undefined));
const requiredText = (min: number, max: number, label: string) =>
  z.string().trim().min(min, `${label} — minimum ${min} znaków.`).max(max, `${label} jest zbyt długie.`);

const email = z.string().trim().email("Podaj poprawny adres e-mail.");
const phone = z
  .string()
  .trim()
  .max(30)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const captchaFields = {
  captchaToken: z.string().min(1, "Odśwież zadanie captcha."),
  captchaAnswer: z.string().min(1, "Rozwiąż działanie."),
  website: z.string().max(0).optional(),
};

function parseBool(raw: FormDataEntryValue | null): boolean {
  return raw === "true" || raw === "on" || raw === "1";
}

const weddingBasicsShape = {
  brideName: requiredText(2, 120, "Imię i nazwisko panny młodej"),
  groomName: requiredText(2, 120, "Imię i nazwisko pana młodego"),
  weddingDate: z.string().trim().min(1, "Podaj datę ślubu."),
  ceremonyLocation: requiredText(2, 500, "Miejsce ślubu"),
  receptionLocation: requiredText(2, 500, "Miejsce wesela"),
  scheduleNotes: optionalText,
  lodgingInfo: optionalText,
  afterpartyInfo: optionalText,
  guestInfo: optionalText,
};

export const individualFormSchema = z.object({
  inquiryType: z.literal("individual"),
  clientEmail: email,
  clientPhone: phone,
  ...weddingBasicsShape,
  colorPreferences: optionalText,
  moodClimate: optionalText,
  themesMotifs: optionalText,
  suggestions: optionalText,
  wantsQrCode: z.boolean(),
  qrCodeNotes: optionalText,
  wantsRsvp: z.boolean(),
  rsvpNotes: optionalText,
  wantsPasswordProtection: z.boolean(),
  wantsGallery: z.boolean(),
  ...captchaFields,
});

export const premiumFormSchema = z.object({
  inquiryType: z.literal("premium"),
  clientEmail: email,
  clientPhone: phone,
  ...weddingBasicsShape,
  templateName: z
    .string()
    .min(1, "Wybierz szablon z listy.")
    .refine((v) => (weddingTemplateOptions as readonly string[]).includes(v), {
      message: "Wybierz szablon z listy.",
    }),
  additionalInfo: optionalText,
  correctionRequests: optionalText,
  wantsRsvp: z.boolean(),
  rsvpNotes: optionalText,
  wantsQrCode: z.boolean(),
  qrCodeNotes: optionalText,
  ...captchaFields,
});

export const basicFormSchema = z.object({
  inquiryType: z.literal("basic"),
  clientEmail: email,
  clientPhone: phone,
  ...weddingBasicsShape,
  templateName: z
    .string()
    .min(1, "Wybierz szablon z listy.")
    .refine((v) => (weddingTemplateOptions as readonly string[]).includes(v), {
      message: "Wybierz szablon z listy.",
    }),
  additionalInfo: optionalText,
  correctionRequests: optionalText,
  ...captchaFields,
});

export const contactFormSchema = z.object({
  inquiryType: z.literal("contact"),
  contactFullName: requiredText(2, 120, "Imię i nazwisko"),
  clientEmail: email,
  clientPhone: phone,
  contactMessage: requiredText(10, 5000, "Wiadomość"),
  ...captchaFields,
});

export type ParsedInquiryForm =
  | z.infer<typeof individualFormSchema>
  | z.infer<typeof premiumFormSchema>
  | z.infer<typeof basicFormSchema>
  | z.infer<typeof contactFormSchema>;

export function parseInquiryFormData(fd: FormData): ParsedInquiryForm {
  const inquiryType = String(fd.get("inquiryType") ?? "");
  const base = {
    captchaToken: String(fd.get("captchaToken") ?? ""),
    captchaAnswer: String(fd.get("captchaAnswer") ?? ""),
    website: String(fd.get("website") ?? ""),
    clientEmail: String(fd.get("clientEmail") ?? ""),
    clientPhone: fd.get("clientPhone") != null ? String(fd.get("clientPhone")) : undefined,
  };

  if (inquiryType === "individual") {
    return individualFormSchema.parse({
      inquiryType: "individual",
      ...base,
      brideName: String(fd.get("brideName") ?? ""),
      groomName: String(fd.get("groomName") ?? ""),
      weddingDate: String(fd.get("weddingDate") ?? ""),
      ceremonyLocation: String(fd.get("ceremonyLocation") ?? ""),
      receptionLocation: String(fd.get("receptionLocation") ?? ""),
      scheduleNotes: String(fd.get("scheduleNotes") ?? ""),
      lodgingInfo: String(fd.get("lodgingInfo") ?? ""),
      afterpartyInfo: String(fd.get("afterpartyInfo") ?? ""),
      guestInfo: String(fd.get("guestInfo") ?? ""),
      colorPreferences: String(fd.get("colorPreferences") ?? ""),
      moodClimate: String(fd.get("moodClimate") ?? ""),
      themesMotifs: String(fd.get("themesMotifs") ?? ""),
      suggestions: String(fd.get("suggestions") ?? ""),
      wantsQrCode: parseBool(fd.get("wantsQrCode")),
      qrCodeNotes: String(fd.get("qrCodeNotes") ?? ""),
      wantsRsvp: parseBool(fd.get("wantsRsvp")),
      rsvpNotes: String(fd.get("rsvpNotes") ?? ""),
      wantsPasswordProtection: parseBool(fd.get("wantsPasswordProtection")),
      wantsGallery: parseBool(fd.get("wantsGallery")),
    });
  }

  if (inquiryType === "premium") {
    return premiumFormSchema.parse({
      inquiryType: "premium",
      ...base,
      brideName: String(fd.get("brideName") ?? ""),
      groomName: String(fd.get("groomName") ?? ""),
      weddingDate: String(fd.get("weddingDate") ?? ""),
      ceremonyLocation: String(fd.get("ceremonyLocation") ?? ""),
      receptionLocation: String(fd.get("receptionLocation") ?? ""),
      scheduleNotes: String(fd.get("scheduleNotes") ?? ""),
      lodgingInfo: String(fd.get("lodgingInfo") ?? ""),
      afterpartyInfo: String(fd.get("afterpartyInfo") ?? ""),
      guestInfo: String(fd.get("guestInfo") ?? ""),
      templateName: String(fd.get("templateName") ?? ""),
      additionalInfo: String(fd.get("additionalInfo") ?? ""),
      correctionRequests: String(fd.get("correctionRequests") ?? ""),
      wantsRsvp: parseBool(fd.get("wantsRsvp")),
      rsvpNotes: String(fd.get("rsvpNotes") ?? ""),
      wantsQrCode: parseBool(fd.get("wantsQrCode")),
      qrCodeNotes: String(fd.get("qrCodeNotes") ?? ""),
    });
  }

  if (inquiryType === "basic") {
    return basicFormSchema.parse({
      inquiryType: "basic",
      ...base,
      brideName: String(fd.get("brideName") ?? ""),
      groomName: String(fd.get("groomName") ?? ""),
      weddingDate: String(fd.get("weddingDate") ?? ""),
      ceremonyLocation: String(fd.get("ceremonyLocation") ?? ""),
      receptionLocation: String(fd.get("receptionLocation") ?? ""),
      scheduleNotes: String(fd.get("scheduleNotes") ?? ""),
      lodgingInfo: String(fd.get("lodgingInfo") ?? ""),
      afterpartyInfo: String(fd.get("afterpartyInfo") ?? ""),
      guestInfo: String(fd.get("guestInfo") ?? ""),
      templateName: String(fd.get("templateName") ?? ""),
      additionalInfo: String(fd.get("additionalInfo") ?? ""),
      correctionRequests: String(fd.get("correctionRequests") ?? ""),
    });
  }

  if (inquiryType === "contact") {
    return contactFormSchema.parse({
      inquiryType: "contact",
      captchaToken: base.captchaToken,
      captchaAnswer: base.captchaAnswer,
      website: base.website,
      contactFullName: String(fd.get("contactFullName") ?? ""),
      clientEmail: String(fd.get("clientEmail") ?? ""),
      clientPhone: base.clientPhone,
      contactMessage: String(fd.get("contactMessage") ?? ""),
    });
  }

  throw new Error("Nieznany typ formularza.");
}

export function isInquiryType(value: string): value is (typeof inquiryTypeEnum)[number] {
  return (inquiryTypeEnum as readonly string[]).includes(value);
}
