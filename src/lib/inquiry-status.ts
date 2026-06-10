import type { InquiryStatus } from "@/db/schema";

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "Otrzymaliśmy zgłoszenie",
  in_progress: "W trakcie realizacji",
  closed: "Zamknięte",
  cancelled_by_client: "Anulowane przez klienta",
};

export function canGuestComment(status: InquiryStatus): boolean {
  return status === "new" || status === "in_progress";
}

export function canGuestCancel(status: InquiryStatus): boolean {
  return status === "new" || status === "in_progress";
}

export function isInquiryTerminal(status: InquiryStatus): boolean {
  return status === "closed" || status === "cancelled_by_client";
}
