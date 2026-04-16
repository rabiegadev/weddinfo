import { NextResponse } from "next/server";
import { getClientIpFromHeaders } from "@/lib/client-ip";
import { mintCaptchaChallenge } from "@/lib/captcha";
import { checkRateLimitMemory } from "@/lib/rate-limit-memory";

/** Limit pobierania zagadek captcha (na IP), żeby nie generować w nieskończoność. */
const CAPTCHA_ISSUE_PER_IP = 40;
const CAPTCHA_ISSUE_WINDOW_MS = 60 * 60 * 1000;

export async function GET(request: Request) {
  const ip = getClientIpFromHeaders(request.headers);
  const rl = checkRateLimitMemory(`captcha-issue:${ip}`, CAPTCHA_ISSUE_PER_IP, CAPTCHA_ISSUE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Zbyt wiele prób. Spróbuj za ${rl.retryAfterSec} s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }
  try {
    const { token, question } = mintCaptchaChallenge();
    return NextResponse.json({ token, question });
  } catch {
    return NextResponse.json({ error: "Serwer nie jest skonfigurowany (brak sekretu)." }, { status: 500 });
  }
}
