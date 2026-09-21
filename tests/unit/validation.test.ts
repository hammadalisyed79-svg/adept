import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/validation/inquiry";
import { generateInquiryReference, hashIp } from "@/lib/reference";
import { getErpAdapter, NotConnectedErpAdapter } from "@/lib/erp/adapter";

describe("inquirySchema", () => {
  const valid = {
    contactName: "Alex Buyer",
    companyName: "Example Brand Co",
    email: "alex@example.com",
    phone: "+1 555 0100",
    country: "United States",
    industry: "Fine Fragrance" as const,
    inquiryType: "FRAGRANCE_TRADING" as const,
    productCategory: "EDP",
    estimatedQuantity: "50",
    quantityUnit: "kg" as const,
    projectDescription: "Looking for fine fragrance concentrates for a new EDP line.",
    website: "",
  };

  it("accepts a valid trading inquiry", () => {
    const result = inquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects short project descriptions", () => {
    const result = inquirySchema.safeParse({ ...valid, projectDescription: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = inquirySchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("allows empty optional fields", () => {
    const result = inquirySchema.safeParse({
      ...valid,
      targetPrice: "",
      fragranceDirection: "",
      bottleSize: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetPrice).toBeUndefined();
      expect(result.data.fragranceDirection).toBeUndefined();
    }
  });

  it("does not require optional private-label fields", () => {
    const result = inquirySchema.safeParse({
      ...valid,
      inquiryType: "PRIVATE_LABEL",
    });
    expect(result.success).toBe(true);
  });
});

describe("reference helpers", () => {
  it("generates ADF reference format", () => {
    const ref = generateInquiryReference(new Date("2026-03-21T12:00:00Z"));
    expect(ref).toMatch(/^ADF-20260321-[A-F0-9]{6}$/);
  });

  it("hashes IPs deterministically with salt", () => {
    const a = hashIp("1.2.3.4");
    const b = hashIp("1.2.3.4");
    const c = hashIp("1.2.3.5");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toHaveLength(32);
  });
});

describe("ERP adapter", () => {
  it("defaults to NOT CONNECTED", () => {
    const adapter = getErpAdapter();
    expect(adapter.isConnected()).toBe(false);
    expect(adapter).toBeInstanceOf(NotConnectedErpAdapter);
  });

  it("returns NOT_CONNECTED on sync", async () => {
    const adapter = new NotConnectedErpAdapter();
    const result = await adapter.syncInquiry({
      reference: "ADF-TEST",
      inquiryType: "FRAGRANCE_TRADING",
      industry: "Fine Fragrance",
      productCategory: "EDP",
      description: "test",
      customer: {
        companyName: "Co",
        contactName: "Name",
        email: "a@b.com",
        phone: "+10000000000",
        country: "US",
      },
    });
    expect(result.status).toBe("NOT_CONNECTED");
    expect(result.connected).toBe(false);
  });
});
