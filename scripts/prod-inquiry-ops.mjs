/**
 * Production inquiry ops — metadata only (no PII).
 * Requires DATABASE_URL (or alias) pointing at the LIVE shared Production DB.
 * Refuses to run if host looks like localhost.
 */
import { PrismaClient } from "@prisma/client";

const url =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_PRISMA_DATABASE_URL ||
  process.env.DATABASE_URL_DATABASE_URL ||
  process.env.DATABASE_URL_POSTGRES_URL;

function die(msg) {
  console.log(JSON.stringify({ access: "BLOCKED", reason: msg }, null, 2));
  process.exit(2);
}

if (!url || !String(url).trim() || url === "[SENSITIVE]") {
  die("NO_DATABASE_URL — Production secret not available in this environment");
}

let host = "";
try {
  host = new URL(url).host;
} catch {
  die("UNPARSEABLE_DATABASE_URL");
}

if (/^(localhost|127\.0\.0\.1)(:|$)/i.test(host)) {
  die(
    "LOCALHOST_REFUSED — refusing to report local DB as Production. Provide Production DATABASE_URL.",
  );
}

process.env.DATABASE_URL = url;
const prisma = new PrismaClient();

const TEST_EMAIL_RE = /@(example\.com|test\.com)$/i;
const TEST_EMAIL_LOCAL_RE =
  /^(pw-|staging-|infra-audit-|integration-|dup-|blocked-mail-|fail-mail-|packaging-|fragrance-after-|pw-pack-|staging-smoke-|staging-verifier)/i;
const TEST_NAME_RE =
  /^(staging smoke|infra audit|playwright|integration tester|packaging buyer)$/i;
const TEST_COMPANY_RE =
  /^(adept staging|adept audit|playwright|test brand|packaging brands)/i;

function classify(row) {
  const email = (row.email || "").toLowerCase();
  const local = email.split("@")[0] || "";
  const contact = (row.contactName || "").trim();
  const company = (row.companyName || "").trim();
  const desc = (row.projectDescription || "").toLowerCase();
  const reasons = [];

  if (TEST_EMAIL_RE.test(email) || TEST_EMAIL_LOCAL_RE.test(local)) {
    reasons.push("test_email_pattern");
  }
  if (TEST_NAME_RE.test(contact)) reasons.push("test_contact_name");
  if (TEST_COMPANY_RE.test(company)) reasons.push("test_company_name");
  if (
    /staging|playwright|end-to-end test|infrastructure audit|consolidated staging|integration test|vitest/i.test(
      desc,
    )
  ) {
    reasons.push("test_description");
  }
  // Positive evidence only — SKIPPED alone is NOT test
  return reasons;
}

async function main() {
  const rows = await prisma.businessInquiry.findMany({
    select: {
      reference: true,
      inquiryType: true,
      status: true,
      notificationStatus: true,
      createdAt: true,
      email: true,
      contactName: true,
      companyName: true,
      projectDescription: true,
      sourcePage: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const knownTest = [];
  const needsHumanReview = [];

  for (const row of rows) {
    const reasons = classify(row);
    const meta = {
      reference: row.reference,
      inquiryType: row.inquiryType,
      status: row.status,
      notificationStatus: row.notificationStatus,
      createdAt: row.createdAt,
    };
    if (reasons.length > 0) {
      knownTest.push({ ...meta, evidence: reasons });
    } else {
      needsHumanReview.push(meta);
    }
  }

  console.log(
    JSON.stringify(
      {
        access: "OK",
        dbHost: host,
        total: rows.length,
        knownTestCount: knownTest.length,
        needsHumanReviewCount: needsHumanReview.length,
        byNotification: rows.reduce((acc, r) => {
          acc[r.notificationStatus] = (acc[r.notificationStatus] || 0) + 1;
          return acc;
        }, {}),
        byType: rows.reduce((acc, r) => {
          acc[r.inquiryType] = (acc[r.inquiryType] || 0) + 1;
          return acc;
        }, {}),
        needsHumanReview,
        knownTestReferences: knownTest.map((t) => t.reference),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.log(
      JSON.stringify({
        access: "BLOCKED",
        reason: e instanceof Error ? e.message : String(e),
      }),
    );
    process.exit(2);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
