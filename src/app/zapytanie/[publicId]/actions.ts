"use server";

import { getInquiryByPublicId } from "@/data/inquiries";
import { addGuestComment, cancelInquiryByGuest } from "@/lib/inquiry-events";
import { hasGuestViewAccess, setGuestViewCookie } from "@/lib/inquiry-session";
import { verifyGuestPassword } from "@/lib/password";
import { clearRateLimit, formatRetryAfter, peekRateLimit, registerRateLimitHit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-context";
import { revalidatePath } from "next/cache";

const UNLOCK_IP_MAX = 15;
const UNLOCK_TARGET_MAX = 8;
const UNLOCK_WINDOW_SECONDS = 15 * 60;

export async function unlockInquiryWithPassword(
  publicIdRaw: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const publicId = publicIdRaw.trim().replace(/^#/, "");
  if (!publicId) return { ok: false, error: "Podaj numer zgłoszenia." };
  if (!password.trim()) return { ok: false, error: "Podaj hasło." };

  const ip = await getClientIp();
  const ipBucket = `unlock-ip:${ip}`;
  const targetBucket = `unlock-id:${publicId}`;

  const [ipLimit, targetLimit] = await Promise.all([
    peekRateLimit(ipBucket, UNLOCK_IP_MAX, UNLOCK_WINDOW_SECONDS),
    peekRateLimit(targetBucket, UNLOCK_TARGET_MAX, UNLOCK_WINDOW_SECONDS),
  ]);
  const blocked = ipLimit.blocked ? ipLimit : targetLimit.blocked ? targetLimit : null;
  if (blocked) {
    return {
      ok: false,
      error: `Zbyt wiele prób. Spróbuj ponownie za ${formatRetryAfter(blocked.retryAfterSeconds)}.`,
    };
  }

  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) {
    await registerRateLimitHit(ipBucket, UNLOCK_WINDOW_SECONDS);
    return { ok: false, error: "Nie znaleziono zgłoszenia o podanym numerze." };
  }

  const valid = await verifyGuestPassword(password, inquiry.guestPasswordHash);
  if (!valid) {
    await Promise.all([
      registerRateLimitHit(ipBucket, UNLOCK_WINDOW_SECONDS),
      registerRateLimitHit(targetBucket, UNLOCK_WINDOW_SECONDS),
    ]);
    return { ok: false, error: "Nieprawidłowe hasło." };
  }

  await Promise.all([clearRateLimit(ipBucket), clearRateLimit(targetBucket)]);
  await setGuestViewCookie(publicId);
  return { ok: true };
}

async function requireGuestAccess(publicId: string): Promise<{ ok: false; error: string } | null> {
  if (!(await hasGuestViewAccess(publicId))) {
    return { ok: false, error: "Sesja wygasła — zaloguj się hasłem ponownie." };
  }
  return null;
}

export async function submitGuestComment(
  publicId: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const denied = await requireGuestAccess(publicId);
  if (denied) return denied;

  const result = await addGuestComment(publicId, body);
  if (result.ok) revalidatePath(`/zapytanie/${publicId}`);
  return result;
}

export async function submitGuestCancellation(
  publicId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const denied = await requireGuestAccess(publicId);
  if (denied) return denied;

  const result = await cancelInquiryByGuest(publicId);
  if (result.ok) revalidatePath(`/zapytanie/${publicId}`);
  return result;
}
