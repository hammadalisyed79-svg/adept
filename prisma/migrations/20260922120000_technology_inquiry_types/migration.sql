-- Additive Technology & Growth inquiry types and fields.
-- No drops, renames, or data mutation.

ALTER TYPE "InquiryType" ADD VALUE 'TECHNOLOGY_ERP';
ALTER TYPE "InquiryType" ADD VALUE 'TECHNOLOGY_WEBSITE';
ALTER TYPE "InquiryType" ADD VALUE 'TECHNOLOGY_MARKETING';

ALTER TABLE "BusinessInquiry" ADD COLUMN "estimatedBudget" TEXT;
ALTER TABLE "BusinessInquiry" ADD COLUMN "technologyDetailsJson" TEXT;
