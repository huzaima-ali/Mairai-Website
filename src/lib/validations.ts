import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name.").max(80, "That name is a little long."),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number.")
    .max(24, "That number is a little long."),
  email: z.string().email("Enter a valid email address."),
  message: z
    .string()
    .min(20, "Tell us a little more — at least 20 characters.")
    .max(1200, "Please keep it under 1200 characters."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
