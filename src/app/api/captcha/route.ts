import { NextResponse } from "next/server";
import { createCaptchaChallenge } from "@/lib/captcha";

export async function GET() {
  try {
    const challenge = createCaptchaChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    console.error("[captcha]", error);
    return NextResponse.json({ error: "Captcha niedostępna." }, { status: 503 });
  }
}
