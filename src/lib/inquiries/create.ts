import {
  ErpSyncStatus,
  NotificationChannel,
  NotificationStatus,
  type BusinessInquiry,
  type InquiryType,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { getErpAdapter } from "@/lib/erp/adapter";
import { sendInquiryNotification } from "@/lib/mail";
import { generateInquiryReference, hashIp } from "@/lib/reference";
import type { InquiryInput } from "@/lib/validation/inquiry";
import {
  technologyTypeLabels,
  type TechnologyInquiryInput,
} from "@/lib/validation/technology-inquiry";

export type CreateInquiryResult =
  | { ok: true; inquiry: BusinessInquiry }
  | { ok: false; error: string; code: "DUPLICATE" | "PERSISTENCE" | "VALIDATION" };

function isTechnologyInput(
  input: InquiryInput | TechnologyInquiryInput,
): input is TechnologyInquiryInput {
  return (
    input.inquiryType === "TECHNOLOGY_ERP" ||
    input.inquiryType === "TECHNOLOGY_WEBSITE" ||
    input.inquiryType === "TECHNOLOGY_MARKETING" ||
    input.inquiryType === "TECHNOLOGY_AI"
  );
}

function buildTechnologyDetails(input: TechnologyInquiryInput): string | undefined {
  const details: Record<string, string> = {};
  const assign = (key: string, value?: string) => {
    if (value) details[key] = value;
  };

  if (input.inquiryType === "TECHNOLOGY_ERP") {
    assign("industry", input.industry);
    assign("requiredModules", input.requiredModules);
    assign("existingSoftware", input.existingSoftware);
    assign("numberOfUsers", input.numberOfUsers);
    assign("integrationRequirements", input.integrationRequirements);
  }
  if (input.inquiryType === "TECHNOLOGY_WEBSITE") {
    assign("websiteType", input.websiteType);
    assign("existingWebsiteUrl", input.existingWebsiteUrl);
    assign("approximatePageCount", input.approximatePageCount);
    assign("ecommerceRequired", input.ecommerceRequired);
    assign("integrationRequirements", input.integrationRequirements);
  }
  if (input.inquiryType === "TECHNOLOGY_MARKETING") {
    assign("currentChannels", input.currentChannels);
    assign("marketingObjectives", input.marketingObjectives);
    assign("targetAudience", input.targetAudience);
    assign("interestedChannels", input.interestedChannels);
    assign("monthlyMarketingBudget", input.monthlyMarketingBudget);
  }
  if (input.inquiryType === "TECHNOLOGY_AI") {
    assign("existingWebsiteUrl", input.existingWebsiteUrl);
    assign("chatbotGoals", input.chatbotGoals);
    assign("commonQuestions", input.commonQuestions);
    assign("handoffPreference", input.handoffPreference);
    assign("knowledgeSources", input.knowledgeSources);
    assign("integrationRequirements", input.integrationRequirements);
  }

  return Object.keys(details).length ? JSON.stringify(details) : undefined;
}

function toCreateData(input: InquiryInput | TechnologyInquiryInput) {
  if (isTechnologyInput(input)) {
    const label = technologyTypeLabels[input.inquiryType];
    return {
      inquiryType: input.inquiryType as InquiryType,
      contactName: input.contactName,
      companyName: input.companyName,
      email: input.email.toLowerCase(),
      phone: input.phone?.trim() || "Not provided",
      country: input.country,
      industry:
        input.inquiryType === "TECHNOLOGY_ERP"
          ? input.industry?.trim() || "Technology"
          : "Technology",
      productCategory:
        input.inquiryType === "TECHNOLOGY_WEBSITE"
          ? input.websiteType?.trim() || label
          : label,
      estimatedQuantity: input.estimatedBudget?.trim() || "N/A",
      quantityUnit: "TBD" as const,
      projectDescription: input.projectDescription,
      expectedTimeline: input.expectedTimeline,
      estimatedBudget: input.estimatedBudget,
      technologyDetailsJson: buildTechnologyDetails(input),
      sourcePage: input.sourcePage,
    };
  }

  return {
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
    packagingCategories: input.packagingCategories?.length
      ? input.packagingCategories.join(", ")
      : undefined,
    deliveryDestination: input.deliveryDestination,
    componentReference: input.componentReference,
    matchingRequirements: input.matchingRequirements,
    material: input.material,
    colourFinish: input.colourFinish,
    capacitySize: input.capacitySize,
    lineItemsJson: input.lineItems?.length
      ? JSON.stringify(input.lineItems)
      : undefined,
    sourcePage: input.sourcePage,
  };
}

export async function createBusinessInquiry(
  input: InquiryInput | TechnologyInquiryInput,
  meta: { ip?: string; userAgent?: string },
): Promise<CreateInquiryResult> {
  const reference = generateInquiryReference();
  const ipHash = meta.ip ? hashIp(meta.ip) : undefined;
  const email = input.email.toLowerCase();

  const recent = await prisma.businessInquiry.findFirst({
    where: {
      email,
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
    const data = toCreateData(input);
    inquiry = await prisma.businessInquiry.create({
      data: {
        reference,
        ...data,
        userAgent: meta.userAgent?.slice(0, 300),
        ipHash,
        notificationStatus: NotificationStatus.PENDING,
        erpSyncStatus: ErpSyncStatus.NOT_CONNECTED,
        activities: {
          create: {
            action: "CREATED",
            detail: isTechnologyInput(input)
              ? `Technology inquiry received (${technologyTypeLabels[input.inquiryType]})`
              : "Inquiry received via website",
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
      // Inquiry already saved
    }
  }

  const refreshed = await prisma.businessInquiry.findUnique({
    where: { id: inquiry.id },
  });

  return { ok: true, inquiry: refreshed ?? inquiry };
}
