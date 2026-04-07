import { createHash, randomBytes } from "crypto";

export function createReplyTokenPlain(): string {
  return randomBytes(24).toString("base64url");
}

export function hashReplyToken(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}
