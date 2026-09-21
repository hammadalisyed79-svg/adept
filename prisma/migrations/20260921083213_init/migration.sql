-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('FRAGRANCE_TRADING', 'TOLL_MANUFACTURING', 'PRIVATE_LABEL', 'GENERAL');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'SAMPLING', 'QUOTED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'ERP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ErpSyncStatus" AS ENUM ('NOT_CONNECTED', 'PENDING', 'SYNCED', 'FAILED');

-- CreateTable
CREATE TABLE "BusinessInquiry" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "inquiryType" "InquiryType" NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "contactName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "estimatedQuantity" TEXT NOT NULL,
    "quantityUnit" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "targetPrice" TEXT,
    "fragranceDirection" TEXT,
    "requiredConcentration" TEXT,
    "bottleSize" TEXT,
    "packagingRequirements" TEXT,
    "expectedTimeline" TEXT,
    "sampleRequirements" TEXT,
    "sourcePage" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "notificationStatus" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "erpSyncStatus" "ErpSyncStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "erpExternalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryActivity" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "error" TEXT,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInquiry_reference_key" ON "BusinessInquiry"("reference");

-- CreateIndex
CREATE INDEX "BusinessInquiry_status_idx" ON "BusinessInquiry"("status");

-- CreateIndex
CREATE INDEX "BusinessInquiry_inquiryType_idx" ON "BusinessInquiry"("inquiryType");

-- CreateIndex
CREATE INDEX "BusinessInquiry_createdAt_idx" ON "BusinessInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "BusinessInquiry_email_idx" ON "BusinessInquiry"("email");

-- CreateIndex
CREATE INDEX "InquiryActivity_inquiryId_idx" ON "InquiryActivity"("inquiryId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_inquiryId_idx" ON "NotificationDelivery"("inquiryId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_idx" ON "NotificationDelivery"("status");

-- CreateIndex
CREATE INDEX "RateLimitBucket_windowStart_idx" ON "RateLimitBucket"("windowStart");

-- AddForeignKey
ALTER TABLE "InquiryActivity" ADD CONSTRAINT "InquiryActivity_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "BusinessInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "BusinessInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
