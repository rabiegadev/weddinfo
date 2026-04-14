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
export type ScheduleSuggestion = string;

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicId: text("public_id").notNull().unique(),
  status: text("status").notNull().default("new"),
  inquiryType: text("inquiry_type").notNull().default("wedding_website"),

  partner1FirstName: text("partner1_first_name").notNull(),
  partner1LastName: text("partner1_last_name").notNull(),
  partner2FirstName: text("partner2_first_name").notNull(),
  partner2LastName: text("partner2_last_name").notNull(),

  weddingDate: date("wedding_date"),
  locationName: text("location_name"),
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),
  weddingVenueName: text("wedding_venue_name"),
  weddingVenuePostalCode: text("wedding_venue_postal_code"),
  weddingVenueCity: text("wedding_venue_city"),
  weddingVenueStreet: text("wedding_venue_street"),
  weddingVenueMapLink: text("wedding_venue_map_link"),
  ceremonyType: text("ceremony_type"),
  ceremonyName: text("ceremony_name"),
  ceremonyPostalCode: text("ceremony_postal_code"),
  ceremonyCity: text("ceremony_city"),
  ceremonyStreet: text("ceremony_street"),
  ceremonyMapLink: text("ceremony_map_link"),
  ceremonyOtherDetails: text("ceremony_other_details"),
  travelDetails: text("travel_details"),

  colorPalette: text("color_palette"),
  themes: text("themes"),
  templateName: text("template_name"),
  heroPhotoName: text("hero_photo_name"),
  inspirationFilesNames: jsonb("inspiration_files_names").$type<string[]>().default([]),
  schedulePreferences: text("schedule_preferences"),
  scheduleSuggestions: jsonb("schedule_suggestions").$type<ScheduleSuggestion[]>().default([]),

  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),

  schedule: jsonb("schedule").$type<ScheduleRow[]>().notNull(),
  accommodationNote: text("accommodation_note"),
  overnightTransportNote: text("overnight_transport_note"),
  afterpartyNote: text("afterparty_note"),
  guestInfoNote: text("guest_info_note"),
  rsvpEnabled: boolean("rsvp_enabled").notNull().default(false),
  rsvpDeadline: text("rsvp_deadline"),
  rsvpNotes: text("rsvp_notes"),
  extraNotes: text("extra_notes"),
  contactFullName: text("contact_full_name"),
  contactMessage: text("contact_message"),

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
