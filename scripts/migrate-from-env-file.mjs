/**
 * Run prisma migrate deploy against DATABASE_URL from an env file only.
 * Defaults to staging-safe mode. Production migrate requires explicit authorization.
 *
 * Usage:
 *   node scripts/migrate-from-env-file.mjs .env.vercel.preview
 *   ADEPT_DB_TARGET=staging node scripts/migrate-from-env-file.mjs .env.vercel.preview
 *   ADEPT_DB_TARGET=production_migrate ADEPT_ALLOW_PRODUCTION_MIGRATE=1 \
 *     ADEPT_PRODUCTION_MIGRATE_CONFIRM=prisma-postgres-purple-drum \
 *     node scripts/migrate-from-env-file.mjs .env.vercel.production
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import {
  assertOrExit,
  inferDbOperationMode,
  resolveDatabaseUrlForMode,
} from "./lib/db-target-guard.mjs";

const path = process.argv[2];
if (!path || !existsSync(path)) {
  console.error("missing env file");
  process.exit(1);
}

const fileEnv = {};
for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq <= 0) continue;
  let v = t.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  fileEnv[t.slice(0, eq).trim()] = v;
}

// Default migrate-from-env-file to staging unless explicitly overridden.
if (!process.env.ADEPT_DB_TARGET && !process.env.VERCEL_ENV) {
  process.env.ADEPT_DB_TARGET = "staging";
}

const mode = inferDbOperationMode();
const merged = { ...process.env, ...fileEnv };
const resolved = resolveDatabaseUrlForMode(mode, merged);
assertOrExit(resolved);

const env = {
  ...process.env,
  DATABASE_URL: resolved.url,
  DATABASE_URL_DATABASE_URL: "",
  DATABASE_URL_PRISMA_DATABASE_URL: "",
  DATABASE_URL_POSTGRES_URL: "",
  PRISMA_DATABASE_URL: "",
  POSTGRES_URL: "",
};

const r = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  env,
  encoding: "utf8",
  shell: true,
});
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status ?? 1);
