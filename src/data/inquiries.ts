import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries, inquiryAttachments, type InquiryType } from "@/db/schema";
import type { SavedAttachment } from "@/lib/inquiry-uploads";

export type InsertInquiryData = {
  publicId: string;
  guestPasswordHash: string;
  inquiryType: InquiryType;
  clientEmail: string;
  clientPhone?: string | null;
  contactFullName?: string | null;
  contactMessage?: string | null;
  brideName?: string | null;
  groomName?: string | null;
  weddingDate?: string | null;
  ceremonyLocation?: string | null;
  receptionLocation?: string | null;
  scheduleNotes?: string | null;
  lodgingInfo?: string | null;
  afterpartyInfo?: string | null;
  guestInfo?: string | null;
  colorPreferences?: string | null;
  moodClimate?: string | null;
  themesMotifs?: string | null;
  suggestions?: string | null;
  additionalInfo?: string | null;
  correctionRequests?: string | null;
  templateName?: string | null;
  wantsQrCode?: boolean | null;
  qrCodeNotes?: string | null;
  wantsRsvp?: boolean | null;
  rsvpNotes?: string | null;
  wantsPasswordProtection?: boolean | null;
  wantsGallery?: boolean | null;
};

export async function insertInquiry(data: InsertInquiryData, attachments: SavedAttachment[]) {
  const db = getDb();
  const now = new Date();

  await db.insert(inquiries).values({
    ...data,
    weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
    status: "new",
    createdAt: now,
    updatedAt: now,
  });

  const created = await getInquiryByPublicId(data.publicId);
  if (!created) {
    throw new Error("Nie udało się zapisać zgłoszenia.");
  }
  const inquiryId = created.id;

  if (attachments.length > 0) {
    await db.insert(inquiryAttachments).values(
      attachments.map((a) => ({
        inquiryId,
        attachmentKind: a.kind,
        storedName: a.storedName,
        originalName: a.originalName,
        mimeType: a.mimeType,
        byteSize: a.byteSize,
        createdAt: now,
      })),
    );
  }

  return { inquiryId };
}

export async function getInquiryByPublicId(publicId: string) {
  const db = getDb();
  const rows = await db.select().from(inquiries).where(eq(inquiries.publicId, publicId)).limit(1);
  return rows[0] ?? null;
}

export async function getInquiryAttachments(inquiryId: number) {
  const db = getDb();
  return db.select().from(inquiryAttachments).where(eq(inquiryAttachments.inquiryId, inquiryId));
}
