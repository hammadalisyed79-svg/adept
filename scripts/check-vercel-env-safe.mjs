/** Prints only safe email/SMTP presence checks — never prints secret values. */
function nonempty(v) {
  return Boolean(v && String(v).trim() && v !== "[SENSITIVE]");
}

const company = process.env.COMPANY_EMAIL?.trim() || "";
const sales = process.env.SALES_EMAIL?.trim() || "";
const from = process.env.SMTP_FROM?.trim() || "";
const host = process.env.SMTP_HOST?.trim() || "";
const user = process.env.SMTP_USER?.trim() || "";
const pass = process.env.SMTP_PASS?.trim() || "";
const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
const db =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_PRISMA_DATABASE_URL ||
  process.env.DATABASE_URL_DATABASE_URL ||
  process.env.DATABASE_URL_POSTGRES_URL ||
  "";

let dbHost = "empty";
try {
  if (nonempty(db)) dbHost = new URL(db).host;
} catch {
  dbHost = "unparseable";
}

const report = {
  COMPANY_EMAIL_IS_INFO: company === "info@adeptfragrances.com",
  SALES_EMAIL_IS_INFO: sales === "info@adeptfragrances.com",
  COMPANY_EMAIL_SET: nonempty(company),
  SALES_EMAIL_SET: nonempty(sales),
  SMTP_FROM_IS_INFO: from === "info@adeptfragrances.com",
  SMTP_FROM_SET: nonempty(from),
  SMTP_HOST_SET: nonempty(host),
  SMTP_USER_SET: nonempty(user),
  SMTP_PASS_SET: nonempty(pass),
  SMTP_CONFIGURED: nonempty(host) && nonempty(user) && nonempty(pass),
  NEXT_PUBLIC_SITE_URL_SET: nonempty(site),
  DB_HOST: dbHost,
  PREVIEW_AND_NOTE:
    "Values themselves are not printed. Update env if *_IS_INFO is false.",
};

console.log(JSON.stringify(report, null, 2));
