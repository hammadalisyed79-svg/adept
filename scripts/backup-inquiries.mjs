/**
 * Backup BusinessInquiry (+ related) rows to JSON before schema changes.
 * Usage: node scripts/backup-inquiries.mjs [output-path]
 * Requires DATABASE_URL (or resolved Neon/Vercel aliases) — never commit the backup if it contains PII.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const text = require("fs").readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv();

const candidates = [
  "DATABASE_URL",
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
];
for (const key of candidates) {
  const value = process.env[key];
  if (value && value.trim() && value !== "[SENSITIVE]") {
    process.env.DATABASE_URL = value.trim();
    console.log(`[backup] Using ${key}`);
    break;
  }
}

if (!process.env.DATABASE_URL) {
  console.error("[backup] No DATABASE_URL resolved");
  process.exit(1);
}

// Ensure client is generated
spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out =
  process.argv[2] ||
  resolve(process.cwd(), "backups", `inquiries-backup-${stamp}.json`);

async function main() {
  const inquiries = await prisma.businessInquiry.findMany({
    include: { activities: true, notifications: true },
    orderBy: { createdAt: "asc" },
  });
  mkdirSync(dirname(out), { recursive: true });
  const payload = {
    createdAt: new Date().toISOString(),
    count: inquiries.length,
    hostHint: (() => {
      try {
        return new URL(process.env.DATABASE_URL).host;
      } catch {
        return "unknown";
      }
    })(),
    inquiries,
  };
  writeFileSync(out, JSON.stringify(payload, null, 2), "utf8");
  console.log(`[backup] Wrote ${inquiries.length} inquiries to ${out}`);
  console.log("[backup] Do not commit this file if it contains customer PII.");
}

main()
  .catch((err) => {
    console.error("[backup] Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
