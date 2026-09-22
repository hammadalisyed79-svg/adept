/**
 * Safe DB identity + inquiry refs. Never prints connection strings.
 * Usage:
 *   node scripts/db-identity-safe.mjs --env-file .env.vercel.preview --label staging
 *   node scripts/db-identity-safe.mjs --env-file .env --label production --prefer-prefixed
 */
import { readFileSync, existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadEnv(path) {
  const env = {};
  if (!existsSync(path)) throw new Error(`missing ${path}`);
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

function pickUrl(env, preferPrefixed) {
  const prefixed = [
    "DATABASE_URL_PRISMA_DATABASE_URL",
    "DATABASE_URL_DATABASE_URL",
    "DATABASE_URL_POSTGRES_URL",
  ];
  const plain = ["DATABASE_URL", "PRISMA_DATABASE_URL", "POSTGRES_URL"];
  const order = preferPrefixed ? [...prefixed, ...plain] : [...plain, ...prefixed];
  for (const k of order) {
    const v = env[k];
    if (v && v.trim() && v !== "[SENSITIVE]") return { key: k, url: v.trim() };
  }
  return null;
}

const args = process.argv.slice(2);
const envFile = args[args.indexOf("--env-file") + 1];
const label = args.includes("--label")
  ? args[args.indexOf("--label") + 1]
  : "db";
const preferPrefixed = args.includes("--prefer-prefixed");

const env = loadEnv(envFile);
const picked = pickUrl(env, preferPrefixed);
if (!picked) {
  console.log(JSON.stringify({ label, error: "no_usable_database_url" }));
  process.exit(1);
}

let hostname = "unknown";
let pathname = "unknown";
try {
  const u = new URL(picked.url);
  hostname = u.hostname;
  pathname = u.pathname;
} catch {
  /* ignore */
}

process.env.DATABASE_URL = picked.url;
const prisma = new PrismaClient();
try {
  const inquiryCount = await prisma.businessInquiry.count().catch((e) => {
    return { error: e.message?.slice(0, 120) };
  });
  let references = [];
  if (typeof inquiryCount === "number") {
    references = (
      await prisma.businessInquiry.findMany({
        select: { reference: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    ).map((r) => r.reference);
  }
  // fingerprint without secrets: hash of user+db from URL parts
  const u = new URL(picked.url);
  const identity = {
    host: u.hostname,
    path: u.pathname,
    user: u.username ? `len_${u.username.length}` : "none",
    // last 6 of password-less identity via search params or username
    userSuffix: u.username ? u.username.slice(-6) : null,
  };
  console.log(
    JSON.stringify(
      {
        label,
        sourceKey: picked.key,
        identity,
        inquiryCount,
        references,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
