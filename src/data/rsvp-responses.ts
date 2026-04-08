import { desc, eq } from "drizzle-orm";
import { getDb, rsvpResponses } from "@/db";

export type RsvpResponseRow = {
  id: string;
  guestName: string;
  guestEmail: string | null;
  attending: boolean;
  dietaryNote: string | null;
  createdAt: Date;
};

export async function listRsvpByInquiryId(
  inquiryId: string,
): Promise<RsvpResponseRow[]> {
  const db = getDb();
  return db
    .select({
      id: rsvpResponses.id,
      guestName: rsvpResponses.guestName,
      guestEmail: rsvpResponses.guestEmail,
      attending: rsvpResponses.attending,
      dietaryNote: rsvpResponses.dietaryNote,
      createdAt: rsvpResponses.createdAt,
    })
    .from(rsvpResponses)
    .where(eq(rsvpResponses.inquiryId, inquiryId))
    .orderBy(desc(rsvpResponses.createdAt));
}

export async function insertRsvpResponse(
  inquiryId: string,
  data: {
    guestName: string;
    guestEmail: string | null;
    attending: boolean;
    dietaryNote: string | null;
  },
): Promise<void> {
  const db = getDb();
  await db.insert(rsvpResponses).values({
    inquiryId,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    attending: data.attending,
    dietaryNote: data.dietaryNote,
  });
}
