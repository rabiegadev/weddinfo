import { z } from "zod";

export const messageBodySchema = z.string().trim().min(1).max(8000);

export const attachmentInputSchema = z.object({
  url: z.string().url().max(2000),
  role: z.string().trim().min(1).max(120),
});

export const inquiryStatusSchema = z.enum(["new", "in_progress", "closed"]);

export const rsvpFormSchema = z.object({
  guestName: z.string().trim().min(1).max(200),
  guestEmail: z.string().trim().max(320).optional(),
  attending: z.boolean(),
  dietaryNote: z.string().trim().max(2000).optional(),
});

export type RsvpFormInput = z.infer<typeof rsvpFormSchema>;
