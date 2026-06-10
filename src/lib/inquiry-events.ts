import {
  getInquiryByPublicId,
  insertInquiryMessage,
  updateInquiryStatus,
} from "@/data/inquiries";
import { getInquiryDisplayName } from "@/lib/inquiry-display";
import { notifyInquiryEvent, type InquiryEventMailPayload } from "@/lib/mail";
import { canGuestCancel, canGuestComment } from "@/lib/inquiry-status";
import type { InquiryStatus } from "@/db/schema";

function mailPayload(
  inquiry: NonNullable<Awaited<ReturnType<typeof getInquiryByPublicId>>>,
  event: InquiryEventMailPayload["event"],
  extra?: Pick<InquiryEventMailPayload, "messagePreview" | "newStatus">,
): InquiryEventMailPayload {
  return {
    publicId: inquiry.publicId,
    inquiryType: inquiry.inquiryType,
    clientEmail: inquiry.clientEmail,
    displayName: getInquiryDisplayName(inquiry),
    event,
    ...extra,
  };
}

export async function addGuestComment(
  publicId: string,
  bodyRaw: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const body = bodyRaw.trim();
  if (body.length < 2) return { ok: false, error: "Komentarz jest zbyt krótki." };
  if (body.length > 5000) return { ok: false, error: "Komentarz jest zbyt długi." };

  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return { ok: false, error: "Nie znaleziono zgłoszenia." };
  if (!canGuestComment(inquiry.status)) {
    return { ok: false, error: "Nie można dodać komentarza do tego zgłoszenia." };
  }

  await insertInquiryMessage(inquiry.id, "guest", body);
  await notifyInquiryEvent(mailPayload(inquiry, "guest_comment", { messagePreview: body }));
  return { ok: true };
}

export async function cancelInquiryByGuest(
  publicId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return { ok: false, error: "Nie znaleziono zgłoszenia." };
  if (!canGuestCancel(inquiry.status)) {
    return { ok: false, error: "Tego zgłoszenia nie można już anulować." };
  }

  const updated = await updateInquiryStatus(publicId, "cancelled_by_client");
  if (!updated) return { ok: false, error: "Nie udało się anulować zgłoszenia." };

  await notifyInquiryEvent(mailPayload(updated, "guest_cancelled"));
  return { ok: true };
}

export async function addStaffReply(
  publicId: string,
  bodyRaw: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const body = bodyRaw.trim();
  if (body.length < 2) return { ok: false, error: "Odpowiedź jest zbyt krótka." };
  if (body.length > 5000) return { ok: false, error: "Odpowiedź jest zbyt długa." };

  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return { ok: false, error: "Nie znaleziono zgłoszenia." };

  await insertInquiryMessage(inquiry.id, "staff", body);
  await notifyInquiryEvent(mailPayload(inquiry, "staff_reply", { messagePreview: body }));
  return { ok: true };
}

export async function changeInquiryStatus(
  publicId: string,
  status: InquiryStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return { ok: false, error: "Nie znaleziono zgłoszenia." };
  if (inquiry.status === status) return { ok: true };

  const updated = await updateInquiryStatus(publicId, status);
  if (!updated) return { ok: false, error: "Nie udało się zmienić statusu." };

  await notifyInquiryEvent(
    mailPayload(updated, "status_changed", { newStatus: status }),
  );
  return { ok: true };
}
