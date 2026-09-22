/**
 * Fail-closed DB target guard for Node scripts (mirrors src/lib/db-target-guard.ts).
 * Never logs credentials or full connection strings.
 */

export const PRODUCTION_STORE = {
  name: "prisma-postgres-purple-drum",
  id: "store_KtXMAUbnv6UZNedj",
  userSuffixes: ["673b6b"],
};

export const STAGING_STORE = {
  name: "adept-staging-postgres",
  id: "store_damIXxKrVMmE3tpT",
  userSuffixes: ["4efe06"],
};

const PLAIN_CANDIDATES = ["DATABASE_URL"];
const HOSTED_CANDIDATES = [
  "DATABASE_URL",
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "PRISMA_DATABASE_URL",
];
const PREFIXED_FALLBACKS = [
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
];

export function summarizeUrlIdentity(url) {
  const u = new URL(url);
  const userSuffix = u.username ? u.username.slice(-6) : null;
  const isLocalhost = u.hostname === "127.0.0.1" || u.hostname === "localhost";
  return {
    host: u.hostname,
    dbName: u.pathname.replace(/^\//, "").split("?")[0] || "",
    userSuffix,
    isLocalhost,
    isKnownProduction: Boolean(
      userSuffix && PRODUCTION_STORE.userSuffixes.includes(userSuffix),
    ),
    isKnownStaging: Boolean(
      userSuffix && STAGING_STORE.userSuffixes.includes(userSuffix),
    ),
  };
}

export function isProductionMigrateAuthorized(env = process.env) {
  return (
    env.ADEPT_ALLOW_PRODUCTION_MIGRATE === "1" &&
    env.ADEPT_PRODUCTION_MIGRATE_CONFIRM === PRODUCTION_STORE.name
  );
}

export function isProductionReadAuthorized(env = process.env) {
  return env.ADEPT_ALLOW_PRODUCTION_DB === "1";
}

export function inferDbOperationMode(env = process.env) {
  if (env.ADEPT_DB_TARGET === "production_migrate") return "production_migrate";
  if (env.ADEPT_DB_TARGET === "production_read") return "production_read";
  if (env.ADEPT_DB_TARGET === "staging") return "staging";
  if (env.ADEPT_DB_TARGET === "local") return "local";
  if (env.VERCEL_ENV === "production") return "hosted_production";
  if (env.VERCEL_ENV === "preview") return "hosted_preview";
  return "local";
}

export function candidateKeysForMode(mode) {
  switch (mode) {
    case "hosted_production":
    case "production_read":
    case "production_migrate":
      return HOSTED_CANDIDATES;
    case "hosted_preview":
      return [
        "DATABASE_URL",
        "PRISMA_DATABASE_URL",
        "POSTGRES_URL",
        "POSTGRES_PRISMA_URL",
      ];
    case "staging":
      return ["DATABASE_URL", "PRISMA_DATABASE_URL", "POSTGRES_URL"];
    case "local":
    default:
      return PLAIN_CANDIDATES;
  }
}

function pickFromEnv(env, keys) {
  for (const key of keys) {
    const value = env[key];
    if (value && value.trim().length > 0 && value !== "[SENSITIVE]") {
      return { key, url: value.trim() };
    }
  }
  return null;
}

export function assertIdentityAllowed(mode, identity, env = process.env) {
  if (identity.isKnownProduction) {
    if (mode === "hosted_production") return null;
    if (mode === "production_read" && isProductionReadAuthorized(env)) return null;
    if (mode === "production_migrate" && isProductionMigrateAuthorized(env)) {
      return null;
    }
    return (
      "REFUSED_PRODUCTION_TARGET — resolved database identity matches known Production store " +
      `(${PRODUCTION_STORE.name}). Non-Production operations cannot use this target. ` +
      "Authorized Production migrate requires ADEPT_ALLOW_PRODUCTION_MIGRATE=1 and " +
      `ADEPT_PRODUCTION_MIGRATE_CONFIRM=${PRODUCTION_STORE.name}.`
    );
  }

  if (mode === "local" && !identity.isLocalhost) {
    return (
      "REFUSED_NON_LOCAL_TARGET — local mode requires 127.0.0.1/localhost. " +
      `Got host=${identity.host} suffix=${identity.userSuffix ?? "none"}.`
    );
  }

  if (mode === "staging" || mode === "hosted_preview") {
    if (identity.isLocalhost) {
      if (mode === "staging") {
        return "REFUSED_LOCALHOST_FOR_STAGING — staging mode requires the staging store identity.";
      }
      return null;
    }
    if (!identity.isKnownStaging) {
      return (
        "REFUSED_UNKNOWN_STAGING_TARGET — expected staging store " +
        `${STAGING_STORE.name} (suffix …${STAGING_STORE.userSuffixes[0]}). ` +
        `Got suffix=${identity.userSuffix ?? "none"}.`
      );
    }
  }

  if (mode === "production_migrate" || mode === "production_read") {
    if (!identity.isKnownProduction) {
      return "REFUSED_NON_PRODUCTION_TARGET — production_* mode requires the known Production store identity.";
    }
  }

  if (mode === "hosted_production" && identity.isLocalhost) {
    return "REFUSED_LOCALHOST_ON_HOSTED_PRODUCTION";
  }

  return null;
}

export function resolveDatabaseUrlForMode(mode, env = process.env) {
  const keys = candidateKeysForMode(mode);
  const picked = pickFromEnv(env, keys);

  if (!picked) {
    const prefixed = pickFromEnv(env, PREFIXED_FALLBACKS);
    if (
      prefixed &&
      (mode === "local" || mode === "staging" || mode === "hosted_preview")
    ) {
      let identity;
      try {
        identity = summarizeUrlIdentity(prefixed.url);
      } catch {
        identity = undefined;
      }
      if (identity?.isKnownProduction) {
        return {
          ok: false,
          error:
            "REFUSED_PRODUCTION_FALLBACK — Production-prefixed database aliases are present but must not be selected for local/staging operations.",
          mode,
          key: prefixed.key,
          identity,
        };
      }
    }
    return {
      ok: false,
      error: `NO_DATABASE_URL — no usable URL for mode=${mode}`,
      mode,
    };
  }

  let identity;
  try {
    identity = summarizeUrlIdentity(picked.url);
  } catch {
    return { ok: false, error: "UNPARSEABLE_DATABASE_URL", mode, key: picked.key };
  }

  const refused = assertIdentityAllowed(mode, identity, env);
  if (refused) {
    return { ok: false, error: refused, mode, key: picked.key, identity };
  }

  return { ok: true, key: picked.key, url: picked.url, identity, mode };
}

export function applyResolvedDatabaseUrl(result) {
  process.env.DATABASE_URL = result.url;
}

export function assertOrExit(result) {
  if (!result.ok) {
    console.error(
      JSON.stringify({
        ok: false,
        error: result.error,
        mode: result.mode,
        sourceKey: result.key ?? null,
        identity: result.identity
          ? {
              host: result.identity.host,
              userSuffix: result.identity.userSuffix,
              isKnownProduction: result.identity.isKnownProduction,
              isKnownStaging: result.identity.isKnownStaging,
              isLocalhost: result.identity.isLocalhost,
            }
          : null,
      }),
    );
    process.exit(2);
  }
  console.log(
    JSON.stringify({
      ok: true,
      mode: result.mode,
      sourceKey: result.key,
      identity: {
        host: result.identity.host,
        userSuffix: result.identity.userSuffix,
        isKnownProduction: result.identity.isKnownProduction,
        isKnownStaging: result.identity.isKnownStaging,
        isLocalhost: result.identity.isLocalhost,
      },
    }),
  );
  applyResolvedDatabaseUrl(result);
  return result;
}
