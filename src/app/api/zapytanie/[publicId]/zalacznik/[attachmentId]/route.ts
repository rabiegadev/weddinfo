import { getInquiryAttachmentById, getInquiryByPublicId } from "@/data/inquiries";
import { hasAdminSession } from "@/lib/admin-session";
import { hasGuestViewAccess } from "@/lib/inquiry-session";
import { readInquiryAttachment } from "@/lib/inquiry-uploads";

type RouteContext = {
  params: Promise<{ publicId: string; attachmentId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { publicId, attachmentId: attachmentIdRaw } = await context.params;
  const attachmentId = Number(attachmentIdRaw);
  if (!Number.isFinite(attachmentId)) {
    return new Response("Nieprawidłowy identyfikator.", { status: 400 });
  }

  const [guestOk, adminOk] = await Promise.all([
    hasGuestViewAccess(publicId),
    hasAdminSession(),
  ]);
  if (!guestOk && !adminOk) {
    return new Response("Brak dostępu.", { status: 403 });
  }

  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) {
    return new Response("Nie znaleziono.", { status: 404 });
  }

  const attachment = await getInquiryAttachmentById(inquiry.id, attachmentId);
  if (!attachment) {
    return new Response("Nie znaleziono załącznika.", { status: 404 });
  }

  const buffer = await readInquiryAttachment(publicId, attachment.storedName);
  if (!buffer) {
    return new Response("Plik niedostępny.", { status: 404 });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": attachment.mimeType,
      "Content-Disposition": `inline; filename="${attachment.originalName.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
