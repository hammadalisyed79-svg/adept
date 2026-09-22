# Staging database isolation — ADEPT Fragrances

**Status:** EXECUTED 2026-09-22 — Preview isolated on Free plan; Production store unchanged  
**Date:** 2026-09-21 (procedure) / 2026-09-22 (execution)

## Current configuration (post-isolation)

| Item | Finding |
|------|---------|
| Production storage | `prisma-postgres-purple-drum` (`store_KtXMAUbnv6UZNedj`) — **production only** |
| Preview storage | `adept-staging-postgres` (`store_damIXxKrVMmE3tpT`) — **preview only**, Free plan |
| Production env | `DATABASE_URL` + `DATABASE_URL_*` → purple-drum |
| Preview env | `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL` → staging |
| Isolation | **ISOLATED** — distinct DB user fingerprints (`…673b6b` vs `…4efe06`) |
| Staging migrations | Applied 2026-09-22 (`migrate deploy` against Preview URL only) |

Host: `db.prisma.io` (connection strings never printed in reports).

## Goal

- Production → keep current Prisma Postgres store credentials unchanged  
- Preview / staging → dedicated database  
- Migrations applied to staging separately (`RUN_DB_MIGRATE=true` one-off or `npm run db:migrate:deploy` with staging URL only)

## Authorized steps (do not run without approval to provision billable storage)

1. **Backup** Production/shared DB inquiry references:
   ```bash
   # With Production/shared DATABASE_URL available in a secure shell only:
   npm run db:backup:inquiries
   # Output is gitignored under /backups/ — treat as PII
   ```
2. **Pre-change snapshot** (references only, no emails):
   ```bash
   node scripts/pre-migrate-safety.mjs
   ```
3. **Create** a new Prisma Postgres store in Vercel (e.g. `adept-staging-postgres`) — do **not** delete `prisma-postgres-purple-drum`.
4. **Connect** the new store to project `adept` for **Preview only** (not Production).
5. **Remove Preview** attachment of the production store **or** override Preview `DATABASE_URL*` to the staging store only — leave Production env untouched.
6. **Migrate staging only**:
   ```bash
   # With staging URL only in shell env:
   set RUN_DB_MIGRATE=   # unset for normal builds
   npx prisma migrate deploy
   ```
7. **Verify** Production inquiry count/references unchanged via `pre-migrate-safety.mjs` against Production URL only.
8. Redeploy Preview and confirm inquiries write to staging DB only.

## Recovery procedure (tested pattern)

| Step | Action | Verification |
|------|--------|--------------|
| A | Run `npm run db:backup:inquiries` before schema/env changes | File created under `/backups/` with `count` + inquiries JSON |
| B | Run `node scripts/pre-migrate-safety.mjs` | Logs `inquiryCount` + `ADF-…` references (no email PII) |
| C | If restore needed | Restore from backup JSON / Prisma Postgres PITR in provider dashboard (provider-managed) — **requires human confirmation in Vercel/Prisma UI** |
| D | Confirm | Re-run safety script; match reference list |

**Local backup exercised this engagement:** 31 inquiries written to gitignored `/backups/` from local Postgres (separate from hosted).  

**Hosted pre-migrate safety exercised on consolidated release:** 1 hosted inquiry `ADF-20260921-C668E7` logged before migrate check.

## What this audit will NOT do without explicit authorization

- Delete `prisma-postgres-purple-drum`  
- Change Production `DATABASE_URL*` values  
- Migrate or truncate Production data  
- Provision a billable second database without confirmation  

## Safe interim controls

- Keep `RUN_DB_MIGRATE` unset on all environments (normal builds skip migrate)  
- Apply schema changes only with an explicit migrate command against a known target URL  
- Prefer Preview deploys for testing until Preview DB is isolated  
