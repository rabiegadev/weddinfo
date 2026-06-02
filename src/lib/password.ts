import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const GUEST_PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateGuestPassword(length = 8): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += GUEST_PASSWORD_CHARS[bytes[i]! % GUEST_PASSWORD_CHARS.length];
  }
  return out;
}

export async function hashGuestPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyGuestPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
