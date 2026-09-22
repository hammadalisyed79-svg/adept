/**
 * Export BusinessInquiry (+ related) rows to JSON.
 *
 * IMPORTANT: This is an inquiry/metadata SNAPSHOT, not a full PostgreSQL
 * physical backup and not a verified restore point. Do not treat the output
 * as Production disaster-recovery evidence.
 *
 * Usage: node scripts/backup-inquiries.mjs [output-path]
 * Local default: ADEPT_DB_TARGET=local (plain DATABASE_URL only).
 * Production read requires ADEPT_ALLOW_PRODUCTION_DB=1 and ADEPT_DB_TARGET=production_read.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  assertOrExit,
  inferDbOperationMode,
  resolveDatabaseUrlForMode,
} from "./lib/db-target-guard.mjs";

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

const mode = inferDbOperationMode();
const resolved = resolveDatabaseUrlForMode(mode);
assertOrExit(resolved);

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
  resolve(process.cwd(), "backups", `inquiries-snapshot-${stamp}.json`);

async function main() {
  const inquiries = await prisma.businessInquiry.findMany({
    include: { activities: true, notifications: true },
    orderBy: { createdAt: "asc" },
  });
  mkdirSync(dirname(out), { recursive: true });
  const payload = {
    createdAt: new Date().toISOString(),
    backupKind: "inquiry_json_snapshot",
    recoverableFullDatabaseBackup: false,
    count: inquiries.length,
    hostHint: resolved.identity.host,
    userSuffix: resolved.identity.userSuffix,
    mode: resolved.mode,
    inquiries,
  };
  writeFileSync(out, JSON.stringify(payload, null, 2), "utf8");
  console.log(`[backup] Wrote ${inquiries.length} inquiries to ${out}`);
  console.log(
    "[backup] Kind=inquiry_json_snapshot — NOT a verified full-database backup/restore point.",
  );
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
