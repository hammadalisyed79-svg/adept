/**
 * Resolve a usable Postgres URL for Prisma on Vercel.
 * Does not print secret values.
 */
const candidates = [
  "DATABASE_URL",
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "PRISMA_DATABASE_URL",
];

let chosen = null;
for (const key of candidates) {
  const value = process.env[key];
  if (value && value.trim().length > 0 && value !== "[SENSITIVE]") {
    process.env.DATABASE_URL = value.trim();
    chosen = key;
    break;
  }
}

if (!chosen) {
  console.error(
    "[db] No nonempty database URL found. Checked:",
    candidates.join(", "),
  );
  process.exit(1);
}

console.log(`[db] Using connection string from ${chosen}`);
