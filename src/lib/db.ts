import { PrismaClient } from "@prisma/client";
import {
  applyResolvedDatabaseUrl,
  inferDbOperationMode,
  resolveDatabaseUrlForMode,
} from "@/lib/db-target-guard";

const mode = inferDbOperationMode();
const resolved = resolveDatabaseUrlForMode(mode);

if (!resolved.ok) {
  // Fail closed for local/preview/staging; hosted production without URL still fails loudly.
  if (
    mode === "local" ||
    mode === "staging" ||
    mode === "hosted_preview" ||
    mode === "production_migrate" ||
    mode === "production_read"
  ) {
    throw new Error(`[db-target-guard] ${resolved.error}`);
  }
  console.error(`[db-target-guard] ${resolved.error}`);
}

const databaseUrl = resolved.ok ? resolved.url : undefined;
if (resolved.ok) {
  applyResolvedDatabaseUrl(resolved);
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
