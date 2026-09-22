/**
 * Load hosted Prisma URL from .env (not localhost DATABASE_URL) and run prod ops.
 * Does not print secrets.
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

function loadEnvFile(path) {
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

const fileEnv = loadEnvFile(".env");
const candidates = [
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
  "DATABASE_URL",
];

let chosen = null;
let url = null;
for (const k of candidates) {
  const v = fileEnv[k];
  if (!v || v === "[SENSITIVE]") continue;
  let host = "";
  try {
    host = new URL(v).host;
  } catch {
    continue;
  }
  if (/^(localhost|127\.0\.0\.1)/i.test(host)) continue;
  chosen = k;
  url = v;
  break;
}

if (!url) {
  console.log(
    JSON.stringify({
      access: "BLOCKED",
      reason: "No non-localhost DATABASE_* found in .env",
    }),
  );
  process.exit(2);
}

console.log(`[ops] Using ${chosen} host=${new URL(url).host}`);

const env = { ...process.env, DATABASE_URL: url };
// Prevent accidental preference of local URL from parent env
delete env.DATABASE_URL_PRISMA_DATABASE_URL;
delete env.DATABASE_URL_DATABASE_URL;
delete env.DATABASE_URL_POSTGRES_URL;

const r = spawnSync(process.execPath, ["scripts/prod-inquiry-ops.mjs"], {
  env,
  encoding: "utf8",
  shell: false,
});
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status ?? 1);
