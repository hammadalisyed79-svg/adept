import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl(): string | undefined {
  const candidates = [
    "DATABASE_URL",
    "DATABASE_URL_PRISMA_DATABASE_URL",
    "DATABASE_URL_DATABASE_URL",
    "DATABASE_URL_POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "PRISMA_DATABASE_URL",
  ];
  for (const key of candidates) {
    const value = process.env[key];
    if (value && value.trim().length > 0 && value !== "[SENSITIVE]") {
      return value.trim();
    }
  }
  return undefined;
}

const databaseUrl = resolveDatabaseUrl();
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
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
