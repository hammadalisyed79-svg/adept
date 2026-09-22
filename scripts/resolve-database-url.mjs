/**
 * Resolve a usable Postgres URL for Prisma with fail-closed target guards.
 * Does not print secret values.
 */
import {
  assertOrExit,
  inferDbOperationMode,
  resolveDatabaseUrlForMode,
} from "./lib/db-target-guard.mjs";

const mode = inferDbOperationMode();
const resolved = resolveDatabaseUrlForMode(mode);
assertOrExit(resolved);
