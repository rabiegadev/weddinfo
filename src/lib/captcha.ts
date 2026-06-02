import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const CAPTCHA_TTL_MS = 10 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.WEDDINFO_COOKIE_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set (min. 16 characters).");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export type CaptchaChallenge = {
  question: string;
  token: string;
};

export function createCaptchaChallenge(): CaptchaChallenge {
  const a = randomInt(2, 12);
  const b = randomInt(2, 12);
  const issuedAt = Date.now();
  const payload = `${a}+${b}:${issuedAt}`;
  return {
    question: `Ile to jest ${a} + ${b}?`,
    token: `${payload}.${sign(payload)}`,
  };
}

export function verifyCaptchaAnswer(token: string, answerRaw: string): boolean {
  const answer = Number.parseInt(answerRaw.trim(), 10);
  if (!Number.isFinite(answer)) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  const [expr, issuedAtRaw] = payload.split(":");
  const issuedAt = Number(issuedAtRaw);
  if (!expr || !Number.isFinite(issuedAt) || Date.now() - issuedAt > CAPTCHA_TTL_MS) {
    return false;
  }

  const [aRaw, bRaw] = expr.split("+");
  const expectedSum = Number(aRaw) + Number(bRaw);
  return Number.isFinite(expectedSum) && expectedSum === answer;
}
