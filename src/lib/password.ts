import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashGuestPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyGuestPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function generateGuestPassword(): string {
  const words = [
    "wesele",
    "obraczki",
    "taniec",
    "kwiat",
    "toast",
    "serce",
    "panna",
    "pan",
  ];
  const a = words[Math.floor(Math.random() * words.length)];
  const b = Math.random().toString(36).slice(2, 6);
  return `${a}-${b}`;
}
