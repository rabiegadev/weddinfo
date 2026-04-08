"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdminSessionToken } from "@/lib/admin-session";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { getSiteBaseUrl } from "@/lib/site-url";
import {
  attachmentInputSchema,
  inquiryStatusSchema,
  messageBodySchema,
} from "@/lib/validation/correspondence";
import { insertInquiryAttachment } from "@/data/inquiry-attachments";
import { insertInquiryMessage } from "@/data/inquiry-messages";
import {
  getInquiryAdminByPublicId,
  updateInquiryStatusByPublicId,
} from "@/data/inquiries";
import { insertReplyToken } from "@/data/reply-tokens";
import { createReplyTokenPlain } from "@/lib/token";

async function assertAdmin(): Promise<void> {
  const jar = await cookies();
  const t = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSessionToken(t)) {
    redirect("/admin/login");
  }
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function adminUpdateStatus(
  publicId: string,
  statusRaw: string,
): Promise<ActionResult> {
  await assertAdmin();
  const parsed = inquiryStatusSchema.safeParse(statusRaw);
  if (!parsed.success) {
    return { ok: false, error: "Nieprawidłowy status." };
  }
  const row = await getInquiryAdminByPublicId(publicId);
  if (!row) return { ok: false, error: "Nie znaleziono zapytania." };
  await updateInquiryStatusByPublicId(publicId, parsed.data);
  revalidatePath("/admin");
  revalidatePath(`/admin/zapytanie/${publicId}`);
  revalidatePath(`/zapytanie/${publicId}`);
  return { ok: true };
}

export async function adminPostMessage(
  publicId: string,
  bodyRaw: string,
): Promise<ActionResult> {
  await assertAdmin();
  const body = messageBodySchema.safeParse(bodyRaw);
  if (!body.success) {
    return { ok: false, error: "Treść wiadomości jest nieprawidłowa." };
  }
  const row = await getInquiryAdminByPublicId(publicId);
  if (!row) return { ok: false, error: "Nie znaleziono zapytania." };
  await insertInquiryMessage(row.id, "staff", body.data);
  revalidatePath(`/admin/zapytanie/${publicId}`);
  revalidatePath(`/zapytanie/${publicId}`);
  return { ok: true };
}

export async function adminAddAttachment(
  publicId: string,
  raw: { url: string; role: string },
): Promise<ActionResult> {
  await assertAdmin();
  const parsed = attachmentInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Sprawdź adres URL i opis pliku." };
  }
  const row = await getInquiryAdminByPublicId(publicId);
  if (!row) return { ok: false, error: "Nie znaleziono zapytania." };
  await insertInquiryAttachment(row.id, parsed.data.url, parsed.data.role);
  revalidatePath(`/admin/zapytanie/${publicId}`);
  revalidatePath(`/zapytanie/${publicId}`);
  return { ok: true };
}

export type ReplyLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function adminCreateReplyLink(
  publicId: string,
): Promise<ReplyLinkResult> {
  await assertAdmin();
  const row = await getInquiryAdminByPublicId(publicId);
  if (!row) return { ok: false, error: "Nie znaleziono zapytania." };
  const plain = createReplyTokenPlain();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await insertReplyToken(row.id, plain, expiresAt);
  const base = await getSiteBaseUrl();
  const url = `${base}/zapytanie/${encodeURIComponent(publicId)}/odpowiedz?t=${encodeURIComponent(plain)}`;
  return { ok: true, url };
}
