import { describe, expect, it } from "vitest";
import {
  resolveTechnologyTypeParam,
  technologyInquirySchema,
  isTechnologyInquiryType,
} from "@/lib/validation/technology-inquiry";
import { inquirySchema } from "@/lib/validation/inquiry";

const techBase = {
  contactName: "Tech Contact",
  companyName: "Tech Co Ltd",
  email: "tech@example.com",
  phone: "+44 20 7946 0000",
  country: "United Kingdom",
  inquiryType: "TECHNOLOGY_ERP" as const,
  projectDescription:
    "Need ERP coverage for inventory, purchasing, and production reporting across two warehouses.",
  website: "",
};

describe("technologyInquirySchema", () => {
  it("accepts TECHNOLOGY_ERP with required fields", () => {
    const result = technologyInquirySchema.safeParse(techBase);
    expect(result.success).toBe(true);
  });

  it("accepts TECHNOLOGY_WEBSITE with optional URL", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      inquiryType: "TECHNOLOGY_WEBSITE",
      websiteType: "Ecommerce",
      existingWebsiteUrl: "https://example.com",
      ecommerceRequired: "Yes",
      projectDescription:
        "Rebuild corporate catalogue site with quotation flow and optional ecommerce.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts TECHNOLOGY_MARKETING with optional channel fields", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      inquiryType: "TECHNOLOGY_MARKETING",
      marketingObjectives: "Lead generation for B2B buyers",
      interestedChannels: "LinkedIn, SEO",
      projectDescription:
        "Digital marketing support for fragrance brand launch across social and search.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required company name", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      companyName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short project description", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      projectDescription: "too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unsupported inquiry types on technology schema", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      inquiryType: "FRAGRANCE_TRADING",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid optional website URL", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      inquiryType: "TECHNOLOGY_WEBSITE",
      existingWebsiteUrl: "not a url!!!",
      projectDescription:
        "Website rebuild with catalogue and quotation capabilities for wholesale buyers.",
    });
    expect(result.success).toBe(false);
  });

  it("normalizes email via parse success path (API lowercases on create)", () => {
    const result = technologyInquirySchema.safeParse({
      ...techBase,
      email: "  Tech.Person@Example.COM ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("Tech.Person@Example.COM");
    }
  });
});

describe("technology type helpers", () => {
  it("resolves query aliases for direct links", () => {
    expect(resolveTechnologyTypeParam("erp")).toBe("TECHNOLOGY_ERP");
    expect(resolveTechnologyTypeParam("website")).toBe("TECHNOLOGY_WEBSITE");
    expect(resolveTechnologyTypeParam("marketing")).toBe("TECHNOLOGY_MARKETING");
    expect(resolveTechnologyTypeParam("unknown")).toBeUndefined();
  });

  it("isTechnologyInquiryType distinguishes fragrance types", () => {
    expect(isTechnologyInquiryType("TECHNOLOGY_ERP")).toBe(true);
    expect(isTechnologyInquiryType("FRAGRANCE_TRADING")).toBe(false);
  });
});

describe("fragrance schema compatibility after technology types", () => {
  it("still validates fragrance inquiries separately", () => {
    const result = inquirySchema.safeParse({
      contactName: "Alex Buyer",
      companyName: "Example Brand Co",
      email: "alex@example.com",
      phone: "+1 555 0100",
      country: "United States",
      industry: "Fine Fragrance",
      inquiryType: "FRAGRANCE_TRADING",
      productCategory: "EDP",
      estimatedQuantity: "50",
      quantityUnit: "kg",
      projectDescription: "Looking for fine fragrance concentrates for a new EDP line.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("fragrance schema rejects technology inquiry types", () => {
    const result = inquirySchema.safeParse({
      contactName: "Alex Buyer",
      companyName: "Example Brand Co",
      email: "alex@example.com",
      phone: "+1 555 0100",
      country: "United States",
      industry: "Fine Fragrance",
      inquiryType: "TECHNOLOGY_ERP",
      productCategory: "ERP",
      estimatedQuantity: "1",
      quantityUnit: "kg",
      projectDescription: "Should not validate as fragrance trading inquiry payload.",
      website: "",
    });
    expect(result.success).toBe(false);
  });
});
