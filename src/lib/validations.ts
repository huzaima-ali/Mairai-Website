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
    .min(20, "Tell us a little more, at least 20 characters.")
    .max(1200, "Please keep it under 1200 characters."),
  website: z.string().max(0, "Please leave this field blank.").optional(),
  startedAt: z.coerce.number().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactStepFields = [
  ["fullName", "email", "countryCode", "phone"],
  ["requiredService", "budgetRange", "message"],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof ContactFormValues>>;

export const partnerTypeOptions = [
  "White-label AI delivery",
  "White-label software development",
  "Digital twin / immersive delivery",
  "Engineering capacity",
  "Technical pre-sales",
  "Co-delivery",
  "Other",
] as const;

export const partnerCompanyTypeOptions = [
  "Marketing / Creative Agency",
  "Software Company",
  "Consultancy",
  "Product Studio",
  "Design Agency",
  "Technology Integrator",
  "Other",
] as const;

export const partnerSchema = z.object({
  fullName: z.string().min(2, "Please enter your name.").max(80, "That name is a little long."),
  email: z.string().email("Enter a valid work email."),
  company: z.string().min(2, "Please enter your company name.").max(120),
  website: z
    .string()
    .trim()
    .min(3, "Please enter a company website.")
    .max(200)
    .refine((value) => /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(value), {
      message: "Enter a valid website URL.",
    }),
  country: z.string().min(2, "Please enter a country.").max(80),
  partnershipType: z.enum(partnerTypeOptions, {
    errorMap: () => ({ message: "Please select how you would like to partner." }),
  }),
  companyType: z.enum(partnerCompanyTypeOptions, {
    errorMap: () => ({ message: "Please select what your company primarily does." }),
  }),
  projectSize: z.string().max(200).optional(),
  message: z
    .string()
    .min(20, "Tell us a little more, at least 20 characters.")
    .max(1500, "Please keep it under 1500 characters."),
  honeypot: z.string().max(0, "Please leave this field blank.").optional(),
  startedAt: z.coerce.number().optional(),
  leadType: z.literal("partnership").default("partnership"),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

export const partnerStepFields = [
  ["fullName", "email", "company", "website", "country"],
  ["partnershipType", "companyType", "message"],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof PartnerFormValues>>;
