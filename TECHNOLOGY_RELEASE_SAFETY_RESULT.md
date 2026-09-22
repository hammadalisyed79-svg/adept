# TECHNOLOGY RELEASE SAFETY RESULT

**Date:** 2026-09-22  
**Branch:** `feature/technology-growth` (unpushed)  
**Scope:** Release safety gate only — form/feature rework not repeated.

---

## Verdict

| Gate | Status |
|------|--------|
| Local/staging Production-target refusal | **IMPLEMENTED** |
| Mocked Production rejection tests | **PASS** |
| Local suite on non-Production DB | **PASS** |
| Production backup / restore evidence | **PRODUCTION BACKUP: UNVERIFIED** |
| Production ready | **NO — REQUIRES APPROVAL** |

---

## 1. Safeguard implemented

Fail-closed DB target guard keyed to known store identities:

| Store | ID | Credential fingerprint (user suffix) |
|-------|----|--------------------------------------|
| Production `prisma-postgres-purple-drum` | `store_KtXMAUbnv6UZNedj` | `…673b6b` |
| Staging `adept-staging-postgres` | `store_damIXxKrVMmE3tpT` | `…4efe06` |

**Behaviour:**

- **Local mode** (`ADEPT_DB_TARGET=local` or default non-Vercel): uses **only** plain `DATABASE_URL`; requires localhost; **never** auto-selects `DATABASE_URL_*` Production aliases.
- **Staging / Preview**: accepts known staging suffix only; refuses Production.
- **Production fallback refusal**: if plain URL missing but Production-prefixed aliases exist → `REFUSED_PRODUCTION_FALLBACK`.
- **Production migrate**: requires **both** `ADEPT_ALLOW_PRODUCTION_MIGRATE=1` **and** `ADEPT_PRODUCTION_MIGRATE_CONFIRM=prisma-postgres-purple-drum`.
- **Production read** (ops scripts): requires `ADEPT_ALLOW_PRODUCTION_DB=1` + `ADEPT_DB_TARGET=production_read`.
- Credentials / connection strings are **never logged** (host + suffix only).

---

## 2. Files changed

| File | Change |
|------|--------|
| `src/lib/db-target-guard.ts` | New shared guard (TS) |
| `scripts/lib/db-target-guard.mjs` | Script mirror + `assertOrExit` |
| `src/lib/db.ts` | Resolves URL via guard; fail-closed for local/staging |
| `scripts/build-with-db.mjs` | Guarded resolve; Production migrate dual-auth |
| `scripts/migrate-from-env-file.mjs` | Defaults to staging; Production migrate gated |
| `scripts/resolve-database-url.mjs` | Uses guard |
| `scripts/backup-inquiries.mjs` | Guarded; labels output as inquiry snapshot |
| `scripts/pre-migrate-safety.mjs` | Guarded pre-migrate identity log |
| `scripts/verify-db-guard-mocked.mjs` | Mocked rejection harness (no live DB) |
| `tests/setup-db-guard.ts` | Vitest refuses Production; clears prefixed aliases |
| `tests/unit/db-target-guard.test.ts` | Unit coverage with mocked URLs |
| `vitest.config.ts` | Registers setup file |

Credentials in `.env` were **not** removed or overwritten.

---

## 3. Production-target rejection test

`node scripts/verify-db-guard-mocked.mjs` (mocked URLs only — **no Production connection**):

| Case | Result |
|------|--------|
| Local + Production URL | `REFUSED_PRODUCTION_TARGET` |
| Local + Production-prefixed fallback only | `REFUSED_PRODUCTION_FALLBACK` |
| Staging + Production URL | `REFUSED_PRODUCTION_TARGET` |
| Production migrate without dual auth | `REFUSED_PRODUCTION_TARGET` |
| Local + localhost URL | accepted |

Vitest: `tests/unit/db-target-guard.test.ts` — **7 passed**.

---

## 4. Backup / recovery evidence

**PRODUCTION BACKUP: UNVERIFIED**

Inspected artifacts (read-only):

| Artifact | What it actually is |
|----------|---------------------|
| `scripts/backup-inquiries.mjs` output | JSON dump of `BusinessInquiry` (+ activities/notifications) |
| `backups/inquiries-backup-2026-09-21T10-17-19-495Z.json` | Inquiry rows; `hostHint=127.0.0.1:5433`; **not** `pg_dump` / Prisma Postgres snapshot |
| `backups/staging-pre-migrate-*.json` | Reference/enum/column **metadata** snapshot |

No independently verified full-database backup or restore drill exists for Production.  
Inquiry JSON must **not** be called a complete recoverable backup.

---

## 5. Migration compatibility result

Additive migration `20260922120000_technology_inquiry_types`:

- `ALTER TYPE … ADD VALUE` × 3  
- `ADD COLUMN` nullable TEXT × 2  
- **No** DROP / RENAME / data overwrite

| Compatibility | Result |
|---------------|--------|
| Old app vs expanded schema | **OK** — old code never writes new enum values or columns; nullable columns ignored |
| Existing inquiry types | **Preserved** |
| New `TECHNOLOGY_*` types | Require **new** application + validation |
| Forward migrate risk | Low (additive enum/columns) |
| Enum rollback | Do **not** reverse with destructive SQL |

### Exact safe Production release sequence (NOT executed)

1. Separate written approval for Production migrate + deploy.  
2. Establish **verified** Production backup / restore point (beyond inquiry JSON).  
3. Confirm Production store still `prisma-postgres-purple-drum` / suffix `…673b6b`.  
4. Merge/push only after approval (currently unauthorized).  
5. Deploy app build that includes technology inquiry **or** migrate first while old app remains compatible (additive). Prefer: migrate Production with  
   `ADEPT_DB_TARGET=production_migrate`  
   `ADEPT_ALLOW_PRODUCTION_MIGRATE=1`  
   `ADEPT_PRODUCTION_MIGRATE_CONFIRM=prisma-postgres-purple-drum`  
   then promote the new app.  
6. Smoke fragrance + technology inquiries on Production.  
7. Recheck inquiry count fingerprint.

---

## 6. Local test results

Target confirmed: `127.0.0.1` / non-Production (`isKnownProduction=false`).

| Check | Result |
|-------|--------|
| `prisma validate` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 43 passed, 2 skipped (staging gate) |
| `npm run build` | PASS — build guard selected local `DATABASE_URL` only |

No Production inquiries created.

---

## 7. Remaining release approvals

Before any Production release, obtain separate approval for **each**:

1. Verified Production backup + restore evidence (currently **UNVERIFIED**)  
2. Production schema migrate (dual-auth flags above)  
3. Git push / merge to `main`  
4. Hosted Production deploy / promote  
5. SMTP go-live (optional for persistence; required for email delivery claims)

**STOP.** Local verification complete. No Production migration, deploy, push, or merge performed.
