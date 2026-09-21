-- AlterEnum
ALTER TYPE "InquiryType" ADD VALUE 'PACKAGING_COMPONENTS';

-- AlterTable
ALTER TABLE "BusinessInquiry" ADD COLUMN IF NOT EXISTS "packagingCategories" TEXT,
ADD COLUMN IF NOT EXISTS "deliveryDestination" TEXT,
ADD COLUMN IF NOT EXISTS "componentReference" TEXT,
ADD COLUMN IF NOT EXISTS "matchingRequirements" TEXT,
ADD COLUMN IF NOT EXISTS "material" TEXT,
ADD COLUMN IF NOT EXISTS "colourFinish" TEXT,
ADD COLUMN IF NOT EXISTS "capacitySize" TEXT,
ADD COLUMN IF NOT EXISTS "lineItemsJson" TEXT;
