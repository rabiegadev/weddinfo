import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  date,
} from "drizzle-orm/pg-core";

export type ScheduleRow = { time: string; action: string };

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicId: text("public_id").notNull().unique(),
  status: text("status").notNull().default("new"),

  partner1FirstName: text("partner1_first_name").notNull(),
  partner1LastName: text("partner1_last_name").notNull(),
  partner2FirstName: text("partner2_first_name").notNull(),
  partner2LastName: text("partner2_last_name").notNull(),

  weddingDate: date("wedding_date"),
  locationName: text("location_name"),
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),

  colorPalette: text("color_palette"),
  themes: text("themes"),

  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),

  schedule: jsonb("schedule").$type<ScheduleRow[]>().notNull(),
  accommodationNote: text("accommodation_note"),
  rsvpEnabled: boolean("rsvp_enabled").notNull().default(false),
  rsvpDeadline: text("rsvp_deadline"),
  extraNotes: text("extra_notes"),

  guestPasswordHash: text("guest_password_hash").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiryAttachments = pgTable("inquiry_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiryMessages = pgTable("inquiry_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  authorRole: text("author_role").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const replyTokens = pgTable("reply_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const rsvpResponses = pgTable("rsvp_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email"),
  attending: boolean("attending").notNull(),
  dietaryNote: text("dietary_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
