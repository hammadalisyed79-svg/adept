import { afterEach, describe, expect, it } from "vitest";
import { getMailConfigStatus, getInquiryNotificationRecipient, getSmtpFromAddress, sendInquiryNotification } from "@/lib/mail";
import type { BusinessInquiry } from "@prisma/client";

const smtpKeys = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_FROM",
  "SALES_EMAIL",
  "COMPANY_EMAIL",
] as const;

const saved: Partial<Record<(typeof smtpKeys)[number], string | undefined>> = {};

afterEach(() => {
  for (const key of smtpKeys) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

function clearSmtp() {
  for (const key of smtpKeys) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
}

function fakeInquiry(): BusinessInquiry {
  return {
    id: "test-id",
    reference: "ADF-20260921-TEST01",
    inquiryType: "FRAGRANCE_TRADING",
    status: "NEW",
    contactName: "Test",
    companyName: "Co",
    email: "t@example.com",
    phone: "+10000000000",
    country: "US",
    industry: "Fine Fragrance",
    productCategory: "EDP",
    estimatedQuantity: "10",
    quantityUnit: "kg",
    projectDescription: "Test project description for mail unit tests.",
    targetPrice: null,
    fragranceDirection: null,
    requiredConcentration: null,
    bottleSize: null,
    packagingRequirements: null,
    expectedTimeline: null,
    sampleRequirements: null,
    packagingCategories: null,
    deliveryDestination: null,
    componentReference: null,
    matchingRequirements: null,
    material: null,
    colourFinish: null,
    capacitySize: null,
    lineItemsJson: null,
    estimatedBudget: null,
    technologyDetailsJson: null,
    sourcePage: "/request-quote",
    userAgent: null,
    ipHash: null,
    notificationStatus: "PENDING",
    erpSyncStatus: "NOT_CONNECTED",
    erpExternalId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("mail configuration", () => {
  it("reports BLOCKED_NOT_CONFIGURED when SMTP env is missing", () => {
    clearSmtp();
    expect(getMailConfigStatus()).toBe("BLOCKED_NOT_CONFIGURED");
  });

  it("reports CONFIGURED when SMTP env is present", () => {
    clearSmtp();
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.SALES_EMAIL = "info@example.com";
    expect(getMailConfigStatus()).toBe("CONFIGURED");
  });

  it("returns blocked result without throwing when SMTP missing", async () => {
    clearSmtp();
    const result = await sendInquiryNotification(fakeInquiry());
    expect(result.blocked).toBe(true);
    expect(result.skipped).toBe(true);
    expect(result.sent).toBe(false);
    expect(result.status).toBe("BLOCKED_NOT_CONFIGURED");
    expect(result.error).toMatch(/EMAIL_NOTIFICATIONS_BLOCKED/);
    expect(result.recipient).toBe("info@adeptfragrances.com");
  });

  it("returns FAILED when SMTP is configured but unreachable", async () => {
    clearSmtp();
    process.env.SMTP_HOST = "127.0.0.1";
    process.env.SMTP_PORT = "1";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.SALES_EMAIL = "info@adeptfragrances.com";
    process.env.SMTP_FROM = "info@adeptfragrances.com";
    process.env.SMTP_SECURE = "false";

    const result = await sendInquiryNotification(fakeInquiry());
    expect(result.sent).toBe(false);
    expect(result.blocked).toBe(false);
    expect(result.status).toBe("FAILED");
    expect(result.error).toBeTruthy();
    expect(result.recipient).toBe("info@adeptfragrances.com");
  }, 20000);

  it("routes notifications to info@ by default and uses info@ as From when SMTP_FROM unset", () => {
    clearSmtp();
    delete process.env.SALES_EMAIL;
    delete process.env.COMPANY_EMAIL;
    delete process.env.SMTP_FROM;
    expect(getInquiryNotificationRecipient()).toBe("info@adeptfragrances.com");
    expect(getSmtpFromAddress()).toBe("info@adeptfragrances.com");
  });

  it("honours SALES_EMAIL override when set to the official mailbox", () => {
    clearSmtp();
    process.env.SALES_EMAIL = "info@adeptfragrances.com";
    expect(getInquiryNotificationRecipient()).toBe("info@adeptfragrances.com");
  });
});
