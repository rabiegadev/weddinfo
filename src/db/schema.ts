import {
  bigint,
  boolean,
  date,
  datetime,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const inquiryTypeEnum = ["individual", "premium", "basic", "contact"] as const;
export const inquiryStatusEnum = ["new", "in_progress", "closed"] as const;
export const attachmentKindEnum = ["inspiration", "couple_photo", "contact_file"] as const;
export type AttachmentKind = (typeof attachmentKindEnum)[number];
export const messageAuthorEnum = ["guest", "staff"] as const;

export type InquiryType = (typeof inquiryTypeEnum)[number];
export type InquiryStatus = (typeof inquiryStatusEnum)[number];

export const inquiries = mysqlTable(
  "inquiries",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    publicId: varchar("public_id", { length: 12 }).notNull().unique(),
    guestPasswordHash: varchar("guest_password_hash", { length: 255 }).notNull(),
    inquiryType: mysqlEnum("inquiry_type", inquiryTypeEnum).notNull(),
    status: mysqlEnum("status", inquiryStatusEnum).notNull().default("new"),
    clientEmail: varchar("client_email", { length: 255 }).notNull(),
    clientPhone: varchar("client_phone", { length: 30 }),
    contactFullName: varchar("contact_full_name", { length: 120 }),
    contactMessage: text("contact_message"),
    brideName: varchar("bride_name", { length: 120 }),
    groomName: varchar("groom_name", { length: 120 }),
    weddingDate: date("wedding_date"),
    ceremonyLocation: varchar("ceremony_location", { length: 500 }),
    receptionLocation: varchar("reception_location", { length: 500 }),
    scheduleNotes: text("schedule_notes"),
    lodgingInfo: text("lodging_info"),
    afterpartyInfo: text("afterparty_info"),
    guestInfo: text("guest_info"),
    colorPreferences: text("color_preferences"),
    moodClimate: text("mood_climate"),
    themesMotifs: text("themes_motifs"),
    suggestions: text("suggestions"),
    additionalInfo: text("additional_info"),
    correctionRequests: text("correction_requests"),
    templateName: varchar("template_name", { length: 120 }),
    wantsQrCode: boolean("wants_qr_code"),
    qrCodeNotes: text("qr_code_notes"),
    wantsRsvp: boolean("wants_rsvp"),
    rsvpNotes: text("rsvp_notes"),
    wantsPasswordProtection: boolean("wants_password_protection"),
    wantsGallery: boolean("wants_gallery"),
    createdAt: datetime("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    updatedAt: datetime("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_inquiries_email").on(table.clientEmail),
    index("idx_inquiries_type").on(table.inquiryType),
    index("idx_inquiries_status").on(table.status),
  ],
);

export const inquiryAttachments = mysqlTable("inquiry_attachments", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  inquiryId: bigint("inquiry_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  attachmentKind: mysqlEnum("attachment_kind", attachmentKindEnum).notNull(),
  storedName: varchar("stored_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  byteSize: bigint("byte_size", { mode: "number", unsigned: true }).notNull(),
  createdAt: datetime("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});

export const inquiryMessages = mysqlTable("inquiry_messages", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  inquiryId: bigint("inquiry_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  authorRole: mysqlEnum("author_role", messageAuthorEnum).notNull(),
  body: text("body").notNull(),
  createdAt: datetime("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
});
