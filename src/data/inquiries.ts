import { desc, eq, type InferSelectModel } from "drizzle-orm";
import { getDb, inquiries } from "@/db";
import type { ScheduleRow } from "@/db/schema";

type InquiryRow = InferSelectModel<typeof inquiries>;

export type SafeInquiry = {
  publicId: string;
  status: string;
  partner1FirstName: string;
  partner1LastName: string;
  partner2FirstName: string;
  partner2LastName: string;
  weddingDate: string | null;
  locationName: string | null;
  locationLat: string | null;
  locationLng: string | null;
  colorPalette: string | null;
  themes: string | null;
  clientEmail: string;
  clientPhone: string | null;
  schedule: ScheduleRow[];
  accommodationNote: string | null;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  extraNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toSafe(row: InquiryRow): SafeInquiry {
  return {
    publicId: row.publicId,
    status: row.status,
    partner1FirstName: row.partner1FirstName,
    partner1LastName: row.partner1LastName,
    partner2FirstName: row.partner2FirstName,
    partner2LastName: row.partner2LastName,
    weddingDate: row.weddingDate,
    locationName: row.locationName,
    locationLat: row.locationLat,
    locationLng: row.locationLng,
    colorPalette: row.colorPalette,
    themes: row.themes,
    clientEmail: row.clientEmail,
    clientPhone: row.clientPhone,
    schedule: row.schedule ?? [],
    accommodationNote: row.accommodationNote,
    rsvpEnabled: row.rsvpEnabled,
    rsvpDeadline: row.rsvpDeadline,
    extraNotes: row.extraNotes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getInquiryByPublicId(
  publicId: string,
): Promise<SafeInquiry | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.publicId, publicId))
    .limit(1);
  if (!row) return null;
  return toSafe(row);
}

export type AdminInquiryListItem = SafeInquiry & { id: string };

function toAdminListItem(row: InquiryRow): AdminInquiryListItem {
  return { id: row.id, ...toSafe(row) };
}

export async function listInquiriesForAdmin(): Promise<AdminInquiryListItem[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));
  return rows.map(toAdminListItem);
}

export async function updateInquiryStatusByPublicId(
  publicId: string,
  status: string,
): Promise<void> {
  const db = getDb();
  await db
    .update(inquiries)
    .set({ status, updatedAt: new Date() })
    .where(eq(inquiries.publicId, publicId));
}

export async function getInquiryInternalIdByPublicId(
  publicId: string,
): Promise<string | null> {
  const db = getDb();
  const [row] = await db
    .select({ id: inquiries.id })
    .from(inquiries)
    .where(eq(inquiries.publicId, publicId))
    .limit(1);
  return row?.id ?? null;
}

export async function getInquiryAdminByPublicId(
  publicId: string,
): Promise<AdminInquiryListItem | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.publicId, publicId))
    .limit(1);
  if (!row) return null;
  return toAdminListItem(row);
}
