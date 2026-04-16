import { createHmac, randomInt, timingSafeEqual } from "crypto";

type CaptchaPayload = { a: number; b: number; exp: number };

function getSecret(): string {
  const s = process.env.WEDDINFO_COOKIE_SECRET;
  if (!s || s.length < 16) {
    throw new Error("WEDDINFO_COOKIE_SECRET must be set (min. 16 znaków)");
  }
  return s;
}

function signCaptchaPayload(payload: CaptchaPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(`captcha:${body}`)
    .digest("base64url");
  return `${body}.${sig}`;
}

export function mintCaptchaChallenge(): { token: string; question: string } {
  const a = randomInt(1, 10);
  const b = randomInt(1, 10);
  const exp = Date.now() + 10 * 60 * 1000;
  const token = signCaptchaPayload({ a, b, exp });
  return { token, question: `Ile wynosi ${a} + ${b}?` };
}

export function verifyCaptchaAnswer(token: string, answerRaw: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [bodyB64, sig] = token.split(".") as [string, string];
  if (!bodyB64 || !sig) return false;
  const expectedSig = createHmac("sha256", getSecret())
    .update(`captcha:${bodyB64}`)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  let payload: CaptchaPayload;
  try {
    payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8")) as CaptchaPayload;
  } catch {
    return false;
  }
  if (
    typeof payload.a !== "number" ||
    typeof payload.b !== "number" ||
    typeof payload.exp !== "number"
  ) {
    return false;
  }
  if (Date.now() > payload.exp) return false;
  const answer = Number(String(answerRaw).trim());
  if (!Number.isFinite(answer)) return false;
  return answer === payload.a + payload.b;
}
