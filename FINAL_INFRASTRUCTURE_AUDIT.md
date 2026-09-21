# FINAL INFRASTRUCTURE AUDIT — ADEPT Fragrances

**Date:** 2026-09-21  
**Basis:** `CONSOLIDATED_STAGING_RELEASE.md` + live Vercel/project inspection  
**Scope:** Infrastructure risks only — no feature rebuild, no public DNS changes, no `vercel --prod` in this audit  
**ERP:** NOT CONNECTED / NOT MODIFIED  

---

## Executive verdict

| Area | Status |
|------|--------|
| Database isolation (Preview vs Production) | **NOT ISOLATED** — shared Prisma Postgres |
| Separate staging DB prepared | **DOCUMENTED** — not provisioned (no billable create without approval) |
| Backup / recovery procedure | **DOCUMENTED · PARTIALLY TESTED** |
| Email delivery to `info@` | **BLOCKED / UNVERIFIED** — SMTP not configured at runtime |
| Staging deployment protection | **ENABLED** (SSO on deployment URLs) |
| Automatic Git → Production URLs | **YES** — Production aliases update; **custom domains publicly reachable** |
| Public DNS / production promotion by this audit | **NOT CHANGED** |
| READY FOR CONTROLLED PUBLIC OPERATION | **NO** — see blockers |

---

## 1. Database isolation status

### Current configuration (no connection strings disclosed)

| Item | Finding |
|------|---------|
| Store | `prisma-postgres-purple-drum` (Prisma Postgres) |
| Store ID | `store_KtXMAUbnv6UZNedj` |
| Connected to project `adept` | **preview + production** |
| Injected vars | `DATABASE_URL_POSTGRES_URL`, `DATABASE_URL_DATABASE_URL`, `DATABASE_URL_PRISMA_DATABASE_URL` |
| Additional | Manual `DATABASE_URL` also attached to **Preview and Production** |
| Host seen in Preview build logs | `db.prisma.io` |
| Isolation | **FAILED** — one database serves both environments |

Evidence: `vercel storage status prisma-postgres-purple-drum` reports environments **preview, production**.  
`vercel env ls` shows all `DATABASE_URL*` secrets scoped to **Preview, Production**.

### Production records

- Pre-migrate safety on consolidated release listed hosted inquiry `ADF-20260921-C668E7`.  
- This audit created additional Preview API inquiries into the **same** shared DB (e.g. `ADF-20260921-812440`).  
- **No Production credentials were altered. No databases deleted. No Production data migrated or truncated.**

### Separate staging database

| Action | Status |
|--------|--------|
| Isolation procedure written | **YES** — `docs/STAGING_DATABASE_ISOLATION.md` |
| New staging store provisioned | **NOT DONE** — requires explicit approval to create billable storage |
| Preview retargeted to new DB | **NOT DONE** — would be safe only after provisioning; Production left untouched |
| Staging migrations applied separately | **READY** via `RUN_DB_MIGRATE` gate / `npm run db:migrate:deploy` against staging URL only |

**Safe fix applied previously (retained):** normal builds skip `prisma migrate deploy` unless `RUN_DB_MIGRATE=true`.

---

## 2. Backup and recovery verification

| Step | Result |
|------|--------|
| `npm run db:backup:inquiries` (local authorized DB) | **TESTED** — wrote gitignored backup (`39` inquiries this run) |
| `node scripts/pre-migrate-safety.mjs` | **TESTED** — logs host + `ADF-…` references + `notificationStatus` (no emails) |
| Hosted pre-migrate snapshot (prior release) | **TESTED** — `inquiryCount: 1`, `ADF-20260921-C668E7` |
| Provider PITR / UI restore | **DOCUMENTED** — requires human confirmation in Vercel/Prisma dashboard (**not** exercised end-to-end in this audit) |

Recovery procedure is documented in `docs/STAGING_DATABASE_ISOLATION.md`.  
**Do not commit `/backups/`** (PII risk; gitignored).

---

## 3. Email delivery result

**Official address:** `info@adeptfragrances.com`  
Vercel `COMPANY_EMAIL` / `SALES_EMAIL` / `SMTP_FROM` were set to this address in the prior consolidation.

### Staging quotation submitted (this audit)

| Field | Value |
|-------|--------|
| Channel | Protected Preview `POST /api/inquiries` |
| URL | https://adept-efr2keu94-hammad-fedc.vercel.app |
| Result | `{"ok":true,"reference":"ADF-20260921-812440",...}` |
| DB record | **CREATED** (API persistence success; same pattern as prior Preview inquiries) |
| Unique reference | **`ADF-20260921-812440`** |

### Notification / inbox

| Check | Result |
|-------|--------|
| Runtime SMTP on Preview | **NOT CONFIGURED** |
| Evidence | Vercel function logs: `EMAIL_NOTIFICATIONS_BLOCKED: SMTP is not configured…` for Preview inquiry POSTs |
| Notification delivery status | **SKIPPED / BLOCKED** (not SENT) |
| Actual `info@` inbox receipt | **UNVERIFIED** — and **not expected** while SMTP remains empty/invalid |
| Claim based on API `ok: true` alone | **REJECTED** — API success ≠ email delivery |

`SMTP_*` keys exist in the Vercel env list, but runtime behavior shows they are **not** providing a working transporter (empty or unusable values).  
**Inbox delivery is therefore BLOCKED at the transport layer, not merely unverified.**

---

## 4. Deployment security

### Staging (Preview) protection

| Check | Result |
|-------|--------|
| Deployment URL SSO | **ENABLED** — anonymous `GET` → **302** to Vercel SSO |
| Example | https://adept-efr2keu94-hammad-fedc.vercel.app |
| Automation bypass | Present (used by `vercel curl`) |
| Git fork protection | **Enabled** |

Project protection JSON (summary):

- `ssoProtection.deploymentType`: **`all_except_custom_domains`**
- Implication: SSO protects `*.vercel.app` deployment URLs, **not** custom domains

### Automatic Git → Production

| Check | Result |
|-------|--------|
| Production deployments on `main` pushes | **YES** (multiple Ready Production deploys observed) |
| Production deployment URLs | SSO-protected (**302**) |
| Production project alias | https://adept-indol.vercel.app — **HTTP 200 public** (serves ADEPT B2B site) |
| Custom domains on Vercel | `adeptfragrances.com`, `www.adeptfragrances.com` aliased to latest Production deployment |

### Public domain observation (read-only)

| URL | Result |
|-----|--------|
| https://www.adeptfragrances.com/ | **HTTP 200** — ADEPT B2B homepage (“Everything You Need to Create a Fragrance Brand.”), `info@` present |
| https://adeptfragrances.com/ | **308** → www |

**This audit did not run `vercel --prod` and did not change DNS records.**  
The public domain is already attached to the Vercel Production alias via project domain configuration and Git Production deployments. That is a **deployment security / launch-control finding**, not a new deploy action by this audit.

### Safe actions taken / not taken

| Action | Done? |
|--------|--------|
| Document isolation + recovery | **YES** |
| Provision new staging DB | **NO** (needs authorization) |
| Alter Production DB credentials | **NO** |
| Remove public domain aliases | **NO** (would change public routing — needs explicit authorization) |
| Pause Production traffic | **NO** (would take public site offline — needs explicit authorization) |

---

## 5. Final verification (this session)

| Check | Result |
|-------|--------|
| `npm run typecheck` | **PASS** |
| `npm test` | **23/23 PASS** |
| Preview divisions (fragrance / packaging / toll / private label) | **HTTP 200** via `vercel curl` |
| `/request-quote` | **HTTP 200** |
| Quotation submit on Preview | **PASS** → `ADF-20260921-812440` |

---

## Remaining blockers

| Blocker | Severity |
|---------|----------|
| Preview and Production share one Prisma Postgres | **HIGH** — isolate before treating Production as durable |
| SMTP not configured on hosted runtime → no mail to `info@` | **HIGH** — supply real `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS`; keep `SMTP_FROM=info@adeptfragrances.com` |
| Public custom domain already serves Production app without SSO | **HIGH** — confirm intentional; otherwise authorize domain remove/pause or tighten protection |
| Git auto-Production deploys update public aliases | **MEDIUM** — disable auto-promote or require manual promotion |
| Provider PITR restore not fully drill-tested | **MEDIUM** |
| Telephone / WhatsApp / legal / photography / catalogue SKUs | **Launch** (unchanged) |
| ERP | Intentionally **NOT CONNECTED** |

---

## Classification summary

| Item | Label |
|------|--------|
| Shared DB diagnosis | **TESTED** |
| Staging DB isolation | **DOCUMENTED / BLOCKED** pending provision approval |
| Backup scripts | **TESTED** (local + prior hosted snapshot) |
| Inquiry persistence on staging Preview | **TESTED** (`ADF-20260921-812440`) |
| Email notification | **BLOCKED** (SMTP) |
| Inbox receipt | **UNVERIFIED** (and blocked upstream) |
| Preview SSO | **TESTED** |
| Public domain exposure | **TESTED** (read-only discovery) |

---

## Stop conditions

Audit complete. No production promote performed. No DNS edits performed. No Production database credential changes. No new development phase started.

**Next authorized actions (human decision required):**

1. Approve provisioning of a Preview-only Prisma Postgres and Preview env retarget (Production untouched).  
2. Supply working SMTP credentials for `info@adeptfragrances.com`.  
3. Decide whether `adeptfragrances.com` should remain publicly aliased; if not, authorize domain disconnect or traffic pause.  
