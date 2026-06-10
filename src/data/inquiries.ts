import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  inquiries,
  inquiryAttachments,
  inquiryMessages,
  type InquiryStatus,
  type InquiryType,
  type messageAuthorEnum,
} from "@/db/schema";
import type { SavedAttachment } from "@/lib/inquiry-uploads";
import { mysqlDateOnly, mysqlDateTimeNow } from "@/lib/mysql-datetime";

export type MessageAuthorRole = (typeof messageAuthorEnum)[number];

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

type InquiryInsert = typeof inquiries.$inferInsert;
type InquiryRow = typeof inquiries.$inferSelect;
type AttachmentRow = typeof inquiryAttachments.$inferSelect;
type MessageRow = typeof inquiryMessages.$inferSelect;

function setIfText(
  row: Partial<InquiryInsert>,
  key: keyof InquiryInsert,
  value: string | null | undefined,
): void {
  if (value == null || value === "") return;
  (row as Record<string, unknown>)[key as string] = value;
}

function buildInquiryInsertRow(data: InsertInquiryData, now: string): InquiryInsert {
  const row: Partial<InquiryInsert> = {
    publicId: data.publicId,
    guestPasswordHash: data.guestPasswordHash,
    inquiryType: data.inquiryType,
    status: "new",
    clientEmail: data.clientEmail,
    createdAt: now,
    updatedAt: now,
  };

  setIfText(row, "clientPhone", data.clientPhone);
  setIfText(row, "contactFullName", data.contactFullName);
  setIfText(row, "contactMessage", data.contactMessage);
  setIfText(row, "brideName", data.brideName);
  setIfText(row, "groomName", data.groomName);
  setIfText(row, "ceremonyLocation", data.ceremonyLocation);
  setIfText(row, "receptionLocation", data.receptionLocation);
  setIfText(row, "scheduleNotes", data.scheduleNotes);
  setIfText(row, "lodgingInfo", data.lodgingInfo);
  setIfText(row, "afterpartyInfo", data.afterpartyInfo);
  setIfText(row, "guestInfo", data.guestInfo);
  setIfText(row, "colorPreferences", data.colorPreferences);
  setIfText(row, "moodClimate", data.moodClimate);
  setIfText(row, "themesMotifs", data.themesMotifs);
  setIfText(row, "suggestions", data.suggestions);
  setIfText(row, "additionalInfo", data.additionalInfo);
  setIfText(row, "correctionRequests", data.correctionRequests);
  setIfText(row, "templateName", data.templateName);
  setIfText(row, "qrCodeNotes", data.qrCodeNotes);
  setIfText(row, "rsvpNotes", data.rsvpNotes);

  if (data.weddingDate) {
    row.weddingDate = new Date(`${mysqlDateOnly(data.weddingDate)}T12:00:00`);
  }
  if (data.wantsQrCode != null) row.wantsQrCode = data.wantsQrCode;
  if (data.wantsRsvp != null) row.wantsRsvp = data.wantsRsvp;
  if (data.wantsPasswordProtection != null) row.wantsPasswordProtection = data.wantsPasswordProtection;
  if (data.wantsGallery != null) row.wantsGallery = data.wantsGallery;

  return row as InquiryInsert;
}

export async function insertInquiry(data: InsertInquiryData, attachments: SavedAttachment[]) {
  const db = getDb();
  const now = mysqlDateTimeNow();

  await db.insert(inquiries).values(buildInquiryInsertRow(data, now));

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

export async function getInquiryByPublicId(publicId: string): Promise<InquiryRow | null> {
  const db = getDb();
  const rows = await db.select().from(inquiries).where(eq(inquiries.publicId, publicId)).limit(1);
  return rows[0] ?? null;
}

export async function listInquiries(): Promise<InquiryRow[]> {
  const db = getDb();
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryAttachments(inquiryId: number): Promise<AttachmentRow[]> {
  const db = getDb();
  return db.select().from(inquiryAttachments).where(eq(inquiryAttachments.inquiryId, inquiryId));
}

export async function getInquiryAttachmentById(
  inquiryId: number,
  attachmentId: number,
): Promise<AttachmentRow | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(inquiryAttachments)
    .where(eq(inquiryAttachments.id, attachmentId))
    .limit(1);
  const row = rows[0];
  if (!row || row.inquiryId !== inquiryId) return null;
  return row;
}

export async function getInquiryMessages(inquiryId: number): Promise<MessageRow[]> {
  const db = getDb();
  return db
    .select()
    .from(inquiryMessages)
    .where(eq(inquiryMessages.inquiryId, inquiryId))
    .orderBy(inquiryMessages.createdAt);
}

export async function insertInquiryMessage(
  inquiryId: number,
  authorRole: MessageAuthorRole,
  body: string,
): Promise<MessageRow> {
  const db = getDb();
  const now = mysqlDateTimeNow();
  await db.insert(inquiryMessages).values({
    inquiryId,
    authorRole,
    body,
    createdAt: now,
  });
  await db
    .update(inquiries)
    .set({ updatedAt: now })
    .where(eq(inquiries.id, inquiryId));

  const rows = await db
    .select()
    .from(inquiryMessages)
    .where(eq(inquiryMessages.inquiryId, inquiryId))
    .orderBy(desc(inquiryMessages.createdAt))
    .limit(1);
  const created = rows[0];
  if (!created) throw new Error("Nie udało się zapisać wiadomości.");
  return created;
}

export async function updateInquiryStatus(
  publicId: string,
  status: InquiryStatus,
): Promise<InquiryRow | null> {
  const db = getDb();
  const now = mysqlDateTimeNow();
  await db.update(inquiries).set({ status, updatedAt: now }).where(eq(inquiries.publicId, publicId));
  return getInquiryByPublicId(publicId);
}

export type InquiryWithRelations = {
  inquiry: InquiryRow;
  attachments: AttachmentRow[];
  messages: MessageRow[];
};

export async function getInquiryWithRelations(publicId: string): Promise<InquiryWithRelations | null> {
  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) return null;
  const [attachments, messages] = await Promise.all([
    getInquiryAttachments(inquiry.id),
    getInquiryMessages(inquiry.id),
  ]);
  return { inquiry, attachments, messages };
}
