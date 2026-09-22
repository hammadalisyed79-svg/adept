/**
 * Fail-closed database target identity guards.
 * Never logs credentials or full connection strings.
 */

export const PRODUCTION_STORE = {
  name: "prisma-postgres-purple-drum",
  id: "store_KtXMAUbnv6UZNedj",
  userSuffixes: ["673b6b"] as const,
} as const;

export const STAGING_STORE = {
  name: "adept-staging-postgres",
  id: "store_damIXxKrVMmE3tpT",
  userSuffixes: ["4efe06"] as const,
} as const;

export type DbOperationMode =
  | "local"
  | "staging"
  | "production_read"
  | "production_migrate"
  | "hosted_production"
  | "hosted_preview";

export type UrlIdentity = {
  host: string;
  dbName: string;
  userSuffix: string | null;
  isLocalhost: boolean;
  isKnownProduction: boolean;
  isKnownStaging: boolean;
};

const PLAIN_CANDIDATES = ["DATABASE_URL"] as const;

const HOSTED_CANDIDATES = [
  "DATABASE_URL",
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "PRISMA_DATABASE_URL",
] as const;

/** Prefixed Vercel pull aliases — never auto-selected for local/staging ops. */
const PREFIXED_FALLBACKS = [
  "DATABASE_URL_PRISMA_DATABASE_URL",
  "DATABASE_URL_DATABASE_URL",
  "DATABASE_URL_POSTGRES_URL",
] as const;

export function summarizeUrlIdentity(url: string): UrlIdentity {
  const u = new URL(url);
  const userSuffix = u.username ? u.username.slice(-6) : null;
  const isLocalhost = u.hostname === "127.0.0.1" || u.hostname === "localhost";
  const isKnownProduction = Boolean(
    userSuffix &&
      (PRODUCTION_STORE.userSuffixes as readonly string[]).includes(userSuffix),
  );
  const isKnownStaging = Boolean(
    userSuffix &&
      (STAGING_STORE.userSuffixes as readonly string[]).includes(userSuffix),
  );
  return {
    host: u.hostname,
    dbName: u.pathname.replace(/^\//, "").split("?")[0] || "",
    userSuffix,
    isLocalhost,
    isKnownProduction,
    isKnownStaging,
  };
}

export type EnvMap = Record<string, string | undefined>;

export function isProductionMigrateAuthorized(env: EnvMap = process.env): boolean {
  return (
    env.ADEPT_ALLOW_PRODUCTION_MIGRATE === "1" &&
    env.ADEPT_PRODUCTION_MIGRATE_CONFIRM === PRODUCTION_STORE.name
  );
}

export function isProductionReadAuthorized(env: EnvMap = process.env): boolean {
  return env.ADEPT_ALLOW_PRODUCTION_DB === "1";
}

export function inferDbOperationMode(env: EnvMap = process.env): DbOperationMode {
  if (env.ADEPT_DB_TARGET === "production_migrate") return "production_migrate";
  if (env.ADEPT_DB_TARGET === "production_read") return "production_read";
  if (env.ADEPT_DB_TARGET === "staging") return "staging";
  if (env.ADEPT_DB_TARGET === "local") return "local";
  if (env.VERCEL_ENV === "production") return "hosted_production";
  if (env.VERCEL_ENV === "preview") return "hosted_preview";
  return "local";
}

export function candidateKeysForMode(mode: DbOperationMode): readonly string[] {
  switch (mode) {
    case "hosted_production":
      return HOSTED_CANDIDATES;
    case "hosted_preview":
      // Preview must use its own DATABASE_URL — never Production-prefixed aliases.
      return [
        "DATABASE_URL",
        "PRISMA_DATABASE_URL",
        "POSTGRES_URL",
        "POSTGRES_PRISMA_URL",
      ];
    case "production_read":
    case "production_migrate":
      return HOSTED_CANDIDATES;
    case "staging":
      return ["DATABASE_URL", "PRISMA_DATABASE_URL", "POSTGRES_URL"];
    case "local":
    default:
      return PLAIN_CANDIDATES;
  }
}

export type ResolveResult =
  | {
      ok: true;
      key: string;
      url: string;
      identity: UrlIdentity;
      mode: DbOperationMode;
    }
  | {
      ok: false;
      error: string;
      mode: DbOperationMode;
      key?: string;
      identity?: UrlIdentity;
    };

function pickFromEnv(
  env: EnvMap,
  keys: readonly string[],
): { key: string; url: string } | null {
  for (const key of keys) {
    const value = env[key];
    if (value && value.trim().length > 0 && value !== "[SENSITIVE]") {
      return { key, url: value.trim() };
    }
  }
  return null;
}

/**
 * Resolve a database URL for the given operation mode and fail closed on
 * Production targets unless the mode is explicitly authorized for Production.
 */
export function resolveDatabaseUrlForMode(
  mode: DbOperationMode,
  env: EnvMap = process.env,
): ResolveResult {
  const keys = candidateKeysForMode(mode);
  const picked = pickFromEnv(env, keys);

  if (!picked) {
    const prefixed = pickFromEnv(env, PREFIXED_FALLBACKS);
    if (
      prefixed &&
      (mode === "local" || mode === "staging" || mode === "hosted_preview")
    ) {
      let identity: UrlIdentity | undefined;
      try {
        identity = summarizeUrlIdentity(prefixed.url);
      } catch {
        identity = undefined;
      }
      if (identity?.isKnownProduction) {
        return {
          ok: false,
          error:
            "REFUSED_PRODUCTION_FALLBACK — Production-prefixed database aliases are present but must not be selected for local/staging operations. Set a non-Production DATABASE_URL, or use ADEPT_ALLOW_PRODUCTION_DB=1 with ADEPT_DB_TARGET=production_read for an authorized read-only Production operation.",
          mode,
          key: prefixed.key,
          identity,
        };
      }
    }
    return {
      ok: false,
      error: `NO_DATABASE_URL — no usable URL for mode=${mode} (checked: ${keys.join(", ")})`,
      mode,
    };
  }

  let identity: UrlIdentity;
  try {
    identity = summarizeUrlIdentity(picked.url);
  } catch {
    return {
      ok: false,
      error: "UNPARSEABLE_DATABASE_URL",
      mode,
      key: picked.key,
    };
  }

  const refused = assertIdentityAllowed(mode, identity, env);
  if (refused) {
    return {
      ok: false,
      error: refused,
      mode,
      key: picked.key,
      identity,
    };
  }

  return {
    ok: true,
    key: picked.key,
    url: picked.url,
    identity,
    mode,
  };
}

export function assertIdentityAllowed(
  mode: DbOperationMode,
  identity: UrlIdentity,
  env: EnvMap = process.env,
): string | null {
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

/** Apply resolved URL into process.env.DATABASE_URL without printing secrets. */
export function applyResolvedDatabaseUrl(
  result: Extract<ResolveResult, { ok: true }>,
): void {
  process.env.DATABASE_URL = result.url;
}
