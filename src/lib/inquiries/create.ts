import {
  ErpSyncStatus,
  NotificationChannel,
  NotificationStatus,
  type BusinessInquiry,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { getErpAdapter } from "@/lib/erp/adapter";
import { sendInquiryNotification } from "@/lib/mail";
import { generateInquiryReference, hashIp } from "@/lib/reference";
import type { InquiryInput } from "@/lib/validation/inquiry";

export type CreateInquiryResult =
  | { ok: true; inquiry: BusinessInquiry }
  | { ok: false; error: string; code: "DUPLICATE" | "PERSISTENCE" | "VALIDATION" };

export async function createBusinessInquiry(
  input: InquiryInput,
  meta: { ip?: string; userAgent?: string },
): Promise<CreateInquiryResult> {
  const reference = generateInquiryReference();
  const ipHash = meta.ip ? hashIp(meta.ip) : undefined;

  // Soft duplicate guard: same email + type within 2 minutes
  const recent = await prisma.businessInquiry.findFirst({
    where: {
      email: input.email.toLowerCase(),
      inquiryType: input.inquiryType,
      createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    return {
      ok: false,
      error:
        "An identical inquiry was just submitted. Please wait a moment or use your existing reference.",
      code: "DUPLICATE",
    };
  }

  let inquiry: BusinessInquiry;
  try {
    inquiry = await prisma.businessInquiry.create({
      data: {
        reference,
        inquiryType: input.inquiryType,
        contactName: input.contactName,
        companyName: input.companyName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        country: input.country,
        industry: input.industry,
        productCategory: input.productCategory,
        estimatedQuantity: input.estimatedQuantity,
        quantityUnit: input.quantityUnit,
        projectDescription: input.projectDescription,
        targetPrice: input.targetPrice,
        fragranceDirection: input.fragranceDirection,
        requiredConcentration: input.requiredConcentration,
        bottleSize: input.bottleSize,
        packagingRequirements: input.packagingRequirements,
        expectedTimeline: input.expectedTimeline,
        sampleRequirements: input.sampleRequirements,
        sourcePage: input.sourcePage,
        userAgent: meta.userAgent?.slice(0, 300),
        ipHash,
        notificationStatus: NotificationStatus.PENDING,
        erpSyncStatus: ErpSyncStatus.NOT_CONNECTED,
        activities: {
          create: {
            action: "CREATED",
            detail: "Inquiry received via website",
          },
        },
      },
    });
  } catch (err) {
    console.error("[inquiry] Persistence failed:", err instanceof Error ? err.message : err);
    return {
      ok: false,
      error: "Unable to save your inquiry. Please try again shortly.",
      code: "PERSISTENCE",
    };
  }

  // Notifications & ERP — never undo a successful save; side-effect failures must not hide the inquiry
  try {
    const mail = await sendInquiryNotification(inquiry);
    const notificationStatus: NotificationStatus = mail.sent
      ? NotificationStatus.SENT
      : mail.skipped
        ? NotificationStatus.SKIPPED
        : NotificationStatus.FAILED;

    await prisma.notificationDelivery.create({
      data: {
        inquiryId: inquiry.id,
        channel: NotificationChannel.EMAIL,
        recipient: mail.recipient,
        status: notificationStatus,
        error: mail.error,
      },
    });

    await prisma.businessInquiry.update({
      where: { id: inquiry.id },
      data: { notificationStatus },
    });

    if (mail.blocked || mail.skipped) {
      await prisma.inquiryActivity.create({
        data: {
          inquiryId: inquiry.id,
          action: "NOTIFICATION_BLOCKED",
          detail: mail.error ?? "Email notifications blocked — SMTP not configured",
        },
      });
    } else if (!mail.sent) {
      await prisma.inquiryActivity.create({
        data: {
          inquiryId: inquiry.id,
          action: "NOTIFICATION_FAILED",
          detail: mail.error ?? "Email delivery failed",
        },
      });
    }

    const erp = getErpAdapter();
    const sync = await erp.syncInquiry({
      reference: inquiry.reference,
      inquiryType: inquiry.inquiryType,
      industry: inquiry.industry,
      productCategory: inquiry.productCategory,
      description: inquiry.projectDescription,
      customer: {
        companyName: inquiry.companyName,
        contactName: inquiry.contactName,
        email: inquiry.email,
        phone: inquiry.phone,
        country: inquiry.country,
      },
    });

    const erpStatus =
      sync.status === "SYNCED"
        ? ErpSyncStatus.SYNCED
        : sync.status === "FAILED"
          ? ErpSyncStatus.FAILED
          : ErpSyncStatus.NOT_CONNECTED;

    await prisma.businessInquiry.update({
      where: { id: inquiry.id },
      data: {
        erpSyncStatus: erpStatus,
        erpExternalId: sync.externalId,
      },
    });

    await prisma.notificationDelivery.create({
      data: {
        inquiryId: inquiry.id,
        channel: NotificationChannel.ERP,
        recipient: erp.name,
        status:
          sync.status === "SYNCED"
            ? NotificationStatus.SENT
            : sync.status === "NOT_CONNECTED"
              ? NotificationStatus.SKIPPED
              : NotificationStatus.FAILED,
        error: sync.success ? null : sync.message,
      },
    });
  } catch (sideEffectError) {
    console.error(
      "[inquiry] Post-save notification/ERP side effects failed; inquiry retained:",
      sideEffectError instanceof Error ? sideEffectError.message : sideEffectError,
      { reference: inquiry.reference },
    );
    try {
      await prisma.inquiryActivity.create({
        data: {
          inquiryId: inquiry.id,
          action: "SIDE_EFFECT_ERROR",
          detail:
            sideEffectError instanceof Error
              ? sideEffectError.message
              : "Unknown post-save error",
        },
      });
    } catch {
      // Inquiry already saved — do not fail the request
    }
  }

  const refreshed = await prisma.businessInquiry.findUnique({
    where: { id: inquiry.id },
  });

  return { ok: true, inquiry: refreshed ?? inquiry };
}
