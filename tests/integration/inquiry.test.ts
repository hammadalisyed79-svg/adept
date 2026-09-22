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

  it("persists packaging inquiry fields and line items without losing fragrance types", async () => {
    const email = `packaging-${Date.now()}@example.com`;
    const result = await createBusinessInquiry(
      {
        ...baseInput,
        email,
        inquiryType: "PACKAGING_COMPONENTS",
        productCategory: "Perfume bottles, Pumps & collars",
        quantityUnit: "pieces",
        estimatedQuantity: "10000",
        packagingCategories: ["Perfume bottles", "Pumps & collars"],
        deliveryDestination: "Karachi, Pakistan",
        capacitySize: "100ml",
        material: "Glass / aluminium",
        colourFinish: "Frosted / silver",
        componentReference: "Sample bottle TBD",
        matchingRequirements: "Confirm neck finish before claiming pump compatibility",
        lineItems: [
          {
            category: "Perfume bottles",
            quantity: "10000",
            capacitySize: "100ml",
            material: "Glass",
            colourFinish: "Frosted",
          },
          {
            category: "Pumps & collars",
            quantity: "10000",
            material: "Aluminium",
            colourFinish: "Silver",
            notes: "Match bottle neck — verify before quote",
          },
        ],
        projectDescription:
          "Packaging components quotation for perfume bottles and matching pumps for export brand.",
      },
      { ip: "203.0.113.14", userAgent: "vitest-packaging" },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const stored = await prisma.businessInquiry.findUnique({
      where: { id: result.inquiry.id },
    });
    expect(stored).not.toBeNull();
    expect(stored!.inquiryType).toBe("PACKAGING_COMPONENTS");
    expect(stored!.packagingCategories).toContain("Perfume bottles");
    expect(stored!.deliveryDestination).toBe("Karachi, Pakistan");
    expect(stored!.capacitySize).toBe("100ml");
    expect(stored!.lineItemsJson).toContain("Pumps & collars");

    const fragrance = await createBusinessInquiry(
      {
        ...baseInput,
        email: `fragrance-after-pack-${Date.now()}@example.com`,
        inquiryType: "FRAGRANCE_TRADING",
        productCategory: "EDP concentrate",
        quantityUnit: "kg",
        projectDescription:
          "Confirm fragrance trading inquiries still persist after packaging schema expansion.",
      },
      { ip: "203.0.113.15" },
    );
    expect(fragrance.ok).toBe(true);
  });

  it("persists TECHNOLOGY_ERP / WEBSITE / MARKETING with details JSON and SMTP skipped", async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const stamp = Date.now();
    const cases = [
      {
        inquiryType: "TECHNOLOGY_ERP" as const,
        email: `tech-erp-${stamp}@example.com`,
        industry: "Fragrance manufacturing",
        requiredModules: "Inventory, Production",
        numberOfUsers: "25",
        projectDescription:
          "ERP consultation for multi-warehouse inventory and production reporting.",
      },
      {
        inquiryType: "TECHNOLOGY_WEBSITE" as const,
        email: `tech-web-${stamp}@example.com`,
        websiteType: "B2B",
        existingWebsiteUrl: "https://example-brand.com",
        ecommerceRequired: "No",
        projectDescription:
          "Website development for B2B catalogue and quotation request experience.",
      },
      {
        inquiryType: "TECHNOLOGY_MARKETING" as const,
        email: `tech-mkt-${stamp}@example.com`,
        marketingObjectives: "Qualified B2B leads",
        interestedChannels: "LinkedIn, SEO",
        monthlyMarketingBudget: "TBD",
        projectDescription:
          "Digital marketing support for fragrance brand growth across priority channels.",
      },
    ];

    for (const c of cases) {
      const result = await createBusinessInquiry(
        {
          contactName: "Technology Tester",
          companyName: "ADEPT Test Co",
          email: c.email,
          phone: "+1 555 0200",
          country: "United Arab Emirates",
          inquiryType: c.inquiryType,
          projectDescription: c.projectDescription,
          industry: "industry" in c ? c.industry : undefined,
          requiredModules: "requiredModules" in c ? c.requiredModules : undefined,
          numberOfUsers: "numberOfUsers" in c ? c.numberOfUsers : undefined,
          websiteType: "websiteType" in c ? c.websiteType : undefined,
          existingWebsiteUrl:
            "existingWebsiteUrl" in c ? c.existingWebsiteUrl : undefined,
          ecommerceRequired:
            "ecommerceRequired" in c ? c.ecommerceRequired : undefined,
          marketingObjectives:
            "marketingObjectives" in c ? c.marketingObjectives : undefined,
          interestedChannels:
            "interestedChannels" in c ? c.interestedChannels : undefined,
          monthlyMarketingBudget:
            "monthlyMarketingBudget" in c ? c.monthlyMarketingBudget : undefined,
          sourcePage: "/technology/request-quote",
          website: "",
        },
        { ip: "203.0.113.40", userAgent: "vitest-technology" },
      );

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.inquiry.reference).toMatch(/^ADF-\d{8}-[A-F0-9]{6}$/);
      expect(result.inquiry.inquiryType).toBe(c.inquiryType);
      expect(result.inquiry.notificationStatus).toBe("SKIPPED");
      expect(result.inquiry.technologyDetailsJson).toBeTruthy();

      const stored = await prisma.businessInquiry.findUnique({
        where: { id: result.inquiry.id },
      });
      expect(stored?.inquiryType).toBe(c.inquiryType);
      expect(stored?.estimatedBudget ?? null).toBeNull();
    }

    const fragrance = await createBusinessInquiry(
      {
        ...baseInput,
        email: `fragrance-after-tech-${stamp}@example.com`,
        inquiryType: "FRAGRANCE_TRADING",
        productCategory: "EDP concentrate",
        quantityUnit: "kg",
        projectDescription:
          "Confirm fragrance trading inquiries still persist after technology inquiry types.",
      },
      { ip: "203.0.113.41" },
    );
    expect(fragrance.ok).toBe(true);
  });

  it("retains inquiry when SMTP is configured but delivery fails", async () => {
    process.env.SMTP_HOST = "127.0.0.1";
    process.env.SMTP_PORT = "1";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.SALES_EMAIL = "info@adeptfragrances.com";
    process.env.SMTP_FROM = "info@adeptfragrances.com";
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

    const delivery = await prisma.notificationDelivery.findFirst({
      where: { inquiryId: result.inquiry.id, channel: "EMAIL" },
    });
    expect(delivery?.recipient).toBe("info@adeptfragrances.com");

    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_PORT;
    delete process.env.SALES_EMAIL;
    delete process.env.SMTP_FROM;
  });
});
