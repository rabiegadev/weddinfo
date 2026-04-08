"use server";

import { revalidatePath } from "next/cache";
import { insertInquiryMessage } from "@/data/inquiry-messages";
import { getInquiryInternalIdByPublicId } from "@/data/inquiries";
import {
  findValidReplyToken,
  markReplyTokenUsed,
} from "@/data/reply-tokens";
import { messageBodySchema } from "@/lib/validation/correspondence";

export type TokenReplyResult = { ok: true } | { ok: false; error: string };

export async function postGuestMessageWithReplyToken(
  publicId: string,
  tokenPlain: string,
  bodyRaw: string,
): Promise<TokenReplyResult> {
  const t = tokenPlain.trim();
  if (!t) {
    return { ok: false, error: "Brak tokenu w linku." };
  }
  const body = messageBodySchema.safeParse(bodyRaw);
  if (!body.success) {
    return { ok: false, error: "Treść wiadomości jest nieprawidłowa." };
  }
  const inquiryId = await getInquiryInternalIdByPublicId(publicId);
  if (!inquiryId) return { ok: false, error: "Nie znaleziono zapytania." };
  const tokenRow = await findValidReplyToken(inquiryId, t);
  if (!tokenRow) {
    return {
      ok: false,
      error: "Link jest nieważny, wygasł lub został już użyty.",
    };
  }
  await insertInquiryMessage(inquiryId, "guest", body.data);
  await markReplyTokenUsed(tokenRow.id);
  revalidatePath(`/zapytanie/${publicId}`);
  revalidatePath(`/admin/zapytanie/${publicId}`);
  return { ok: true };
}
