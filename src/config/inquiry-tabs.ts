import type { InquiryType } from "@/db/schema";

export type InquiryTabId = InquiryType;

export const inquiryTabs = [
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
    id: "basic" as const,
    label: "Basic",
    description: "Pakiet Start — szablon i podstawowe dopasowanie.",
  },
  {
    id: "contact" as const,
    label: "Kontakt",
    description: "Pytanie ogólne lub krótka wiadomość.",
  },
] as const;

export function resolveInquiryTabFromSearchParams(
  typ: string | null,
  pakiet: string | null,
): InquiryTabId {
  const t = (typ ?? pakiet ?? "").toLowerCase();
  if (t === "individual" || t === "wycena" || t === "indywidual") return "individual";
  if (t === "premium") return "premium";
  if (t === "basic" || t === "start") return "basic";
  if (t === "contact" || t === "kontakt") return "contact";
  return "individual";
}

export function getInquiryTabLabel(id: InquiryTabId): string {
  return inquiryTabs.find((tab) => tab.id === id)?.label ?? id;
}

export const RESPONSE_TIME_LABEL = "1–2 dni robocze";
