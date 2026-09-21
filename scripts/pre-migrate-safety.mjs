/**
 * Pre-migrate safety check — logs host + inquiry reference list (no PII emails).
 * Intended to run on Vercel only when RUN_DB_MIGRATE=true.
 */
import { PrismaClient } from "@prisma/client";

const url =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_PRISMA_DATABASE_URL ||
  process.env.DATABASE_URL_DATABASE_URL ||
  process.env.DATABASE_URL_POSTGRES_URL;

if (!url || url === "[SENSITIVE]") {
  console.error("[pre-migrate] No database URL available");
  process.exit(1);
}

process.env.DATABASE_URL = url;

let host = "unknown";
try {
  host = new URL(url).host;
} catch {
  host = "unparseable";
}

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
        dbHost: host,
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
