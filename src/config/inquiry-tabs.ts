export type InquiryFormMode = "individual" | "premium" | "contact";
export type InquiryTabId = InquiryFormMode;

export const inquiryFormModes = [
  {
    id: "individual" as const,
    label: "Individual",
    description: "Projekt od zera — pełny brief i sekcja wizualna.",
  },
  {
    id: "premium" as const,
    label: "Premium",
    description: "Pakiet Premium — szablon, RSVP, kod QR i więcej.",
  },
  {
    id: "contact" as const,
    label: "Kontakt",
    description: "Pytanie ogólne lub krótka wiadomość.",
  },
] as const;

/** @deprecated Użyj inquiryFormModes */
export const inquiryTabs = inquiryFormModes;

export function resolveInquiryModeFromSearchParams(
  typ: string | null,
  pakiet: string | null,
): InquiryFormMode {
  const t = (typ ?? pakiet ?? "").toLowerCase();
  if (t === "individual" || t === "wycena" || t === "indywidual") return "individual";
  if (t === "premium") return "premium";
  if (t === "contact" || t === "kontakt") return "contact";
  if (t === "basic" || t === "start" || t === "podstawowy") return "premium";
  return "individual";
}

/** @deprecated Użyj resolveInquiryModeFromSearchParams */
export function resolveInquiryTabFromSearchParams(
  typ: string | null,
  pakiet: string | null,
): InquiryTabId {
  return resolveInquiryModeFromSearchParams(typ, pakiet);
}

export function getInquiryTabLabel(id: InquiryTabId | "basic"): string {
  if (id === "basic") return "Basic";
  return inquiryFormModes.find((tab) => tab.id === id)?.label ?? id;
}

export const RESPONSE_TIME_LABEL = "1–2 dni robocze";
