import { readFileSync, existsSync } from "node:fs";

function load(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
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
  return env;
}

function status(v) {
  if (!v || !String(v).trim()) return "EMPTY";
  if (v === "[SENSITIVE]") return "PLACEHOLDER";
  return `SET_LEN_${String(v).trim().length}`;
}

const keys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "COMPANY_EMAIL",
  "SALES_EMAIL",
];

const file = load(".env");
const out = { source: ".env" };
for (const k of keys) {
  const v = file[k];
  out[k] = status(v);
  if (k === "SMTP_HOST" && v && v !== "[SENSITIVE]") {
    out.SMTP_HOST_VALUE_SAFE = v; // hostname only is OK to show
  }
  if (
    (k === "SMTP_FROM" || k === "COMPANY_EMAIL" || k === "SALES_EMAIL") &&
    v &&
    v !== "[SENSITIVE]"
  ) {
    out[`${k}_VALUE`] = v;
  }
  if (k === "SMTP_PORT" && v) out.SMTP_PORT_VALUE = v;
  if (k === "SMTP_SECURE" && v) out.SMTP_SECURE_VALUE = v;
}

out.SMTP_CONFIGURED =
  status(file.SMTP_HOST).startsWith("SET") &&
  status(file.SMTP_USER).startsWith("SET") &&
  status(file.SMTP_PASS).startsWith("SET");

out.EMAILS_ARE_INFO =
  file.COMPANY_EMAIL === "info@adeptfragrances.com" &&
  file.SALES_EMAIL === "info@adeptfragrances.com";

out.FROM_IS_INFO =
  !file.SMTP_FROM || file.SMTP_FROM === "info@adeptfragrances.com";

console.log(JSON.stringify(out, null, 2));
