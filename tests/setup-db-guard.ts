/**
 * Vitest setup: ensure tests never resolve to the known Production store.
 * Uses mocked/env identity checks — does not open a Production connection for guards.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll } from "vitest";
import {
  inferDbOperationMode,
  resolveDatabaseUrlForMode,
  summarizeUrlIdentity,
} from "../src/lib/db-target-guard";

function loadPlainDatabaseUrlFromDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("DATABASE_URL=") || trimmed.startsWith("DATABASE_URL_")) {
      continue;
    }
    let value = trimmed.slice("DATABASE_URL=".length).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = value;
    }
    break;
  }
}

beforeAll(() => {
  // Never inherit Production-prefixed aliases into the test process.
  delete process.env.DATABASE_URL_PRISMA_DATABASE_URL;
  delete process.env.DATABASE_URL_DATABASE_URL;
  delete process.env.DATABASE_URL_POSTGRES_URL;

  if (process.env.STAGING_TECH_TESTS === "1") {
    process.env.ADEPT_DB_TARGET = process.env.ADEPT_DB_TARGET || "staging";
  } else {
    process.env.ADEPT_DB_TARGET = "local";
    loadPlainDatabaseUrlFromDotEnv();
  }

  const mode = inferDbOperationMode();

  if (process.env.DATABASE_URL) {
    const identity = summarizeUrlIdentity(process.env.DATABASE_URL);
    if (identity.isKnownProduction) {
      throw new Error(
        `[vitest-db-guard] REFUSED_PRODUCTION_TARGET — tests must not use Production (suffix=${identity.userSuffix}).`,
      );
    }
  }

  const resolved = resolveDatabaseUrlForMode(mode);
  if (!resolved.ok) {
    if (resolved.error.startsWith("REFUSED_")) {
      throw new Error(`[vitest-db-guard] ${resolved.error}`);
    }
    return;
  }

  if (resolved.identity.isKnownProduction) {
    throw new Error("[vitest-db-guard] REFUSED_PRODUCTION_TARGET after resolve");
  }

  process.env.DATABASE_URL = resolved.url;
});
