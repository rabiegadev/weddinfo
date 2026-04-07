import { z } from "zod";

const scheduleRow = z.object({
  time: z.string().min(1),
  action: z.string().min(1),
});

export const inquiryFormSchema = z.object({
  partner1FirstName: z.string().min(1).max(120),
  partner1LastName: z.string().min(1).max(120),
  partner2FirstName: z.string().min(1).max(120),
  partner2LastName: z.string().min(1).max(120),
  weddingDate: z.string().optional(),
  locationName: z.string().min(1).max(500),
  locationLat: z.string().optional(),
  locationLng: z.string().optional(),
  colorPalette: z.string().max(2000).optional(),
  themes: z.string().max(2000).optional(),
  clientEmail: z.string().email().max(320),
  clientPhone: z.string().max(40).optional(),
  schedule: z.array(scheduleRow).default([]),
  accommodationNote: z.string().max(5000).optional(),
  rsvpEnabled: z.boolean().default(false),
  rsvpDeadline: z.string().max(500).optional(),
  extraNotes: z.string().max(8000).optional(),
});

export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;
