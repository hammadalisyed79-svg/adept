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

  it("marks email notification as SKIPPED/BLOCKED when SMTP is absent", async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const email = `blocked-mail-${Date.now()}@example.com`;
    const result = await createBusinessInquiry(
      { ...baseInput, email },
      { ip: "203.0.113.12" },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.inquiry.notificationStatus).toBe("SKIPPED");

    const activities = await prisma.inquiryActivity.findMany({
      where: { inquiryId: result.inquiry.id },
    });
    expect(activities.some((a) => a.action === "NOTIFICATION_BLOCKED")).toBe(true);

    const deliveries = await prisma.notificationDelivery.findMany({
      where: { inquiryId: result.inquiry.id, channel: "EMAIL" },
    });
    expect(deliveries[0]?.status).toBe("SKIPPED");
    expect(deliveries[0]?.error).toMatch(/EMAIL_NOTIFICATIONS_BLOCKED/);
  });

  it("retains inquiry when SMTP is configured but delivery fails", async () => {
    process.env.SMTP_HOST = "127.0.0.1";
    process.env.SMTP_PORT = "1";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.SALES_EMAIL = "sales@example.com";
    process.env.SMTP_SECURE = "false";

    const email = `fail-mail-${Date.now()}@example.com`;
    const result = await createBusinessInquiry(
      { ...baseInput, email, inquiryType: "PRIVATE_LABEL" },
      { ip: "203.0.113.13" },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.inquiry.reference).toMatch(/^ADF-/);
    expect(result.inquiry.notificationStatus).toBe("FAILED");

    const stored = await prisma.businessInquiry.findUnique({
      where: { id: result.inquiry.id },
    });
    expect(stored).not.toBeNull();

    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_PORT;
    delete process.env.SALES_EMAIL;
  });
});
