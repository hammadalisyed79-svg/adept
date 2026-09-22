import { describe, expect, it } from "vitest";
import {
  PRODUCTION_STORE,
  STAGING_STORE,
  assertIdentityAllowed,
  candidateKeysForMode,
  isProductionMigrateAuthorized,
  resolveDatabaseUrlForMode,
  summarizeUrlIdentity,
} from "@/lib/db-target-guard";

/** Mocked identities — never real credentials. */
const LOCAL_URL = "postgresql://adept:localpass@127.0.0.1:5433/adept_website";
const STAGING_URL = `postgresql://user_${STAGING_STORE.userSuffixes[0]}:mock@db.prisma.io:5432/postgres`;
const PRODUCTION_URL = `postgresql://user_${PRODUCTION_STORE.userSuffixes[0]}:mock@db.prisma.io:5432/postgres`;

describe("db-target-guard (mocked identities)", () => {
  it("classifies localhost, staging, and production suffixes", () => {
    expect(summarizeUrlIdentity(LOCAL_URL).isLocalhost).toBe(true);
    expect(summarizeUrlIdentity(LOCAL_URL).isKnownProduction).toBe(false);

    const staging = summarizeUrlIdentity(STAGING_URL);
    expect(staging.isKnownStaging).toBe(true);
    expect(staging.isKnownProduction).toBe(false);
    expect(staging.userSuffix).toBe(STAGING_STORE.userSuffixes[0]);

    const production = summarizeUrlIdentity(PRODUCTION_URL);
    expect(production.isKnownProduction).toBe(true);
    expect(production.isKnownStaging).toBe(false);
    expect(production.userSuffix).toBe(PRODUCTION_STORE.userSuffixes[0]);
  });

  it("local mode uses only plain DATABASE_URL and rejects Production", () => {
    expect(candidateKeysForMode("local")).toEqual(["DATABASE_URL"]);

    const ok = resolveDatabaseUrlForMode("local", {
      DATABASE_URL: LOCAL_URL,
      DATABASE_URL_PRISMA_DATABASE_URL: PRODUCTION_URL,
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.identity.isLocalhost).toBe(true);

    const refused = resolveDatabaseUrlForMode("local", {
      DATABASE_URL: PRODUCTION_URL,
    });
    expect(refused.ok).toBe(false);
    if (!refused.ok) expect(refused.error).toMatch(/REFUSED_PRODUCTION_TARGET/);
  });

  it("refuses Production-prefixed fallback when plain DATABASE_URL is absent", () => {
    const result = resolveDatabaseUrlForMode("local", {
      DATABASE_URL_PRISMA_DATABASE_URL: PRODUCTION_URL,
      DATABASE_URL_DATABASE_URL: PRODUCTION_URL,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/REFUSED_PRODUCTION_FALLBACK/);
  });

  it("staging mode accepts staging identity and rejects Production", () => {
    const ok = resolveDatabaseUrlForMode("staging", {
      DATABASE_URL: STAGING_URL,
    });
    expect(ok.ok).toBe(true);

    const refused = resolveDatabaseUrlForMode("staging", {
      DATABASE_URL: PRODUCTION_URL,
    });
    expect(refused.ok).toBe(false);
    if (!refused.ok) expect(refused.error).toMatch(/REFUSED_PRODUCTION_TARGET/);
  });

  it("production_migrate requires explicit dual authorization", () => {
    expect(
      isProductionMigrateAuthorized({
        ADEPT_ALLOW_PRODUCTION_MIGRATE: "1",
      }),
    ).toBe(false);

    expect(
      isProductionMigrateAuthorized({
        ADEPT_ALLOW_PRODUCTION_MIGRATE: "1",
        ADEPT_PRODUCTION_MIGRATE_CONFIRM: PRODUCTION_STORE.name,
      }),
    ).toBe(true);

    const unauthorized = resolveDatabaseUrlForMode("production_migrate", {
      DATABASE_URL: PRODUCTION_URL,
    });
    expect(unauthorized.ok).toBe(false);

    const authorized = resolveDatabaseUrlForMode(
      "production_migrate",
      {
        DATABASE_URL: PRODUCTION_URL,
        ADEPT_ALLOW_PRODUCTION_MIGRATE: "1",
        ADEPT_PRODUCTION_MIGRATE_CONFIRM: PRODUCTION_STORE.name,
      },
    );
    expect(authorized.ok).toBe(true);
  });

  it("assertIdentityAllowed blocks Production for hosted_preview", () => {
    const production = summarizeUrlIdentity(PRODUCTION_URL);
    const msg = assertIdentityAllowed("hosted_preview", production);
    expect(msg).toMatch(/REFUSED_PRODUCTION_TARGET/);
  });

  it("hosted_preview candidate list excludes Production-prefixed aliases", () => {
    const keys = candidateKeysForMode("hosted_preview");
    expect(keys).not.toContain("DATABASE_URL_PRISMA_DATABASE_URL");
    expect(keys).not.toContain("DATABASE_URL_DATABASE_URL");
    expect(keys).not.toContain("DATABASE_URL_POSTGRES_URL");
  });
});
