import { z } from "zod";

export const budgetRangeOptions = [
  "USD 15,000 - 30,000",
  "USD 30,000 - 55,000",
  "USD 55,000 - 80,000",
  "USD 80,000 - 100,000",
  "USD 100,000+",
] as const;

export const serviceOptions = [
  "AI Consultancy & Strategy",
  "End-to-End AI Product Delivery",
  "Custom AI Software Development",
  "AI Workflow Automation",
  "AI Agents & Chatbots",
  "Digital Twins & Immersive Tech",
] as const;

export const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name.").max(80, "That name is a little long."),
  countryCode: z
    .string()
    .regex(/^\+\d{1,4}$/, "Please select a country code."),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number.")
    .max(24, "That number is a little long."),
  email: z.string().email("Enter a valid email address."),
  requiredService: z.enum(serviceOptions, {
    errorMap: () => ({ message: "Please select the service you need." }),
  }),
  budgetRange: z.enum(budgetRangeOptions, {
    errorMap: () => ({ message: "Please select a budget range." }),
  }),
  message: z
    .string()
    .min(20, "Tell us a little more — at least 20 characters.")
    .max(1200, "Please keep it under 1200 characters."),
  website: z.string().max(0, "Please leave this field blank.").optional(),
  startedAt: z.coerce.number().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactStepFields = [
  ["fullName", "email", "countryCode", "phone"],
  ["requiredService", "budgetRange", "message"],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof ContactFormValues>>;
