import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  assertOrExit,
  inferDbOperationMode,
  isProductionMigrateAuthorized,
  resolveDatabaseUrlForMode,
  summarizeUrlIdentity,
} from "./lib/db-target-guard.mjs";

/** Load local .env into process.env when keys are unset (Prisma CLI does this; this script must too). */
function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
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
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const mode = inferDbOperationMode();
const resolved = resolveDatabaseUrlForMode(mode);
assertOrExit(resolved);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);

// Migrations are NOT part of normal builds.
// RUN_DB_MIGRATE=true is for authorized staging (or separately authorized Production) only.
if (process.env.RUN_DB_MIGRATE === "true") {
  const migrateIdentity = summarizeUrlIdentity(process.env.DATABASE_URL);
  if (migrateIdentity.isKnownProduction && !isProductionMigrateAuthorized()) {
    console.error(
      JSON.stringify({
        ok: false,
        error:
          "REFUSED_PRODUCTION_MIGRATE — RUN_DB_MIGRATE cannot target Production without ADEPT_ALLOW_PRODUCTION_MIGRATE=1 and ADEPT_PRODUCTION_MIGRATE_CONFIRM=prisma-postgres-purple-drum",
      }),
    );
    process.exit(2);
  }
  console.log(
    "[db] RUN_DB_MIGRATE=true — pre-migrate safety snapshot, then prisma migrate deploy.",
  );
  run("node", ["scripts/pre-migrate-safety.mjs"]);
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log(
    "[db] Skipping migrate during build (set RUN_DB_MIGRATE=true only for authorized migrate).",
  );
}

run("npx", ["next", "build"]);
