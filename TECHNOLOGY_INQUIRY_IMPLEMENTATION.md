# TECHNOLOGY INQUIRY IMPLEMENTATION

**Date:** 2026-09-22  
**Classification summary:** IMPLEMENTED · TESTED LOCALLY · VERIFIED ON STAGING · **NOT** Production ready · **REQUIRES APPROVAL** for release

---

## 1. Exact Git branch and commit

| Item | Value |
|------|--------|
| Branch | `feature/technology-growth` |
| Implementation commit | `b1d53747b6a4bff68a74b79e86a803fd76b173b8` |
| Parent | `21ba1693467e407c79de8866d4e998f9b0b709dd` |
| Unrelated untracked preserved | `.agents/`, `skills-lock.json`, `visual-review.rar` |
| Push | **NOT performed** (unauthorized) |
| Merge to main | **NOT performed** |

---

## 2. Files changed

### Schema / migration
- `prisma/schema.prisma` — additive `InquiryType` values + `estimatedBudget`, `technologyDetailsJson`
- `prisma/migrations/20260922120000_technology_inquiry_types/migration.sql`

### API / validation / persistence
- `src/lib/validation/technology-inquiry.ts` (new)
- `src/lib/inquiries/create.ts` — technology branch + fragrance path preserved
- `src/app/api/inquiries/route.ts` — routes by type to Zod schema

### UI
- `src/components/forms/TechnologyInquiryForm.tsx` (new)
- `src/app/technology/request-quote/page.tsx` (new)
- `src/app/technology/page.tsx` — CTA → form
- `src/app/technology/erp/page.tsx` — CTA → `?type=erp`
- `src/app/technology/website-development/page.tsx` — CTA → `?type=website`
- `src/app/technology/digital-marketing/page.tsx` — CTA → `?type=marketing`
- AI Support page CTAs **unchanged** (mailto only; not in inquiry form scope)

### Tests / capture
- `tests/unit/technology-inquiry-validation.test.ts` (new)
- `tests/unit/mail.test.ts` — fixture fields for new columns
- `tests/integration/inquiry.test.ts` — technology persistence + fragrance compatibility
- `tests/integration/staging-technology.test.ts` — gated staging tests (`STAGING_TECH_TESTS=1`)
- `scripts/capture-technology-inquiry.mjs`
- Screenshots under `visual-review/technology-inquiry/`

### Explicitly not modified
- Fragrance `/request-quote` form and validation rules
- SMTP credentials / settings
- ERP adapter behaviour beyond existing stub path
- DNS / Production env / Production schema (except read-only baseline)

---

## 3. Form route and fields

**Route:** `/technology/request-quote`  
**Heading:** Discuss Your Technology Project

**Direct links (preselect, user-changeable):**
- `/technology/request-quote?type=erp` → `TECHNOLOGY_ERP`
- `/technology/request-quote?type=website` → `TECHNOLOGY_WEBSITE`
- `/technology/request-quote?type=marketing` → `TECHNOLOGY_MARKETING`

**Required:** company/business name, contact person, email, country, service required, project description  

**Optional (shared):** telephone, estimated budget, expected timeline  

**Progressive disclosure (service-specific optional):**
- ERP: industry, modules, existing software, users, integrations
- Website: type, existing URL, page/product count, ecommerce, integrations
- Marketing: channels, objectives, audience, interested channels, monthly budget  

Does not request passwords or database credentials. Single-column on mobile. Required vs optional labelled.

---

## 4. Database schema changes

Additive only on existing `BusinessInquiry` / `InquiryType`:

```text
InquiryType += TECHNOLOGY_ERP | TECHNOLOGY_WEBSITE | TECHNOLOGY_MARKETING
BusinessInquiry.estimatedBudget TEXT NULL
BusinessInquiry.technologyDetailsJson TEXT NULL
```

Service-specific optional data stored as validated JSON in `technologyDetailsJson`. Shared optional budget in `estimatedBudget`. Existing fragrance fields untouched. No new tables.

---

## 5. Migration SQL summary

File: `prisma/migrations/20260922120000_technology_inquiry_types/migration.sql`

- `ALTER TYPE "InquiryType" ADD VALUE` × 3 (PostgreSQL-compatible additive enum)
- `ADD COLUMN` × 2 nullable TEXT
- **No** DROP / RENAME / UPDATE of existing rows

---

## 6. Validation and API changes

- Technology payloads → `technologyInquirySchema` (Zod)
- Fragrance/packaging payloads → existing `inquirySchema` (unchanged rules)
- Unsupported / wrong-schema types rejected
- Email trimmed; persistence lowercases email
- Optional URL refine for website URL
- Honeypot + rate limit preserved
- SMTP failure/skip does not discard saved inquiry
- Reference via existing `generateInquiryReference()` (`ADF-YYYYMMDD-XXXXXX`)

---

## 7. Existing fragrance compatibility evidence

Local integration tests:
- Fragrance / packaging / private-label paths still persist
- Technology suite includes post-tech fragrance create → `ok: true`
- Unit: fragrance schema still accepts trading; rejects `TECHNOLOGY_*` on fragrance schema
- `/request-quote` InquiryForm and CTAs for fragrance services unchanged

---

## 8. Local test results

**Target:** `127.0.0.1` / `adept_website` only (prefixed Production aliases cleared for migrate/test/build)

| Check | Result |
|-------|--------|
| `prisma validate` | PASS |
| Local `prisma migrate deploy` | PASS (`20260922120000_technology_inquiry_types`) |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` (vitest) | PASS — 36 tests (4 files) before staging-gated file |
| `npm run build` | PASS — route `/technology/request-quote` present |

Status: **TESTED LOCALLY**

---

## 9. Staging database identity verification

| Role | Store name | Store ID | Env attach | Credential fingerprint (user suffix) |
|------|------------|----------|------------|--------------------------------------|
| Preview / Staging | `adept-staging-postgres` | `store_damIXxKrVMmE3tpT` | Preview only | `…4efe06` |
| Production | `prisma-postgres-purple-drum` | `store_KtXMAUbnv6UZNedj` | Production only | `…673b6b` |

Preview ≠ Production: **VERIFIED** (different stores and suffixes).  
Production deployment ID (live): `dpl_BNCfeh2TLWFaQkhz2io2EWoKBZnd` @ www.adeptfragrances.com  

Runtime / CLI fallback inspection:
- Local `.env` plain `DATABASE_URL` → localhost (safe for local work)
- Prefixed `DATABASE_URL_*` in `.env` → Production suffix `673b6b` (never used for migrate/test in this work)
- `.env.vercel.preview` → Staging suffix `4efe06` only
- Staging migrate/tests forced `DATABASE_URL` to Preview URL and cleared prefixed aliases

---

## 10. Backup and recovery evidence

| Gate | Evidence |
|------|----------|
| Staging pre-migrate backup | `backups/staging-pre-migrate-2026-09-22T07-26-39-495Z.json` — inquiryCount **0**, enum baseline without technology values, column list captured via raw SQL (client schema mismatch avoided) |
| Production baseline (read-only) | Count **8**; fingerprint `8e8d91a2d202b2d5`; references listed in §13 (no PII) |
| Recovery notes | See §11 |

---

## 11. Staging migration status

**Status: VERIFIED ON STAGING (migration applied)**

- Pre-check identity gate: suffix `4efe06` only; refused Production `673b6b`
- Applied: `20260922120000_technology_inquiry_types` to staging only
- Hosted Preview **code** does **not** contain this feature (no git push). Staging DB schema updated; application tested via local code + staging `DATABASE_URL` (integration), not via hosted Preview UI

### Rollback preparation (document only — not executed)

| Failure | Recovery |
|---------|----------|
| Failed staging migration | Restore from pre-migrate JSON fingerprint; do **not** reverse enum ADD VALUE with DROP; leave new columns nullable unused if app rolled back |
| Invalid staging env | Re-attach Preview solely to `adept-staging-postgres`; never point Preview at purple-drum |
| Application failure | Feature is branch-only; Production undeployed. Disable CTAs only after release approval if needed |
| Partial staging tests | Keep TEST rows (`ADF-20260922-*` below); optional approved cleanup later — do not auto-delete |

**Never** automatically reverse PostgreSQL enum additions with destructive SQL.  
**No** Production rollback authorized.

---

## 12. Three staging test references

| Service | Reference | Type | Notification |
|---------|-----------|------|--------------|
| ERP | `ADF-20260922-E04014` | `TECHNOLOGY_ERP` | `SKIPPED` (SMTP not configured) |
| Website Development | `ADF-20260922-C5A1A7` | `TECHNOLOGY_WEBSITE` | `SKIPPED` |
| Digital Marketing | `ADF-20260922-6C1488` | `TECHNOLOGY_MARKETING` | `SKIPPED` |

All three present on staging with `technologyDetailsJson`. No duplicates.  
Evidence file: `backups/staging-tech-tests-evidence.json`

Hosted Preview UI submission: **not claimed** (feature code not on Preview deployment).

---

## 13. Production baseline before / after

| Metric | Before staging tests | After staging tests |
|--------|----------------------|---------------------|
| Inquiry count | 8 | 8 |
| Fingerprint | `8e8d91a2d202b2d5` | `8e8d91a2d202b2d5` (unchanged) |
| Staging refs in Production | — | **Absent** (`stagingRefsAbsent: true`) |

Production references (no PII):  
`ADF-20260921-C668E7`, `FA864E`, `7A3C7F`, `7DEFA7`, `5ACF70`, `812440`, `99CE00`, `B4367A`

Production schema: **not migrated**. Production remains on prior inquiry types only.

---

## 14. Screenshots

Directory: `visual-review/technology-inquiry/`

| Asset | Notes |
|-------|--------|
| `form-overview-{390,768,1024,1440}.png` | Form overview |
| `erp-selected-*.png` | ERP progressive fields |
| `website-selected-*.png` | Website progressive fields |
| `marketing-selected-*.png` | Marketing progressive fields |
| `success-confirmation-local-1024.png` | Local success confirmation (local DB) |
| `cta-technology*.png` | Updated CTA bands |
| `qa-report.json` | No horizontal overflow at tested widths; preselect labels correct |

Staging UI success screenshot: **not taken** (no hosted build with this form). Persistence confirmation via staging references above.

---

## 15. Remaining blockers

| Item | Classification |
|------|----------------|
| Feature branch unpushed / not on Preview deployment | REQUIRES APPROVAL |
| Production migration | **BLOCKED** until separate release approval |
| Production / live domain deploy | **BLOCKED** — unauthorized |
| SMTP operational delivery | BLOCKED (notifications correctly `SKIPPED`; inquiries retained) |
| Merge to `main` | REQUIRES APPROVAL |

---

## 16. Explicit release status

| Gate | Status |
|------|--------|
| Implementation complete on branch | **IMPLEMENTED** |
| Local disposable DB + tests + build | **TESTED LOCALLY** |
| Staging identity + backup + migrate + 3 TEST inquiries + Production isolation | **VERIFIED ON STAGING** |
| Production ready | **NO — REQUIRES APPROVAL** |
| Git push / merge / Production promote | **NOT DONE** |

### FINAL STOP

Authorized local development and staging safety-gated work are complete.  
Feature branch left **unpushed**. No merge, deploy, or Production promotion performed.  

Awaiting separate release approval.
