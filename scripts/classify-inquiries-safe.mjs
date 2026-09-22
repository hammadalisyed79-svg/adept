/**
 * Read-only inquiry classification for production safety.
 * Prints counts and reference prefixes only — no emails, names, phones.
 *
 * Heuristics for TEST/STAGING (not exposed as PII):
 * - email domain example.com / test patterns in company/source
 * - contactName / companyName matching known smoke strings
 * - sourcePage automation markers
 */
import { PrismaClient } from "@prisma/client";

const url =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_PRISMA_DATABASE_URL ||
  process.env.DATABASE_URL_DATABASE_URL ||
  process.env.DATABASE_URL_POSTGRES_URL;

if (!url || url === "[SENSITIVE]") {
  console.error(JSON.stringify({ error: "NO_DATABASE_URL" }));
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

const TEST_NAME_RE =
  /^(staging smoke|infra audit|playwright|integration tester|packaging buyer)$/i;
const TEST_COMPANY_RE =
  /^(adept staging|adept audit|playwright|test brand|packaging brands)/i;
const TEST_EMAIL_RE =
  /@(example\.com|test\.com)$/i;
const TEST_EMAIL_LOCAL_RE =
  /^(pw-|staging-|infra-audit-|integration-|dup-|blocked-mail-|fail-mail-|packaging-|fragrance-after-|pw-pack-|staging-smoke-)/i;

function classify(row) {
  const email = (row.email || "").toLowerCase();
  const contact = (row.contactName || "").trim();
  const company = (row.companyName || "").trim();
  const source = (row.sourcePage || "").toLowerCase();
  const desc = (row.projectDescription || "").toLowerCase();

  const reasons = [];
  if (TEST_EMAIL_RE.test(email) || TEST_EMAIL_LOCAL_RE.test(email.split("@")[0] || "")) {
    reasons.push("test_email_pattern");
  }
  if (TEST_NAME_RE.test(contact)) reasons.push("test_contact_name");
  if (TEST_COMPANY_RE.test(company)) reasons.push("test_company_name");
  if (
    /staging|playwright|end-to-end test|infrastructure audit|consolidated staging|integration test/i.test(
      desc,
    )
  ) {
    reasons.push("test_description");
  }
  if (source.includes("vitest") || /user-agent.*vitest/i.test(row.userAgent || "")) {
    reasons.push("test_ua");
  }

  return reasons.length > 0
    ? { kind: "TEST_OR_STAGING", reasons }
    : { kind: "POTENTIALLY_GENUINE", reasons: [] };
}

async function main() {
  const rows = await prisma.businessInquiry.findMany({
    select: {
      reference: true,
      inquiryType: true,
      status: true,
      notificationStatus: true,
      erpSyncStatus: true,
      createdAt: true,
      email: true,
      contactName: true,
      companyName: true,
      sourcePage: true,
      projectDescription: true,
      userAgent: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const summary = {
    dbHost: host,
    total: rows.length,
    testOrStaging: 0,
    potentiallyGenuine: 0,
    byNotification: {},
    byType: {},
    genuine: [],
    testSampleReferences: [],
  };

  for (const row of rows) {
    const c = classify(row);
    summary.byNotification[row.notificationStatus] =
      (summary.byNotification[row.notificationStatus] || 0) + 1;
    summary.byType[row.inquiryType] = (summary.byType[row.inquiryType] || 0) + 1;

    if (c.kind === "TEST_OR_STAGING") {
      summary.testOrStaging += 1;
      if (summary.testSampleReferences.length < 8) {
        summary.testSampleReferences.push(row.reference);
      }
    } else {
      summary.potentiallyGenuine += 1;
      summary.genuine.push({
        reference: row.reference,
        inquiryType: row.inquiryType,
        status: row.status,
        notificationStatus: row.notificationStatus,
        erpSyncStatus: row.erpSyncStatus,
        createdAt: row.createdAt,
        // follow-up flag only — no PII
        needsFollowUp:
          row.notificationStatus === "SKIPPED" ||
          row.notificationStatus === "FAILED" ||
          row.notificationStatus === "PENDING" ||
          row.status === "NEW",
      });
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((e) => {
    console.error(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
