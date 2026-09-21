import { spawnSync } from "node:child_process";

const candidates = [
  "DATABASE_URL",
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "PRISMA_DATABASE_URL",
];

let chosen = null;
for (const key of candidates) {
  const value = process.env[key];
  if (value && value.trim().length > 0 && value !== "[SENSITIVE]") {
    process.env.DATABASE_URL = value.trim();
    chosen = key;
    break;
  }
}

if (!chosen) {
  console.error(
    "[db] No nonempty database URL found. Checked:",
    candidates.join(", "),
  );
  process.exit(1);
}

console.log(`[db] Using connection string from ${chosen}`);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "build"]);
