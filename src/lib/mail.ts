import nodemailer from "nodemailer";
import { company } from "@/lib/company";
import type { BusinessInquiry } from "@prisma/client";

export type MailConfigStatus = "CONFIGURED" | "BLOCKED_NOT_CONFIGURED";

export type MailResult = {
  sent: boolean;
  skipped: boolean;
  blocked: boolean;
  status: MailConfigStatus | "SENT" | "FAILED";
  error?: string;
  recipient: string;
};

/** Single official business mailbox — used for display and notifications. */
export const OFFICIAL_BUSINESS_EMAIL = "info@adeptfragrances.com";

/**
 * Inquiry notification recipient.
 * SALES_EMAIL is retained for env compatibility but must point at the same
 * official mailbox (info@adeptfragrances.com).
 */
export function getInquiryNotificationRecipient(): string {
  return (
    process.env.SALES_EMAIL?.trim() ||
    process.env.COMPANY_EMAIL?.trim() ||
    company.salesEmail ||
    company.email ||
    OFFICIAL_BUSINESS_EMAIL
  );
}

/**
 * From address once the provider authorizes sending as this address.
 * SMTP_USER may differ from the From address (do not assume they match).
 */
export function getSmtpFromAddress(): string {
  return (
    process.env.SMTP_FROM?.trim() ||
    process.env.COMPANY_EMAIL?.trim() ||
    company.email ||
    OFFICIAL_BUSINESS_EMAIL
  );
}

export function getMailConfigStatus(): MailConfigStatus {
  const configured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      getInquiryNotificationRecipient(),
  );
  return configured ? "CONFIGURED" : "BLOCKED_NOT_CONFIGURED";
}

export function isSmtpConfigured(): boolean {
  return getMailConfigStatus() === "CONFIGURED";
}

export async function sendInquiryNotification(
  inquiry: BusinessInquiry,
): Promise<MailResult> {
  const recipient = getInquiryNotificationRecipient();

  if (!isSmtpConfigured()) {
    const error =
      "EMAIL_NOTIFICATIONS_BLOCKED: SMTP is not configured. Inquiry was saved to the database; configure SMTP_HOST, SMTP_USER, SMTP_PASS, and set SALES_EMAIL/COMPANY_EMAIL to info@adeptfragrances.com to enable delivery.";
    console.warn("[mail]", error, { reference: inquiry.reference });
    return {
      sent: false,
      skipped: true,
      blocked: true,
      status: "BLOCKED_NOT_CONFIGURED",
      error,
      recipient,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = `[ADEPT Fragrances] New inquiry ${inquiry.reference} — ${inquiry.inquiryType}`;
    const text = [
      `Inquiry reference: ${inquiry.reference}`,
      `Type: ${inquiry.inquiryType}`,
      `Contact: ${inquiry.contactName}`,
      `Company: ${inquiry.companyName}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone}`,
      `Country: ${inquiry.country}`,
      `Industry: ${inquiry.industry}`,
      `Category: ${inquiry.productCategory}`,
      `Quantity: ${inquiry.estimatedQuantity} ${inquiry.quantityUnit}`,
      inquiry.packagingCategories
        ? `Packaging categories: ${inquiry.packagingCategories}`
        : "",
      inquiry.deliveryDestination
        ? `Delivery destination: ${inquiry.deliveryDestination}`
        : "",
      inquiry.componentReference
        ? `Component / bottle reference: ${inquiry.componentReference}`
        : "",
      inquiry.capacitySize ? `Capacity / size: ${inquiry.capacitySize}` : "",
      inquiry.material ? `Material: ${inquiry.material}` : "",
      inquiry.colourFinish ? `Colour / finish: ${inquiry.colourFinish}` : "",
      inquiry.matchingRequirements
        ? `Matching requirements: ${inquiry.matchingRequirements}`
        : "",
      inquiry.lineItemsJson ? `Line items JSON: ${inquiry.lineItemsJson}` : "",
      "",
      "Project description:",
      inquiry.projectDescription,
      "",
      `Source page: ${inquiry.sourcePage ?? "n/a"}`,
      `Submitted: ${inquiry.createdAt.toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: getSmtpFromAddress(),
      to: recipient,
      subject,
      text,
    });

    return {
      sent: true,
      skipped: false,
      blocked: false,
      status: "SENT",
      recipient,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown mail error";
    console.error("[mail] Notification delivery failed:", message, {
      reference: inquiry.reference,
    });
    return {
      sent: false,
      skipped: false,
      blocked: false,
      status: "FAILED",
      error: message,
      recipient,
    };
  }
}
