"use server";

import { addStaffReply, changeInquiryStatus } from "@/lib/inquiry-events";
import { hasAdminSession, loginAdmin, logoutAdmin } from "@/lib/admin-session";
import { clearRateLimit, formatRetryAfter, peekRateLimit, registerRateLimitHit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-context";
import type { InquiryStatus } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ADMIN_LOGIN_MAX_FAILURES = 5;
const ADMIN_LOGIN_WINDOW_SECONDS = 15 * 60;

export async function adminLoginAction(
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ip = await getClientIp();
  const bucket = `admin-login:${ip}`;

  const limit = await peekRateLimit(bucket, ADMIN_LOGIN_MAX_FAILURES, ADMIN_LOGIN_WINDOW_SECONDS);
  if (limit.blocked) {
    return {
      ok: false,
      error: `Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za ${formatRetryAfter(limit.retryAfterSeconds)}.`,
    };
  }

  const result = await loginAdmin(password);
  if (result.ok) {
    await clearRateLimit(bucket);
  } else {
    await registerRateLimitHit(bucket, ADMIN_LOGIN_WINDOW_SECONDS);
  }
  return result;
}

export async function adminLogoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin");
}

async function requireAdmin(): Promise<{ ok: false; error: string } | null> {
  if (!(await hasAdminSession())) {
    return { ok: false, error: "Brak sesji admina." };
  }
  return null;
}

export async function adminReplyAction(
  publicId: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const result = await addStaffReply(publicId, body);
  if (result.ok) {
    revalidatePath(`/admin/zapytania/${publicId}`);
    revalidatePath(`/zapytanie/${publicId}`);
  }
  return result;
}

export async function adminStatusAction(
  publicId: string,
  status: InquiryStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const result = await changeInquiryStatus(publicId, status);
  if (result.ok) {
    revalidatePath(`/admin/zapytania/${publicId}`);
    revalidatePath(`/zapytanie/${publicId}`);
    revalidatePath("/admin/zapytania");
  }
  return result;
}
