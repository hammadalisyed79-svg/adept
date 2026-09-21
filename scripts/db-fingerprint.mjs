/**
 * Compare Preview vs Production DB fingerprints without printing connection strings.
 * Usage (cmd): npx vercel env run -e preview -- node scripts/db-fingerprint.mjs preview
 *              npx vercel env run -e production -- node scripts/db-fingerprint.mjs production
 * Or with both env files: node scripts/db-fingerprint.mjs --files .env.preview .env.production
 */
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

function resolveUrl(env) {
  const keys = [
    "DATABASE_URL",
    "DATABASE_URL_PRISMA_DATABASE_URL",
    "DATABASE_URL_DATABASE_URL",
    "DATABASE_URL_POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "PRISMA_DATABASE_URL",
  ];
  for (const key of keys) {
    const v = env[key];
    if (v && v.trim() && v !== "[SENSITIVE]") {
      return { key, url: v.trim() };
    }
  }
  return null;
}

function fingerprint(url) {
  let host = "unknown";
  let pathname = "";
  let port = "";
  try {
    const u = new URL(url);
    host = u.host;
    pathname = u.pathname;
    port = u.port || (u.protocol === "postgresql:" ? "5432" : "");
  } catch {
    host = "unparseable";
  }
  const material = `${host}|${pathname}|${port}`;
  const hash = createHash("sha256").update(material).digest("hex").slice(0, 16);
  return { host, pathname, hash };
}

function loadFile(path) {
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

const label = process.argv[2] || "current";
let env = process.env;

if (process.argv[2] === "--files") {
  const a = loadFile(process.argv[3]);
  const b = loadFile(process.argv[4]);
  const ra = resolveUrl(a);
  const rb = resolveUrl(b);
  const fa = ra ? fingerprint(ra.url) : null;
  const fb = rb ? fingerprint(rb.url) : null;
  console.log(
    JSON.stringify(
      {
        fileA: process.argv[3],
        fileB: process.argv[4],
        a: fa
          ? { sourceKey: ra.key, host: fa.host, dbPath: fa.pathname, fingerprint: fa.hash }
          : { missing: true },
        b: fb
          ? { sourceKey: rb.key, host: fb.host, dbPath: fb.pathname, fingerprint: fb.hash }
          : { missing: true },
        sameDatabase: Boolean(fa && fb && fa.hash === fb.hash),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const resolved = resolveUrl(env);
if (!resolved) {
  console.log(JSON.stringify({ label, missing: true }, null, 2));
  process.exit(0);
}
const fp = fingerprint(resolved.url);
console.log(
  JSON.stringify(
    {
      label,
      sourceKey: resolved.key,
      host: fp.host,
      dbPath: fp.pathname,
      fingerprint: fp.hash,
    },
    null,
    2,
  ),
);
