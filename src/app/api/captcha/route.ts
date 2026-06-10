import { NextResponse } from "next/server";
import { createCaptchaChallenge } from "@/lib/captcha";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-context";

const CAPTCHA_RATE_LIMIT = 60;
const CAPTCHA_RATE_WINDOW_SECONDS = 10 * 60;

export async function GET() {
  try {
    const ip = await getClientIp();
    const limit = await consumeRateLimit(`captcha:${ip}`, CAPTCHA_RATE_LIMIT, CAPTCHA_RATE_WINDOW_SECONDS);
    if (limit.blocked) {
      return NextResponse.json(
        { error: "Zbyt wiele żądań. Spróbuj ponownie później." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const challenge = createCaptchaChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    console.error("[captcha]", error);
    return NextResponse.json({ error: "Captcha niedostępna." }, { status: 503 });
  }
}
