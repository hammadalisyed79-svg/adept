/**
 * Pre-migrate safety check — logs host + inquiry reference list (no PII emails).
 * Fail-closed: Production targets require explicit migrate authorization.
 */
import { PrismaClient } from "@prisma/client";
import {
  assertOrExit,
  inferDbOperationMode,
  resolveDatabaseUrlForMode,
} from "./lib/db-target-guard.mjs";

const mode =
  process.env.ADEPT_DB_TARGET ||
  (process.env.ADEPT_ALLOW_PRODUCTION_MIGRATE === "1"
    ? "production_migrate"
    : process.env.VERCEL_ENV === "production"
      ? "hosted_production"
      : process.env.VERCEL_ENV === "preview"
        ? "hosted_preview"
        : "staging");

if (!process.env.ADEPT_DB_TARGET) {
  process.env.ADEPT_DB_TARGET =
    mode === "hosted_production" ? "production_migrate" : mode === "hosted_preview" ? "staging" : mode;
}

const resolved = resolveDatabaseUrlForMode(inferDbOperationMode());
assertOrExit(resolved);

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.businessInquiry.findMany({
    select: {
      reference: true,
      inquiryType: true,
      createdAt: true,
      notificationStatus: true,
    },
    orderBy: { createdAt: "asc" },
  });
  console.log(
    JSON.stringify(
      {
        phase: "pre-migrate-safety",
        mode: resolved.mode,
        identity: {
          host: resolved.identity.host,
          userSuffix: resolved.identity.userSuffix,
          isKnownProduction: resolved.identity.isKnownProduction,
          isKnownStaging: resolved.identity.isKnownStaging,
        },
        inquiryCount: rows.length,
        references: rows.map((r) => ({
          reference: r.reference,
          inquiryType: r.inquiryType,
          notificationStatus: r.notificationStatus,
          createdAt: r.createdAt,
        })),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error("[pre-migrate] Failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
