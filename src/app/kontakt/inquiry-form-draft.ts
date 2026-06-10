import type { InquiryFormMode } from "@/config/inquiry-tabs";

export type { InquiryFormMode };

export type SharedWeddingFields = {
  brideName: string;
  groomName: string;
  weddingDate: string;
  ceremonyLocation: string;
  receptionLocation: string;
  scheduleNotes: string;
  lodgingInfo: string;
  afterpartyInfo: string;
  guestInfo: string;
  clientEmail: string;
  clientPhone: string;
};

export type IndividualFields = {
  colorPreferences: string;
  moodClimate: string;
  themesMotifs: string;
  suggestions: string;
  wantsQrCode: boolean;
  qrCodeNotes: string;
  wantsRsvp: boolean;
  rsvpNotes: string;
  wantsPasswordProtection: boolean;
  wantsGallery: boolean;
};

export type PremiumFields = {
  templateName: string;
  additionalInfo: string;
  correctionRequests: string;
  wantsRsvp: boolean;
  rsvpNotes: string;
  wantsQrCode: boolean;
  qrCodeNotes: string;
};

export type ContactFields = {
  contactFullName: string;
  contactMessage: string;
};

export type InquiryFormDraft = {
  mode: InquiryFormMode;
  shared: SharedWeddingFields;
  individual: IndividualFields;
  premium: PremiumFields;
  contact: ContactFields;
};

export type InquiryFileDraft = {
  inspirationFiles: File[];
  couplePhotoFiles: File[];
  contactFiles: File[];
};

const STORAGE_KEY = "weddinfo-inquiry-draft-v2";

export function createEmptyDraft(mode: InquiryFormMode = "individual"): InquiryFormDraft {
  return {
    mode,
    shared: {
      brideName: "",
      groomName: "",
      weddingDate: "",
      ceremonyLocation: "",
      receptionLocation: "",
      scheduleNotes: "",
      lodgingInfo: "",
      afterpartyInfo: "",
      guestInfo: "",
      clientEmail: "",
      clientPhone: "",
    },
    individual: {
      colorPreferences: "",
      moodClimate: "",
      themesMotifs: "",
      suggestions: "",
      wantsQrCode: false,
      qrCodeNotes: "",
      wantsRsvp: false,
      rsvpNotes: "",
      wantsPasswordProtection: false,
      wantsGallery: false,
    },
    premium: {
      templateName: "",
      additionalInfo: "",
      correctionRequests: "",
      wantsRsvp: false,
      rsvpNotes: "",
      wantsQrCode: false,
      qrCodeNotes: "",
    },
    contact: {
      contactFullName: "",
      contactMessage: "",
    },
  };
}

export function createEmptyFileDraft(): InquiryFileDraft {
  return {
    inspirationFiles: [],
    couplePhotoFiles: [],
    contactFiles: [],
  };
}

export function loadDraftFromSession(): InquiryFormDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InquiryFormDraft;
    if (!parsed?.mode || !parsed.shared || !parsed.individual || !parsed.premium || !parsed.contact) {
      return null;
    }
    if (!["individual", "premium", "contact"].includes(parsed.mode)) {
      parsed.mode = "individual";
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraftToSession(draft: InquiryFormDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // sessionStorage pełne lub niedostępne — ignorujemy
  }
}

export function clearDraftFromSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function buildFormDataFromDraft(
  draft: InquiryFormDraft,
  files: InquiryFileDraft,
  captchaToken: string,
  captchaAnswer: string,
): FormData {
  const fd = new FormData();
  fd.set("inquiryType", draft.mode);
  fd.set("captchaToken", captchaToken);
  fd.set("captchaAnswer", captchaAnswer);
  fd.set("website", "");

  if (draft.mode === "contact") {
    fd.set("contactFullName", draft.contact.contactFullName);
    fd.set("clientEmail", draft.shared.clientEmail);
    fd.set("clientPhone", draft.shared.clientPhone);
    fd.set("contactMessage", draft.contact.contactMessage);
    for (const file of files.contactFiles) {
      fd.append("contactFiles", file);
    }
    return fd;
  }

  const s = draft.shared;
  fd.set("brideName", s.brideName);
  fd.set("groomName", s.groomName);
  fd.set("weddingDate", s.weddingDate);
  fd.set("ceremonyLocation", s.ceremonyLocation);
  fd.set("receptionLocation", s.receptionLocation);
  fd.set("scheduleNotes", s.scheduleNotes);
  fd.set("lodgingInfo", s.lodgingInfo);
  fd.set("afterpartyInfo", s.afterpartyInfo);
  fd.set("guestInfo", s.guestInfo);
  fd.set("clientEmail", s.clientEmail);
  fd.set("clientPhone", s.clientPhone);

  if (draft.mode === "individual") {
    const i = draft.individual;
    fd.set("colorPreferences", i.colorPreferences);
    fd.set("moodClimate", i.moodClimate);
    fd.set("themesMotifs", i.themesMotifs);
    fd.set("suggestions", i.suggestions);
    if (i.wantsQrCode) fd.set("wantsQrCode", "true");
    fd.set("qrCodeNotes", i.qrCodeNotes);
    if (i.wantsRsvp) fd.set("wantsRsvp", "true");
    fd.set("rsvpNotes", i.rsvpNotes);
    if (i.wantsPasswordProtection) fd.set("wantsPasswordProtection", "true");
    if (i.wantsGallery) fd.set("wantsGallery", "true");
    for (const file of files.inspirationFiles) fd.append("inspirationFiles", file);
    for (const file of files.couplePhotoFiles) fd.append("couplePhotoFiles", file);
    return fd;
  }

  const p = draft.premium;
  fd.set("templateName", p.templateName);
  fd.set("additionalInfo", p.additionalInfo);
  fd.set("correctionRequests", p.correctionRequests);
  if (p.wantsRsvp) fd.set("wantsRsvp", "true");
  fd.set("rsvpNotes", p.rsvpNotes);
  if (p.wantsQrCode) fd.set("wantsQrCode", "true");
  fd.set("qrCodeNotes", p.qrCodeNotes);
  for (const file of files.couplePhotoFiles) fd.append("couplePhotoFiles", file);
  return fd;
}
