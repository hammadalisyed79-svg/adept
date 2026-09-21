import { z } from "zod";

export const inquiryTypes = [
  "FRAGRANCE_TRADING",
  "TOLL_MANUFACTURING",
  "PRIVATE_LABEL",
  "PACKAGING_COMPONENTS",
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
  "pieces",
  "sets",
  "TBD",
] as const;

export const packagingCategoryOptions = [
  "Perfume bottles",
  "Caps",
  "Pumps",
  "Collars",
  "Labels",
  "Stickers",
  "Folding cartons",
  "Rigid boxes",
  "Accessories",
  "Complete packaging sets",
  "Other packaging requirements",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

export const packagingLineItemSchema = z.object({
  category: z.string().trim().min(1).max(120),
  quantity: z.string().trim().min(1).max(60),
  capacitySize: optionalText(80),
  material: optionalText(120),
  colourFinish: optionalText(120),
  notes: optionalText(500),
});

export type PackagingLineItem = z.infer<typeof packagingLineItemSchema>;

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
      .max(200),
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
    /** Packaging-specific (optional unless PACKAGING_COMPONENTS) */
    packagingCategories: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
    deliveryDestination: optionalText(200),
    componentReference: optionalText(160),
    matchingRequirements: optionalText(1000),
    material: optionalText(120),
    colourFinish: optionalText(120),
    capacitySize: optionalText(80),
    lineItems: z.array(packagingLineItemSchema).max(20).optional(),
    sourcePage: optionalText(200),
    /** Honeypot — must be empty */
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType === "PACKAGING_COMPONENTS") {
      const cats = data.packagingCategories ?? [];
      const lines = data.lineItems ?? [];
      if (cats.length === 0 && lines.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select at least one packaging category or add a line item",
          path: ["packagingCategories"],
        });
      }
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
