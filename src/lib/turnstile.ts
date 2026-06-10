const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Turnstile jest aktywny tylko, gdy ustawiono obie zmienne (klient + serwer). */
export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

function isVerifyResponse(value: unknown): value is TurnstileVerifyResponse {
  return typeof value === "object" && value !== null && "success" in value;
}

/** Weryfikuje token Turnstile po stronie serwera. Zwraca false przy każdym błędzie. */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return false;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") {
      body.set("remoteip", ip);
    }

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!res.ok) return false;
    const data: unknown = await res.json();
    return isVerifyResponse(data) && data.success === true;
  } catch (error) {
    console.error("[turnstile] verify failed", error);
    return false;
  }
}
