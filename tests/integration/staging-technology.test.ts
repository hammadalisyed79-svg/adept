/**
 * Staging-only technology inquiry tests.
 * Run: node scripts/_tmp-run-staging-tests.mjs
 * (sets DATABASE_URL from .env.vercel.preview after identity gates)
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createBusinessInquiry } from "@/lib/inquiries/create";

const EXPECTED_STAGING_SUFFIX = "4efe06";
const EXPECTED_PROD_SUFFIX = "673b6b";

function loadEnv(path: string) {
  const env: Record<string, string> = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[t.slice(0, eq).trim()] = v;
  }
  return env;
}

function pick(env: Record<string, string>, preferPrefixed: boolean) {
  const prefixed = [
    "DATABASE_URL_PRISMA_DATABASE_URL",
    "DATABASE_URL_DATABASE_URL",
    "DATABASE_URL_POSTGRES_URL",
  ];
  const plain = ["DATABASE_URL", "PRISMA_DATABASE_URL", "POSTGRES_URL"];
  const order = preferPrefixed ? [...prefixed, ...plain] : [...plain, ...prefixed];
  for (const k of order) {
    if (env[k] && env[k] !== "[SENSITIVE]") return { key: k, url: env[k] };
  }
  return null;
}

function suffixOf(url: string) {
  return new URL(url).username.slice(-6);
}

function fingerprint(refs: string[]) {
  return createHash("sha256").update([...refs].sort().join("|")).digest("hex").slice(0, 16);
}

const runStaging = process.env.STAGING_TECH_TESTS === "1";

describe.skipIf(!runStaging)("staging technology inquiries", () => {
  const stagingPrisma = new PrismaClient();
  const stamp = Date.now();
  const created: { label: string; reference: string; inquiryType: string }[] = [];
  let prodBaseline: {
    count: number;
    fingerprint: string;
    references: string[];
  };

  beforeAll(async () => {
    const preview = pick(loadEnv(".env.vercel.preview"), false);
    if (!preview || suffixOf(preview.url) !== EXPECTED_STAGING_SUFFIX) {
      throw new Error("Staging identity gate failed");
    }
    const prod = pick(loadEnv(".env"), true);
    if (!prod || suffixOf(prod.url) !== EXPECTED_PROD_SUFFIX) {
      throw new Error("Production identity gate failed");
    }

    process.env.DATABASE_URL = prod.url;
    const prodClient = new PrismaClient();
    const rows = await prodClient.businessInquiry.findMany({
      select: { reference: true },
      orderBy: { createdAt: "asc" },
    });
    await prodClient.$disconnect();
    prodBaseline = {
      count: rows.length,
      references: rows.map((r) => r.reference),
      fingerprint: fingerprint(rows.map((r) => r.reference)),
    };

    process.env.DATABASE_URL = preview.url;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    await stagingPrisma.$connect();
  });

  afterAll(async () => {
    await stagingPrisma.$disconnect();
  });

  it("persists ERP, Website, and Marketing TEST inquiries", async () => {
    const cases = [
      {
        label: "ERP",
        inquiryType: "TECHNOLOGY_ERP" as const,
        email: `staging-test-erp-${stamp}@example.com`,
        industry: "Personal Care",
        requiredModules: "Inventory, Sales",
        projectDescription:
          "STAGING TEST ONLY — ERP consultation for inventory and sales modules.",
      },
      {
        label: "Website Development",
        inquiryType: "TECHNOLOGY_WEBSITE" as const,
        email: `staging-test-web-${stamp}@example.com`,
        websiteType: "B2B",
        existingWebsiteUrl: "https://example.com",
        projectDescription:
          "STAGING TEST ONLY — Website development for B2B catalogue experience.",
      },
      {
        label: "Digital Marketing",
        inquiryType: "TECHNOLOGY_MARKETING" as const,
        email: `staging-test-mkt-${stamp}@example.com`,
        marketingObjectives: "Lead generation",
        interestedChannels: "LinkedIn",
        projectDescription:
          "STAGING TEST ONLY — Digital marketing requirements discussion.",
      },
    ];

    for (const c of cases) {
      const result = await createBusinessInquiry(
        {
          contactName: "Staging Test User",
          companyName: "ADEPT Staging Test Co",
          email: c.email,
          phone: "+971 50 000 0000",
          country: "United Arab Emirates",
          inquiryType: c.inquiryType,
          projectDescription: c.projectDescription,
          industry: "industry" in c ? c.industry : undefined,
          requiredModules: "requiredModules" in c ? c.requiredModules : undefined,
          websiteType: "websiteType" in c ? c.websiteType : undefined,
          existingWebsiteUrl:
            "existingWebsiteUrl" in c ? c.existingWebsiteUrl : undefined,
          marketingObjectives:
            "marketingObjectives" in c ? c.marketingObjectives : undefined,
          interestedChannels:
            "interestedChannels" in c ? c.interestedChannels : undefined,
          sourcePage: "/technology/request-quote",
          website: "",
        },
        { ip: "203.0.113.90", userAgent: "staging-technology-test" },
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.inquiry.inquiryType).toBe(c.inquiryType);
      expect(result.inquiry.reference).toMatch(/^ADF-\d{8}-[A-F0-9]{6}$/);
      expect(result.inquiry.notificationStatus).toBe("SKIPPED");
      expect(result.inquiry.technologyDetailsJson).toBeTruthy();
      created.push({
        label: c.label,
        reference: result.inquiry.reference,
        inquiryType: result.inquiry.inquiryType,
      });
    }

    expect(created).toHaveLength(3);
    const refs = created.map((c) => c.reference);
    expect(new Set(refs).size).toBe(3);
  });

  it("keeps Production baseline unchanged and free of staging refs", async () => {
    const prod = pick(loadEnv(".env"), true);
    if (!prod) throw new Error("missing prod url");
    process.env.DATABASE_URL = prod.url;
    const prodClient = new PrismaClient();
    const after = await prodClient.businessInquiry.findMany({
      select: { reference: true },
      orderBy: { createdAt: "asc" },
    });
    await prodClient.$disconnect();

    expect(after.length).toBe(prodBaseline.count);
    expect(fingerprint(after.map((r) => r.reference))).toBe(prodBaseline.fingerprint);
    for (const c of created) {
      expect(after.some((r) => r.reference === c.reference)).toBe(false);
    }

    mkdirSync("backups", { recursive: true });
    writeFileSync(
      `backups/staging-tech-tests-${stamp}.json`,
      JSON.stringify(
        {
          stagingTests: created,
          production: prodBaseline,
          productionAfterCount: after.length,
          isolation: "verified",
        },
        null,
        2,
      ),
    );
  });
});
