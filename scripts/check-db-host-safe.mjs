import { readFileSync, existsSync } from "node:fs";

const files = [".env", ".env.local", ".env.production.local", ".env.vercel.preview"];
const keys = [
  "DATABASE_URL",
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
];

function hostOf(v) {
  if (!v) return "empty";
  if (v === "[SENSITIVE]") return "SENSITIVE_PLACEHOLDER";
  try {
    return new URL(v).host;
  } catch {
    return "unparseable";
  }
}

for (const f of files) {
  if (!existsSync(f)) {
    console.log(`${f}: missing`);
    continue;
  }
  const t = readFileSync(f, "utf8");
  let found = false;
  for (const k of keys) {
    const m = t.match(new RegExp(`^${k}=(.*)$`, "m"));
    if (!m) continue;
    found = true;
    let v = m[1].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    const h = hostOf(v);
    const ok = Boolean(v && v !== "[SENSITIVE]" && !h.includes("SENSITIVE"));
    console.log(`${f}: ${k} host=${h} usable=${ok}`);
  }
  if (!found) console.log(`${f}: no DATABASE_* keys`);
}

for (const k of keys) {
  const v = process.env[k];
  if (!v) continue;
  console.log(`process.env: ${k} host=${hostOf(v)}`);
}
