/**
 * SMTP presence check without printing secret values.
 * Expects real env from `vercel env run`.
 */
function set(v) {
  return Boolean(v && String(v).trim() && v !== "[SENSITIVE]");
}

const out = {
  COMPANY_EMAIL_IS_INFO: process.env.COMPANY_EMAIL?.trim() === "info@adeptfragrances.com",
  SALES_EMAIL_IS_INFO: process.env.SALES_EMAIL?.trim() === "info@adeptfragrances.com",
  SMTP_FROM_IS_INFO: process.env.SMTP_FROM?.trim() === "info@adeptfragrances.com",
  SMTP_HOST_SET: set(process.env.SMTP_HOST),
  SMTP_USER_SET: set(process.env.SMTP_USER),
  SMTP_PASS_SET: set(process.env.SMTP_PASS),
  SMTP_PORT: process.env.SMTP_PORT || "(default)",
  SMTP_SECURE: process.env.SMTP_SECURE || "(default)",
  SMTP_CONFIGURED:
    set(process.env.SMTP_HOST) &&
    set(process.env.SMTP_USER) &&
    set(process.env.SMTP_PASS),
  DB_SOURCE_KEY: [
    "DATABASE_URL",
    "DATABASE_URL_PRISMA_DATABASE_URL",
    "DATABASE_URL_DATABASE_URL",
    "DATABASE_URL_POSTGRES_URL",
  ].find((k) => set(process.env[k])) || null,
};

try {
  const url =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_PRISMA_DATABASE_URL ||
    process.env.DATABASE_URL_DATABASE_URL ||
    process.env.DATABASE_URL_POSTGRES_URL;
  if (url && set(url)) {
    const u = new URL(url);
    out.DB_HOST = u.host;
    out.DB_NAME = u.pathname.replace(/^\//, "") || "(default)";
  }
} catch {
  out.DB_HOST = "unparseable";
}

console.log(JSON.stringify(out, null, 2));
