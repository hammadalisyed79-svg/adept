# PRODUCTION STABILIZATION ACTION PLAN — ADEPT Fragrances

**Date:** 2026-09-21  
**Operating decision:** Keep `www.adeptfragrances.com` **publicly accessible**.  
**Scope:** Read-only investigation, documentation, safe local tests.  
**Not authorized in this task:** offline/DNS/domain disconnect, Production deploy, Production DB replace/credential change, billable provisioning, customer-record edits, ERP changes, git push.

**Stabilization complete?** **NO** — SMTP, DB isolation, and deployment controls remain open.

---

## Classification key

| Label | Meaning |
|-------|---------|
| **VERIFIED** | Confirmed by inspection or safe local test this session |
| **PREPARED** | Documented procedure ready; not executed (or not yet authorized) |
| **BLOCKED** | Cannot proceed with current credentials/access/config |
| **REQUIRES AUTHORIZATION** | Explicit human approval needed before any change |

---

## A. Current live deployment and baseline

| Item | Value | Class |
|------|--------|-------|
| Public site | `https://www.adeptfragrances.com` (and apex → www) | **VERIFIED** live B2B |
| Public content | ADEPT hero, four divisions, `info@adeptfragrances.com` only | **VERIFIED** |
| Production deployment URL | `https://adept-3vwiqeong-hammad-fedc.vercel.app` | **VERIFIED** |
| Production deployment ID | `dpl_AZkuUT6EAacm7Q73tWmfdsVxXFXU` | **VERIFIED** |
| Production aliases | `www.adeptfragrances.com`, `adeptfragrances.com`, `adept-indol.vercel.app`, `adept-git-main-hammad-fedc.vercel.app`, … | **VERIFIED** |
| Production branch | **`main`** (Git-linked; `adept-git-main-…` alias) | **VERIFIED** |
| Repo HEAD (local/origin) | `d96381f` — *Document final infrastructure audit findings.* | **VERIFIED** |
| Preview deployment | `https://adept-efr2keu94-hammad-fedc.vercel.app` (`dpl_2FCREbbHSDcTbtmV9otkYkBvBi2D`) | **VERIFIED** (older than latest `main`) |
| DB store | `prisma-postgres-purple-drum` (`store_KtXMAUbnv6UZNedj`) | **VERIFIED** |
| DB environments | **preview + production** (shared) | **VERIFIED** |
| Host (build logs, no secrets) | `db.prisma.io` | **VERIFIED** |
| SSO | `all_except_custom_domains` — deployment URLs protected; **custom domains public** | **VERIFIED** |
| SMTP runtime | Not configured — `EMAIL_NOTIFICATIONS_BLOCKED` in logs | **VERIFIED** |
| Backup scripts | `db:backup:inquiries`, `pre-migrate-safety.mjs` exist | **VERIFIED** locally |
| Provider restore drill | Not executed end-to-end | **RESTORE NOT VERIFIED** |

### Why `main` pushes update the public site

1. Vercel Git integration builds **Production** from **`main`**.  
2. **Auto-assign Custom Production Domains** is effectively enabled (default behavior observed).  
3. Successful Production builds receive `www.adeptfragrances.com` / apex aliases immediately.

---

## B. Genuine / potential inquiry counts (no PII)

### Hosted (live shared Production/Preview DB)

| Finding | Class |
|---------|--------|
| Agent cannot decrypt hosted `DATABASE_URL*` (Vercel secret-pull blocked) | **BLOCKED** full hosted read |
| Known hosted inquiry refs from prior API/logs are **test/staging** patterns | **VERIFIED** for that known set |
| Confirmed genuine customer count on hosted DB | **Not established** — treat as **REQUIRES AUTHORIZATION** for operator read |
| All observed hosted email attempts | **SKIPPED/BLOCKED** (SMTP) |

Known test references (safe to list):  
`ADF-20260921-C668E7`, `FA864E`, `7A3C7F`, `7DEFA7`, `5ACF70`, `812440` (and similar automation refs).

### Local development DB only (not Production)

| Metric | Value |
|--------|--------|
| Total | 51 |
| Test/staging (heuristic) | 51 |
| Potentially genuine | **0** |
| Notifications | SKIPPED 44 / FAILED 7 |

**Do not** equate local counts with Production.

---

## C. Manual monitoring procedure

**PREPARED** — see `docs/INQUIRY_MONITORING.md`.

Until inbox delivery works:

- Check DB at **open / mid-day / close**.  
- Use read-only SQL / Prisma Studio / `classify-inquiries-safe.mjs`.  
- Log reviewed **references only** outside Git (`%USERPROFILE%\.adept-ops\…`).  
- Sales contacts customers manually from **info@adeptfragrances.com**.  
- No CRM / no public dashboard / no automatic monitoring claimed.

---

## D. Exact SMTP blocker

| Variable | Present in Vercel (Preview+Production keys) | Runtime usable |
|----------|-----------------------------------------------|----------------|
| `SMTP_HOST` | Key exists (secret) | **NO** — blocked at runtime |
| `SMTP_PORT` | Key exists | Unknown / unused while host empty |
| `SMTP_SECURE` | Key exists | Unknown / unused while host empty |
| `SMTP_USER` | Key exists | **NO** |
| `SMTP_PASS` | Key exists | **NO** |
| `SMTP_FROM` | Key exists (intended `info@`) | Irrelevant until host works |
| `COMPANY_EMAIL` | Key exists | Intended `info@adeptfragrances.com` |
| `SALES_EMAIL` | Key exists | Must equal `info@adeptfragrances.com` |

**App reads:** `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` (+ recipient via `SALES_EMAIL`/`COMPANY_EMAIL`); From via `SMTP_FROM` then fallbacks (`src/lib/mail.ts`).  
**Evidence:** function logs `EMAIL_NOTIFICATIONS_BLOCKED: SMTP is not configured`.

### Email admin must configure (Vercel dashboard — **REQUIRES AUTHORIZATION**)

1. Production (and Preview) nonempty real `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.  
2. `SMTP_FROM=info@adeptfragrances.com` (authorized sender; user may differ).  
3. `COMPANY_EMAIL=info@adeptfragrances.com`  
4. `SALES_EMAIL=info@adeptfragrances.com`  
5. No extra mailboxes.

### Safe test procedure (**PREPARED** — do not run against shared DB until SMTP ready / isolation preferred)

1. Set secrets in Vercel (authorized).  
2. One identifiable **test** inquiry (clearly marked).  
3. Confirm DB row + reference.  
4. Confirm `NotificationDelivery` EMAIL = `SENT`.  
5. Confirm **actual** `info@` inbox message.  
6. Confirm body has reference + inquiry type.  

All six required before claiming email works.

---

## E. Database separation steps

**Current risk:** Live public inquiries and Preview/tests share **one** Prisma Postgres.

### Variables / fallbacks (**VERIFIED** in code)

| Consumer | Keys (first nonempty wins) |
|----------|----------------------------|
| Runtime `src/lib/db.ts` | `DATABASE_URL`, `DATABASE_URL_PRISMA_DATABASE_URL`, `DATABASE_URL_DATABASE_URL`, `DATABASE_URL_POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL` |
| Build `scripts/build-with-db.mjs` | Same candidate list (+ loads local `.env` if unset) |
| Prisma CLI migrate | `DATABASE_URL` (after resolution) |
| Vitest integration | Local `.env` `DATABASE_URL` |
| Playwright e2e | Local `npm start` → local `.env` (writes **local** DB if run) |

**Silent Preview→Production path today:** Preview env vars point at the **same** store as Production → any Preview inquiry API hits live DB.

### Proposed architecture (**PREPARED**, not executed)

| Env | Database |
|-----|----------|
| Production | Keep `prisma-postgres-purple-drum` **unchanged** |
| Preview | **New empty** staging Postgres (Preview-only) |

### Procedure gates (**REQUIRES AUTHORIZATION** at each billable/connect step)

1. Production backup + reference snapshot (authorized shell).  
2. Create empty staging store (**billable** → stop until approved).  
3. Attach staging store to **Preview only**.  
4. Ensure Production `DATABASE_URL*` unchanged.  
5. Remove Preview use of production store / conflicting overrides.  
6. `prisma migrate deploy` **only** with staging URL (`RUN_DB_MIGRATE` or explicit CLI).  
7. No customer data seed.  
8. Verify Production inquiry refs unchanged.  
9. Redeploy Preview only.

**This task did not create a database or change connections.**

---

## F. Deployment-control settings

### Observed

- Push/`main` → Production build → domains auto-assigned → **public updates**.  
- This session avoided further git pushes to reduce accidental live updates.

### Human dashboard plan (**PREPARED** — do not flip without approval)

1. Vercel → Project **adept** → **Settings** → **Environments** → **Production** → **Branch Tracking**.  
2. **Disable “Auto-assign Custom Production Domains”**.  
3. `main` still builds Production artifacts; domains stay on current deployment until **Promote**.  
4. Approve → Deployment **⋯ → Promote** (or `vercel promote <url>` after authorization).  
5. Keep Preview for development; SSO remains on deployment URLs.  
6. Rollback: promote/rollback to a known prior Production deployment in the UI.  
7. Optional: GitHub branch protection + PR reviews on `main` (GitHub settings — separate auth).

**Do not** disconnect domains, change DNS, pause the site, or alter Git link in this phase.

---

## G. Backup and recovery status

| Item | Status |
|------|--------|
| App backup script | **VERIFIED** runnable against reachable DB URL |
| Local backup age | Session-local under `/backups/` (gitignored) — **local only** |
| Hosted backup coverage | Provider-managed Prisma Postgres — dashboard PITR/backups **assumed available, not drill-tested** |
| Encryption / access | Provider secrets; not independently audited here |
| Restore instructions | Documented in `docs/STAGING_DATABASE_ISOLATION.md` |
| Restore test | **RESTORE NOT VERIFIED** |
| Preview SSO vs customer data | Preview URLs SSO-protected; **API still writes to shared DB** if called with bypass — data risk remains until isolation |

No live customer dumps into unprotected folders this session.

---

## H. Actual verification results (this session)

| Check | Result |
|-------|--------|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm test` | **23/23 PASS** (local DB) |
| `npm run build` / `test:e2e` | **Not run** — avoid unnecessary migrate/deploy confusion; e2e starts local server and can write **local** DB (safe) but was skipped to keep session minimal |
| Public homepage HTTP | **200** |
| Four divisions + `info@` on public site | **VERIFIED** |
| No new test inquiries submitted to shared Production DB | **Honored** |

---

## I. Changes made

| Change | Notes |
|--------|--------|
| `docs/INQUIRY_MONITORING.md` | Created — manual monitoring procedure |
| `PRODUCTION_STABILIZATION_ACTION_PLAN.md` | This document |
| Infrastructure / Vercel / DNS / DB / SMTP / Git | **None modified** |
| Git push | **None** |

---

## J. Actions requiring explicit authorization

| # | Action | Why |
|---|--------|-----|
| 1 | Disable Production **Auto-assign Custom Production Domains** | Stops silent public releases on every `main` push |
| 2 | Set real Production/Preview **SMTP_*** secrets; prove inbox delivery | Unblocks `info@` notifications |
| 3 | Operator **read-only** hosted inquiry classification + follow-up | Catch genuine leads while mail is down |
| 4 | Provision **Preview-only** empty staging database (billable) | Stop tests/Preview from writing to live DB |
| 5 | Retarget Preview env vars; migrate staging only | Complete isolation |
| 6 | Optional: GitHub PR required + promote-only workflow | Process control |
| 7 | Provider restore **drill** on non-prod copy | Prove recovery |

---

## Action buckets

### 1. Safe actions already completed

- Read-only baseline of public deployment, Preview, DB sharing, SSO, SMTP failure mode  
- Local typecheck / lint / unit+integration tests  
- Public content spot-check  
- Manual inquiry monitoring doc  
- This action plan  

### 2. Manual operational actions (no infra change)

- Opening / mid-day / closing inquiry checks per `docs/INQUIRY_MONITORING.md`  
- Secure ops log of reviewed `ADF-…` references  
- Manual customer contact from `info@` when genuine leads appear  

### 3. Infrastructure changes requiring approval

- SMTP secret population + six-point delivery proof  
- Staging DB create + Preview-only wiring  
- Disable auto-assign production domains + promote workflow  
- Verified backup/restore drill  

---

## Stop

Stabilization **not** complete. Present authorization items **1–7** above for human decision. No further development roadmap.  
