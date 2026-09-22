import { z } from "zod";

export const technologyInquiryTypes = [
  "TECHNOLOGY_ERP",
  "TECHNOLOGY_WEBSITE",
  "TECHNOLOGY_MARKETING",
] as const;

export type TechnologyInquiryType = (typeof technologyInquiryTypes)[number];

/** URL query aliases → inquiry type */
export const technologyTypeAliases: Record<string, TechnologyInquiryType> = {
  erp: "TECHNOLOGY_ERP",
  website: "TECHNOLOGY_WEBSITE",
  marketing: "TECHNOLOGY_MARKETING",
  TECHNOLOGY_ERP: "TECHNOLOGY_ERP",
  TECHNOLOGY_WEBSITE: "TECHNOLOGY_WEBSITE",
  TECHNOLOGY_MARKETING: "TECHNOLOGY_MARKETING",
};

export const technologyTypeLabels: Record<TechnologyInquiryType, string> = {
  TECHNOLOGY_ERP: "ERP Solutions",
  TECHNOLOGY_WEBSITE: "Website Development",
  TECHNOLOGY_MARKETING: "Digital Marketing",
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined))
  .refine(
    (v) => !v || /^https?:\/\//i.test(v) || /^[a-z0-9.-]+\.[a-z]{2,}/i.test(v),
    "Enter a valid URL or domain",
  );

export const technologyInquirySchema = z
  .object({
    contactName: z.string().trim().min(2, "Contact name is required").max(120),
    companyName: z
      .string()
      .trim()
      .min(2, "Company or business name is required")
      .max(160),
    email: z.string().trim().email("Enter a valid email address").max(160),
    phone: optionalText(40).refine(
      (v) => !v || /^[+0-9()\-\s.]+$/.test(v),
      "Enter a valid phone number",
    ),
    country: z.string().trim().min(2, "Country is required").max(80),
    inquiryType: z.enum(technologyInquiryTypes, {
      errorMap: () => ({ message: "Select a service" }),
    }),
    projectDescription: z
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters describing your project")
      .max(4000),
    estimatedBudget: optionalText(120),
    expectedTimeline: optionalText(120),
    // ERP
    industry: optionalText(120),
    requiredModules: optionalText(1000),
    existingSoftware: optionalText(500),
    numberOfUsers: optionalText(80),
    integrationRequirements: optionalText(1000),
    // Website
    websiteType: optionalText(120),
    existingWebsiteUrl: optionalUrl,
    approximatePageCount: optionalText(80),
    ecommerceRequired: optionalText(40),
    // Marketing
    currentChannels: optionalText(1000),
    marketingObjectives: optionalText(1000),
    targetAudience: optionalText(1000),
    interestedChannels: optionalText(500),
    monthlyMarketingBudget: optionalText(120),
    sourcePage: optionalText(200),
    /** Honeypot — must be empty */
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType === "TECHNOLOGY_WEBSITE" && data.existingWebsiteUrl) {
      // already refined on field
    }
  });

export type TechnologyInquiryInput = z.infer<typeof technologyInquirySchema>;

export function isTechnologyInquiryType(
  value: string,
): value is TechnologyInquiryType {
  return (technologyInquiryTypes as readonly string[]).includes(value);
}

export function resolveTechnologyTypeParam(
  raw?: string | null,
): TechnologyInquiryType | undefined {
  if (!raw) return undefined;
  return technologyTypeAliases[raw.trim()] ?? technologyTypeAliases[raw.trim().toLowerCase()];
}
