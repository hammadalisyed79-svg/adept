/**
 * Run prisma migrate deploy against DATABASE_URL from an env file only.
 * Usage: node scripts/migrate-from-env-file.mjs .env.vercel.preview
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const path = process.argv[2];
if (!path || !existsSync(path)) {
  console.error("missing env file");
  process.exit(1);
}

let url = "";
for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
  if (line.startsWith("DATABASE_URL=")) {
    url = line
      .slice("DATABASE_URL=".length)
      .trim()
      .replace(/^"|"$/g, "")
      .replace(/^'|'$/g, "");
    break;
  }
}
if (!url || url === "[SENSITIVE]") {
  console.error("NO_STAGING_URL");
  process.exit(1);
}

const u = new URL(url);
console.log(
  JSON.stringify({
    migrateTargetHost: u.hostname,
    userSuffix: u.username.slice(-6),
  }),
);

const env = {
  ...process.env,
  DATABASE_URL: url,
  DATABASE_URL_DATABASE_URL: "",
  DATABASE_URL_PRISMA_DATABASE_URL: "",
  DATABASE_URL_POSTGRES_URL: "",
  PRISMA_DATABASE_URL: "",
  POSTGRES_URL: "",
};

const r = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  env,
  encoding: "utf8",
  shell: true,
});
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status ?? 1);
