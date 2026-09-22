# PRODUCTION SAFETY ACTIONS — ADEPT Fragrances

**Date:** 2026-09-21  
**Mode:** Read-only audit (no deploy, no DNS change, no DB credential change, no commits pushed)  
**Official email:** info@adeptfragrances.com  
**Verdict:** Publicly exposed and receiving traffic — **not production-ready** until SMTP, inquiry ops, DB isolation, and release control are fixed.

---

## 1. Public exposure status

| Check | Result |
|-------|--------|
| `https://www.adeptfragrances.com/` | **LIVE** — HTTP 200, ADEPT B2B site (hero + divisions + `info@`) |
| `https://adeptfragrances.com/` | **308** → www |
| Serves B2B (not old retail) | **YES** |
| Current Production aliases | `adeptfragrances.com`, `www.adeptfragrances.com`, `adept-indol.vercel.app` → latest Production deployment |
| Live traffic | **YES** — Production logs show public `GET` on pages including `/request-quote`, `/packaging`, `/contact` |

### Why Git pushes update the public domain

1. Project is Git-connected; pushes to **`main`** create **Production** deployments.  
2. **Auto-assign Custom Production Domains** is effectively **on** (default): successful Production builds are assigned to `adeptfragrances.com` / `www`.  
3. SSO protection is `all_except_custom_domains` — custom domains stay **publicly reachable**.

**This audit did not change routing.**

---

## 2. Outstanding genuine inquiries

### Access limitation (this session)

Vercel **secret pull is blocked** for agents (`SMTP_*` / hosted `DATABASE_URL*` unavailable locally). Hosted inquiry rows therefore could not be fully re-queried from this environment without printing secrets.

### What is known (no PII)

| Source | Finding |
|--------|---------|
| Hosted runtime logs | Multiple `POST /api/inquiries` with `EMAIL_NOTIFICATIONS_BLOCKED` and known **test** references (`ADF-20260921-FA864E`, `7A3C7F`, `7DEFA7`, `5ACF70`, `812440`, earlier `C668E7`) |
| Local Postgres (dev) classification | **45** rows; **45** test/staging; **0** potentially genuine (heuristic) |
| Confirmed genuine customer inquiries on hosted DB | **NONE confirmed** from available evidence |
| Genuine inquiries needing follow-up | **NONE identified** in the known set |

**Do not treat “0 confirmed” as proof the hosted DB has zero real customers** until an authorized operator runs a full read against Production.

### Secure procedure until email works

1. Use a secured machine; set Production `DATABASE_URL` in the shell only (never commit).  
2. Prefer read-only DB role if available.  
3. Run: `node scripts/classify-inquiries-safe.mjs` → counts + `ADF-…` refs only (no emails/names).  
4. Or: `npm run db:studio` / SQL from `docs/INQUIRY_RETRIEVAL.md`, filter `status = NEW`, sort `createdAt DESC`.  
5. Follow up any **non-test** `NEW` / `SKIPPED` / `FAILED` rows manually via `info@`.  
6. Never expose customer PII in chat, tickets, or git.

---

## 3. SMTP blocker

| Variable | Production evidence |
|----------|---------------------|
| `COMPANY_EMAIL` / `SALES_EMAIL` | Intended: **info@adeptfragrances.com** (configured in prior pass) |
| `SMTP_FROM` | Should be **info@adeptfragrances.com** |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | **Missing or unusable at runtime** |
| Runtime proof | Logs: `EMAIL_NOTIFICATIONS_BLOCKED: SMTP is not configured` (e.g. ref `ADF-20260921-812440`) |
| Inbox delivery | **NOT WORKING** — do not claim success |

**Required to become operational (no extra mailboxes):**

1. Provider SMTP that may send as / to `info@adeptfragrances.com`.  
2. Set nonempty Production (and Preview) `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.  
3. Keep `SMTP_FROM=info@adeptfragrances.com` (`SMTP_USER` may differ).  
4. Submit one real test quote; confirm row + `notificationStatus=SENT` + **actual inbox receipt**.

---

## 4. Database separation procedure

**Current:** Store `prisma-postgres-purple-drum` connected to **preview + production** → **shared**.

**Authorized steps (do not execute without approval):**

1. Backup: `npm run db:backup:inquiries` + `node scripts/pre-migrate-safety.mjs` (Production URL).  
2. Create **new** Prisma Postgres store for staging only — **do not delete** current store.  
3. Connect new store to project **Preview only**.  
4. Leave Production `DATABASE_URL*` pointing at current store.  
5. Migrate staging only (`prisma migrate deploy` / one-off `RUN_DB_MIGRATE` on Preview).  
6. Verify Production reference list unchanged.  
7. Redeploy Preview; confirm new inquiries land in staging DB.

Detail: `docs/STAGING_DATABASE_ISOLATION.md`.

---

## 5. Production deployment control procedure

**Goal:** Git may still **build** Production, but must **not** auto-serve on `adeptfragrances.com` without approval.

| Step | Where | Action |
|------|--------|--------|
| 1 | Vercel → Project **adept** → **Settings** → **Environments** → **Production** → **Branch Tracking** | **Disable “Auto-assign Custom Production Domains”** |
| 2 | After each `main` build | Verify staged Production URL (SSO-protected deployment URL) |
| 3 | When approved | Deployment **⋯ → Promote** (or `vercel promote <url>`) |
| 4 | Optional | Add Deployment Checks / CI gate before promote |
| 5 | Keep | SSO on deployment URLs; custom domains remain public by design once promoted |

**Do not** disconnect domain or pause Production without separate authorization (site is live).

---

## 6. Actions requiring authorization

| # | Action | Risk if skipped |
|---|--------|-----------------|
| A | Disable auto-assign custom Production domains | Every `main` push keeps updating the **live** public site |
| B | Supply working SMTP for `info@` and confirm inbox | Customers get no email; rely on DB-only follow-up |
| C | Operator run hosted inquiry classification (read-only) | Unknown genuine leads may sit unworked |
| D | Provision Preview-only staging DB | Test traffic continues to write into Production DB |
| E | Explicit promote-only release process | Unreviewed code can go public |

---

## Operational status (plain)

- Website is **public** and **browseable**.  
- Quotation forms can **save** inquiries to the shared DB.  
- Email notifications are **blocked**.  
- Release control is **automatic** (unsafe for intentional production ops).  
- Staging and Production data are **not isolated**.

**Not claimed:** production-ready, email working, or zero genuine inquiries on hosted without a full Production DB read.
