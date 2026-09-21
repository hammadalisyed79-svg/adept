import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient, ErpSyncStatus } from "@prisma/client";
import { createBusinessInquiry } from "@/lib/inquiries/create";
import { checkRateLimit } from "@/lib/rate-limit";

const prisma = new PrismaClient();

const baseInput = {
  contactName: "Integration Tester",
  companyName: "Test Brand LLC",
  email: `integration-${Date.now()}@example.com`,
  phone: "+1 555 0199",
  country: "United States",
  industry: "Personal Care" as const,
  inquiryType: "TOLL_MANUFACTURING" as const,
  productCategory: "Body mist",
  estimatedQuantity: "1000",
  quantityUnit: "units" as const,
  projectDescription:
    "Integration test inquiry for toll manufacturing of body mist with client-supplied fragrance.",
  sourcePage: "/request-quote",
  website: "",
};

describe("inquiry persistence", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("saves inquiry with unique reference and NOT_CONNECTED ERP status", async () => {
    const result = await createBusinessInquiry(baseInput, {
      ip: "203.0.113.10",
      userAgent: "vitest",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.inquiry.reference).toMatch(/^ADF-\d{8}-[A-F0-9]{6}$/);
    expect(result.inquiry.erpSyncStatus).toBe(ErpSyncStatus.NOT_CONNECTED);

    const stored = await prisma.businessInquiry.findUnique({
      where: { id: result.inquiry.id },
      include: { activities: true, notifications: true },
    });

    expect(stored).not.toBeNull();
    expect(stored!.email).toBe(baseInput.email.toLowerCase());
    expect(stored!.activities.length).toBeGreaterThan(0);
    expect(stored!.notifications.some((n) => n.channel === "EMAIL")).toBe(true);
    expect(stored!.notifications.some((n) => n.channel === "ERP")).toBe(true);
  });

  it("blocks duplicate submission within 2 minutes", async () => {
    const email = `dup-${Date.now()}@example.com`;
    const first = await createBusinessInquiry(
      { ...baseInput, email },
      { ip: "203.0.113.11" },
    );
    expect(first.ok).toBe(true);

    const second = await createBusinessInquiry(
      { ...baseInput, email },
      { ip: "203.0.113.11" },
    );
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe("DUPLICATE");
  });

  it("rate limit eventually blocks repeated keys", async () => {
    const key = `test-${Date.now()}`;
    let blocked = false;
    for (let i = 0; i < 8; i += 1) {
      const result = await checkRateLimit(key, 5, 60_000);
      if (!result.allowed) {
        blocked = true;
        break;
      }
    }
    expect(blocked).toBe(true);
  });
});
