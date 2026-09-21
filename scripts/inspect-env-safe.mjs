import { readFileSync, existsSync } from "node:fs";

const path = process.argv[2] || ".env.vercel.preview";
if (!existsSync(path)) {
  console.error("Missing", path);
  process.exit(1);
}

const text = readFileSync(path, "utf8");
function get(key) {
  const re = new RegExp(`^${key}=(.*)$`, "m");
  const m = text.match(re);
  if (!m) return "";
  let v = m[1].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v;
}

function status(v) {
  if (!v) return "EMPTY";
  return `SET_LEN_${v.length}`;
}

const company = get("COMPANY_EMAIL");
const sales = get("SALES_EMAIL");
const from = get("SMTP_FROM");
const host = get("SMTP_HOST");
const user = get("SMTP_USER");
const pass = get("SMTP_PASS");
const site = get("NEXT_PUBLIC_SITE_URL");
const db =
  get("DATABASE_URL") ||
  get("DATABASE_URL_PRISMA_DATABASE_URL") ||
  get("DATABASE_URL_DATABASE_URL") ||
  get("DATABASE_URL_POSTGRES_URL");

let dbHost = "none";
try {
  dbHost = new URL(db).host;
} catch {
  dbHost = db ? "unparseable" : "empty";
}

console.log(
  JSON.stringify(
    {
      COMPANY_EMAIL: company || "(empty)",
      SALES_EMAIL: sales || "(empty)",
      SMTP_FROM: from || "(empty)",
      SMTP_HOST_STATUS: status(host),
      SMTP_USER_STATUS: status(user),
      SMTP_PASS_STATUS: status(pass),
      SMTP_CONFIGURED: Boolean(host && user && pass),
      NEXT_PUBLIC_SITE_URL: site || "(empty)",
      DB_HOST: dbHost,
      emails_are_info:
        company === "info@adeptfragrances.com" &&
        sales === "info@adeptfragrances.com",
      smtp_from_is_info: from === "info@adeptfragrances.com" || from === "",
    },
    null,
    2,
  ),
);
