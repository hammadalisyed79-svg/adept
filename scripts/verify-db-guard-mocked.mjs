/**
 * Safe mocked rejection demo — does not connect to any database.
 */
import {
  PRODUCTION_STORE,
  resolveDatabaseUrlForMode,
} from "./lib/db-target-guard.mjs";

const PRODUCTION_MOCK = `postgresql://user_${PRODUCTION_STORE.userSuffixes[0]}:mock@db.prisma.io:5432/postgres`;
const LOCAL_MOCK = "postgresql://adept:local@127.0.0.1:5433/adept_website";

const cases = [
  {
    name: "local_rejects_production_url",
    mode: "local",
    env: { DATABASE_URL: PRODUCTION_MOCK },
  },
  {
    name: "local_rejects_production_fallback",
    mode: "local",
    env: { DATABASE_URL_PRISMA_DATABASE_URL: PRODUCTION_MOCK },
  },
  {
    name: "staging_rejects_production",
    mode: "staging",
    env: { DATABASE_URL: PRODUCTION_MOCK },
  },
  {
    name: "local_accepts_localhost",
    mode: "local",
    env: { DATABASE_URL: LOCAL_MOCK },
  },
  {
    name: "production_migrate_unauthorized",
    mode: "production_migrate",
    env: { DATABASE_URL: PRODUCTION_MOCK },
  },
];

const results = cases.map((c) => {
  const r = resolveDatabaseUrlForMode(c.mode, c.env);
  return {
    name: c.name,
    ok: r.ok,
    errorPrefix: r.ok ? null : String(r.error).slice(0, 40),
    refusedProduction: !r.ok && String(r.error).includes("PRODUCTION"),
  };
});

const expectedRefuse = results.filter((r) =>
  [
    "local_rejects_production_url",
    "local_rejects_production_fallback",
    "staging_rejects_production",
    "production_migrate_unauthorized",
  ].includes(r.name),
);
const allRefused = expectedRefuse.every((r) => r.refusedProduction);
const localOk = results.find((r) => r.name === "local_accepts_localhost")?.ok;

console.log(
  JSON.stringify(
    {
      ok: allRefused && localOk,
      results,
    },
    null,
    2,
  ),
);
process.exit(allRefused && localOk ? 0 : 1);
