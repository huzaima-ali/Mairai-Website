import { z } from "zod";

export const jobDraftSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required."),
  slug: z.string().min(1, "Slug is required."),
  department: z.string().optional().default(""),
  location: z.string().optional().default(""),
  workplace_type: z.string().optional().default(""),
  employment_type: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  description: z.string().optional().default(""),
  requirements: z.string().optional().default(""),
  nice_to_have: z.string().optional().default(""),
  application_type: z.enum(["email", "url", "both"]).optional().default("email"),
  application_url: z.string().optional().nullable(),
  application_email: z.string().optional().nullable(),
  valid_through: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});
