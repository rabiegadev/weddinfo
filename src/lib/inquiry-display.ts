import { getInquiryTabLabel } from "@/config/inquiry-tabs";
import type { inquiries } from "@/db/schema";

type InquiryRow = typeof inquiries.$inferSelect;

export function getInquiryDisplayName(inquiry: InquiryRow): string {
  if (inquiry.inquiryType === "contact") {
    return inquiry.contactFullName ?? "Zgłoszenie kontaktowe";
  }
  if (inquiry.brideName && inquiry.groomName) {
    return `${inquiry.brideName} & ${inquiry.groomName}`;
  }
  return getInquiryTabLabel(inquiry.inquiryType);
}
