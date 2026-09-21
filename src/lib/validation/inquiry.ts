import { z } from "zod";

export const inquiryTypes = [
  "FRAGRANCE_TRADING",
  "TOLL_MANUFACTURING",
  "PRIVATE_LABEL",
] as const;

export const industries = [
  "Fine Fragrance",
  "Personal Care",
  "Home Care and Detergents",
  "Candles and Home Fragrance",
  "Other",
] as const;

export const quantityUnits = [
  "kg",
  "liters",
  "units",
  "bottles",
  "batches",
  "TBD",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

export const inquirySchema = z
  .object({
    contactName: z.string().trim().min(2, "Contact name is required").max(120),
    companyName: z.string().trim().min(2, "Company name is required").max(160),
    email: z.string().trim().email("Enter a valid email address").max(160),
    phone: z
      .string()
      .trim()
      .min(7, "Phone / WhatsApp is required")
      .max(40)
      .regex(/^[+0-9()\-\s.]+$/, "Enter a valid phone number"),
    country: z.string().trim().min(2, "Country is required").max(80),
    industry: z.enum(industries, {
      errorMap: () => ({ message: "Select an industry" }),
    }),
    inquiryType: z.enum(inquiryTypes, {
      errorMap: () => ({ message: "Select a requested service" }),
    }),
    productCategory: z
      .string()
      .trim()
      .min(2, "Product category is required")
      .max(120),
    estimatedQuantity: z
      .string()
      .trim()
      .min(1, "Estimated quantity is required")
      .max(60),
    quantityUnit: z.enum(quantityUnits, {
      errorMap: () => ({ message: "Select a quantity unit" }),
    }),
    projectDescription: z
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters describing your project")
      .max(4000),
    targetPrice: optionalText(80),
    fragranceDirection: optionalText(1000),
    requiredConcentration: optionalText(80),
    bottleSize: optionalText(80),
    packagingRequirements: optionalText(1000),
    expectedTimeline: optionalText(120),
    sampleRequirements: optionalText(1000),
    sourcePage: optionalText(200),
    /** Honeypot — must be empty */
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType === "PRIVATE_LABEL") {
      // Soft guidance only — bottle size remains optional but recommended
      if (!data.fragranceDirection && !data.sampleRequirements) {
        // No hard failure; optional fields stay optional
      }
    }
    if (data.inquiryType === "FRAGRANCE_TRADING" && data.bottleSize) {
      // bottle size not typically needed for trading; ignore silently
    }
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

export const contactSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(40)
    .regex(/^[+0-9()\-\s.]+$/),
  country: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().or(z.literal("")),
  sourcePage: optionalText(200),
});

export type ContactInput = z.infer<typeof contactSchema>;
