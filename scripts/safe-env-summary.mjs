/**
 * Summarize pulled Vercel env without printing secrets.
 * Usage: node scripts/safe-env-summary.mjs <path-to-env-file>
 */
import { readFileSync, existsSync } from "node:fs";

const path = process.argv[2];
if (!path || !existsSync(path)) {
  console.log(JSON.stringify({ error: "missing_file", path }));
  process.exit(1);
}

const text = readFileSync(path, "utf8");
const env = {};
for (const line of text.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq <= 0) continue;
  let v = t.slice(eq + 1).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  env[t.slice(0, eq).trim()] = v;
}

function summarize(key, { showHost = false, showEmail = false } = {}) {
  const v = env[key];
  const out = {
    present: key in env,
    empty: !v || !String(v).trim(),
    len: v ? String(v).length : 0,
  };
  if (showHost && v) {
    try {
      out.hostname = new URL(v).hostname;
      out.pathname = new URL(v).pathname;
    } catch {
      out.value_safe = v.includes("@") ? "[redacted-url]" : v;
    }
  }
  if (showEmail && v) out.value = v;
  if (key === "SMTP_HOST" && v) out.host = v;
  if (key === "SMTP_PORT" && v) out.port = v;
  if (key === "SMTP_SECURE" && v) out.secure = v;
  return out;
}

const result = {
  SMTP_HOST: summarize("SMTP_HOST"),
  SMTP_PORT: summarize("SMTP_PORT"),
  SMTP_SECURE: summarize("SMTP_SECURE"),
  SMTP_USER: summarize("SMTP_USER"),
  SMTP_PASS: summarize("SMTP_PASS"),
  SMTP_FROM: summarize("SMTP_FROM", { showEmail: true }),
  COMPANY_EMAIL: summarize("COMPANY_EMAIL", { showEmail: true }),
  SALES_EMAIL: summarize("SALES_EMAIL", { showEmail: true }),
  DATABASE_URL: summarize("DATABASE_URL", { showHost: true }),
  DATABASE_URL_DATABASE_URL: summarize("DATABASE_URL_DATABASE_URL", {
    showHost: true,
  }),
  DATABASE_URL_PRISMA_DATABASE_URL: summarize(
    "DATABASE_URL_PRISMA_DATABASE_URL",
    { showHost: true },
  ),
  DATABASE_URL_POSTGRES_URL: summarize("DATABASE_URL_POSTGRES_URL", {
    showHost: true,
  }),
};

result.SMTP_CONFIGURED =
  !result.SMTP_HOST.empty &&
  !result.SMTP_USER.empty &&
  !result.SMTP_PASS.empty;

console.log(JSON.stringify(result, null, 2));
