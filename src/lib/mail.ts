import nodemailer from "nodemailer";
import { company } from "@/lib/company";
import type { BusinessInquiry } from "@prisma/client";

export type MailResult = {
  sent: boolean;
  skipped: boolean;
  error?: string;
  recipient: string;
};

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      (process.env.SALES_EMAIL || company.salesEmail),
  );
}

export async function sendInquiryNotification(
  inquiry: BusinessInquiry,
): Promise<MailResult> {
  const recipient = process.env.SALES_EMAIL || company.salesEmail;

  if (!isSmtpConfigured()) {
    return {
      sent: false,
      skipped: true,
      error: "SMTP not configured — notification skipped",
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

    const subject = `[ADEPT] New inquiry ${inquiry.reference} — ${inquiry.inquiryType}`;
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
      "",
      "Project description:",
      inquiry.projectDescription,
      "",
      `Source page: ${inquiry.sourcePage ?? "n/a"}`,
      `Submitted: ${inquiry.createdAt.toISOString()}`,
    ].join("\n");

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      subject,
      text,
    });

    return { sent: true, skipped: false, recipient };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown mail error";
    console.error("[mail] Notification delivery failed:", message);
    return { sent: false, skipped: false, error: message, recipient };
  }
}
