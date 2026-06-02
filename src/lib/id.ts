import { randomInt } from "node:crypto";

export function generatePublicInquiryId(): string {
  return String(randomInt(100000, 999999));
}
