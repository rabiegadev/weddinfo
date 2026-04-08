import { asc, eq } from "drizzle-orm";
import { getDb, inquiryMessages } from "@/db";

export type InquiryMessageRow = {
  id: string;
  authorRole: string;
  body: string;
  createdAt: Date;
};

export async function listMessagesByInquiryId(
  inquiryId: string,
): Promise<InquiryMessageRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: inquiryMessages.id,
      authorRole: inquiryMessages.authorRole,
      body: inquiryMessages.body,
      createdAt: inquiryMessages.createdAt,
    })
    .from(inquiryMessages)
    .where(eq(inquiryMessages.inquiryId, inquiryId))
    .orderBy(asc(inquiryMessages.createdAt));
  return rows;
}

export async function insertInquiryMessage(
  inquiryId: string,
  authorRole: "guest" | "staff",
  body: string,
): Promise<void> {
  const db = getDb();
  await db.insert(inquiryMessages).values({
    inquiryId,
    authorRole,
    body,
  });
}
