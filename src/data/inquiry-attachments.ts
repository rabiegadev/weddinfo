import { asc, eq } from "drizzle-orm";
import { getDb, inquiryAttachments } from "@/db";

export type InquiryAttachmentRow = {
  id: string;
  url: string;
  role: string;
  createdAt: Date;
};

export async function listAttachmentsByInquiryId(
  inquiryId: string,
): Promise<InquiryAttachmentRow[]> {
  const db = getDb();
  return db
    .select({
      id: inquiryAttachments.id,
      url: inquiryAttachments.url,
      role: inquiryAttachments.role,
      createdAt: inquiryAttachments.createdAt,
    })
    .from(inquiryAttachments)
    .where(eq(inquiryAttachments.inquiryId, inquiryId))
    .orderBy(asc(inquiryAttachments.createdAt));
}

export async function insertInquiryAttachment(
  inquiryId: string,
  url: string,
  role: string,
): Promise<void> {
  const db = getDb();
  await db.insert(inquiryAttachments).values({
    inquiryId,
    url,
    role,
  });
}
