import { desc, eq, type InferSelectModel } from "drizzle-orm";
import { getDb, inquiries } from "@/db";
import type { ScheduleRow, ScheduleSuggestion } from "@/db/schema";

type InquiryRow = InferSelectModel<typeof inquiries>;

export type SafeInquiry = {
  publicId: string;
  status: string;
  inquiryType: string;
  partner1FirstName: string;
  partner1LastName: string;
  partner2FirstName: string;
  partner2LastName: string;
  contactFullName: string | null;
  contactMessage: string | null;
  weddingDate: string | null;
  locationName: string | null;
  locationLat: string | null;
  locationLng: string | null;
  weddingVenueName: string | null;
  weddingVenuePostalCode: string | null;
  weddingVenueCity: string | null;
  weddingVenueStreet: string | null;
  weddingVenueMapLink: string | null;
  ceremonyType: string | null;
  ceremonyName: string | null;
  ceremonyPostalCode: string | null;
  ceremonyCity: string | null;
  ceremonyStreet: string | null;
  ceremonyMapLink: string | null;
  ceremonyOtherDetails: string | null;
  travelDetails: string | null;
  colorPalette: string | null;
  themes: string | null;
  templateName: string | null;
  clientEmail: string;
  clientPhone: string | null;
  schedule: ScheduleRow[];
  schedulePreferences: string | null;
  scheduleSuggestions: ScheduleSuggestion[];
  accommodationNote: string | null;
  overnightTransportNote: string | null;
  afterpartyNote: string | null;
  guestInfoNote: string | null;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  rsvpNotes: string | null;
  extraNotes: string | null;
  heroPhotoName: string | null;
  inspirationFilesNames: string[];
  createdAt: Date;
  updatedAt: Date;
};

function toSafe(row: InquiryRow): SafeInquiry {
  return {
    publicId: row.publicId,
    status: row.status,
    inquiryType: row.inquiryType,
    partner1FirstName: row.partner1FirstName,
    partner1LastName: row.partner1LastName,
    partner2FirstName: row.partner2FirstName,
    partner2LastName: row.partner2LastName,
    contactFullName: row.contactFullName,
    contactMessage: row.contactMessage,
    weddingDate: row.weddingDate,
    locationName: row.locationName,
    locationLat: row.locationLat,
    locationLng: row.locationLng,
    weddingVenueName: row.weddingVenueName,
    weddingVenuePostalCode: row.weddingVenuePostalCode,
    weddingVenueCity: row.weddingVenueCity,
    weddingVenueStreet: row.weddingVenueStreet,
    weddingVenueMapLink: row.weddingVenueMapLink,
    ceremonyType: row.ceremonyType,
    ceremonyName: row.ceremonyName,
    ceremonyPostalCode: row.ceremonyPostalCode,
    ceremonyCity: row.ceremonyCity,
    ceremonyStreet: row.ceremonyStreet,
    ceremonyMapLink: row.ceremonyMapLink,
    ceremonyOtherDetails: row.ceremonyOtherDetails,
    travelDetails: row.travelDetails,
    colorPalette: row.colorPalette,
    themes: row.themes,
    templateName: row.templateName,
    clientEmail: row.clientEmail,
    clientPhone: row.clientPhone,
    schedule: row.schedule ?? [],
    schedulePreferences: row.schedulePreferences,
    scheduleSuggestions: row.scheduleSuggestions ?? [],
    accommodationNote: row.accommodationNote,
    overnightTransportNote: row.overnightTransportNote,
    afterpartyNote: row.afterpartyNote,
    guestInfoNote: row.guestInfoNote,
    rsvpEnabled: row.rsvpEnabled,
    rsvpDeadline: row.rsvpDeadline,
    rsvpNotes: row.rsvpNotes,
    extraNotes: row.extraNotes,
    heroPhotoName: row.heroPhotoName,
    inspirationFilesNames: row.inspirationFilesNames ?? [],
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
