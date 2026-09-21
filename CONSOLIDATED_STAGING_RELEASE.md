# CONSOLIDATED STAGING RELEASE — ADEPT Fragrances

**Date:** 2026-09-21  
**Source commit:** `c5e455369390d6926e1d422be2b8efbfacb44821`  
**Brand:** ADEPT Fragrances  
**ERP:** NOT CONNECTED / NOT MODIFIED  
**Public DNS / `vercel --prod`:** NOT EXECUTED  

---

## Status legend (this release)

| Label | Meaning |
|-------|---------|
| **IMPLEMENTED** | Present in source on `main` |
| **DEPLOYED** | Live on protected Vercel Preview |
| **TESTED** | Verified in this session’s fresh runs |
| **UNVERIFIED** | Could not be confirmed (e.g. inbox) |
| **BLOCKED** | Missing credentials / authorization |

---

## 1. Exact staging URL

| Item | Value |
|------|--------|
| **Preview URL** | https://adept-efr2keu94-hammad-fedc.vercel.app |
| **Deployment protection** | **Enabled** (anonymous browser blocked; `vercel curl` used for tests) |
| **Environment** | **Preview** (not Production domain cutover) |

---

## 2. Deployment ID

| Item | Value |
|------|--------|
| **Deployment ID** | `dpl_2FCREbbHSDcTbtmV9otkYkBvBi2D` |
| **Inspector** | https://vercel.com/hammad-fedc/adept/2FCREbbHSDcTbtmV9otkYkBvBi2D |
| **Ready state** | READY |
| **Target** | preview |

---

## 3. Git commit / source version

| Item | Value |
|------|--------|
| **Commit** | `c5e4553` — *Stop automatic DB migrations on build and gate staging migrate.* |
| **Includes** | Packaging expansion (`4bc84ba`) + single-email (`c8f3005`) + migrate gate (`c5e4553`) |
| **Branch** | `main` @ `origin/main` |
| **Working tree at verify** | Clean before release commits for report/scripts |

Packaging and single-email changes are in the **same codebase**; neither was overwritten.

---

## 4. Four business divisions — verified

| Division | Route | Status |
|----------|-------|--------|
| Fragrance Trading | `/services/fragrance-trading` | **IMPLEMENTED · DEPLOYED · TESTED** (HTTP 200) |
| Packaging & Components | `/packaging` | **IMPLEMENTED · DEPLOYED · TESTED** (HTTP 200) |
| Toll Manufacturing | `/services/toll-manufacturing` | **IMPLEMENTED · DEPLOYED · TESTED** (HTTP 200) |
| Private Label | `/services/private-label` | **IMPLEMENTED · DEPLOYED · TESTED** (HTTP 200) |

Homepage shows “Four core business divisions” and hero *Everything You Need to Create a Fragrance Brand.* — **TESTED** on Preview.

---

## 5. Packaging pages & catalogue — verified

| Route | Status |
|-------|--------|
| `/packaging` | **TESTED** 200 |
| `/packaging/perfume-bottles` | **TESTED** 200 |
| `/packaging/caps` | **TESTED** 200 |
| `/packaging/pumps-and-collars` | **TESTED** 200 |
| `/packaging/labels-and-stickers` | **TESTED** 200 |
| `/packaging/folding-cartons` | **TESTED** 200 |
| `/packaging/rigid-boxes` | **TESTED** 200 |
| `/packaging/accessories` | **TESTED** 200 |
| `/packaging/complete-packaging-sets` | **TESTED** 200 |
| `/catalogue` | **TESTED** 200 — empty state “No published products yet”; **no invented** retail prices/stock/MOQ claims |

---

## 6. Database migration status

| Item | Result |
|------|--------|
| Host used by Preview build | `db.prisma.io:5432` (Postgres database `postgres`) |
| Shared with Vercel Production **env**? | **YES** — same `DATABASE_URL*` secrets are attached to Preview **and** Production |
| Shared with public `adeptfragrances.com`? | **NO cutover** — `vercel --prod` not run; public DNS not changed by this release |
| Auto-migrate on normal builds | **DISABLED** — `scripts/build-with-db.mjs` skips migrate unless `RUN_DB_MIGRATE=true` |
| One-off migrate gate | Set for this Preview deploy only, then **removed** from Preview env |
| Pre-migrate safety snapshot | **TESTED** — `inquiryCount: 1`, reference `ADF-20260921-C668E7` logged (no PII emails) |
| `prisma migrate deploy` on this deploy | **No pending migrations** — packaging migration already present on host |
| Migrations in repo | `20260921083213_init`, `20260921143000_packaging_inquiry_fields` |
| Local PII backup | **CREATED** under `/backups/` (gitignored) — 31 local inquiries; do not commit |

---

## 7. Existing inquiry preservation

| Check | Result |
|-------|--------|
| Historical hosted inquiry | `ADF-20260921-C668E7` present before migrate check |
| New packaging inquiry | `ADF-20260921-FA864E` — **TESTED** |
| Fragrance Trading | `ADF-20260921-7A3C7F` — **TESTED** |
| Toll Manufacturing | `ADF-20260921-7DEFA7` — **TESTED** |
| Private Label | `ADF-20260921-5ACF70` — **TESTED** |
| Types remain distinguishable | **YES** (`inquiryType` per record) |

---

## 8. Single-email configuration

| Setting | Status |
|---------|--------|
| Official mailbox | `info@adeptfragrances.com` |
| Vercel Preview `COMPANY_EMAIL` | Updated to `info@adeptfragrances.com` — **DEPLOYED** |
| Vercel Preview `SALES_EMAIL` | Updated to `info@adeptfragrances.com` — **DEPLOYED** |
| Vercel `SMTP_FROM` | Updated to `info@adeptfragrances.com` — **DEPLOYED** |
| Customer-facing `sales@` on Preview pages | **Absent** — **TESTED** (homepage/contact/packaging HTML) |
| `info@` on Preview pages | **Present** — **TESTED** |
| SMTP secrets readable via CLI pull | **BLOCKED** by Vercel secret pull policy in this agent context |
| SMTP functional (host/user/pass nonempty & valid) | **UNVERIFIED** at secret level |

Code defaults and notification routing remain `info@` (`src/lib/mail.ts`, `src/lib/company.ts`).

---

## 9. Actual inbox delivery result

| Check | Result |
|-------|--------|
| Submit inquiry on Preview | **TESTED** — four types returned `ADF-…` references |
| Email notification attempt | Side-effect runs after save (expected) |
| Delivery to live `info@` inbox | **UNVERIFIED** — no mailbox access; SMTP credential validity not independently confirmed |
| Claim “email delivered” | **NOT MADE** |

Local SMTP remains unset → local e2e shows `EMAIL_NOTIFICATIONS_BLOCKED` / SKIPPED. Hosted SMTP may differ; without inbox confirmation, status stays **UNVERIFIED**.

---

## 10. Complete test results (this session only)

### Local (fresh run)

| Command | Result |
|---------|--------|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm test` | **23/23 PASS** |
| `npm run build` | **PASS** (migrate skipped — as designed) |
| `npm run test:e2e` | **8/8 PASS** |

### Hosted Preview smoke (this session)

| Check | Result |
|-------|--------|
| 16 routes HTTP 200 | **PASS** |
| Four inquiry types create references | **PASS** |
| Catalogue empty / non-invented | **PASS** |
| `info@` present / `sales@` absent | **PASS** |

Script: `scripts/hosted-smoke.mjs`

---

## 11. Remaining production blockers

| Blocker | Label |
|---------|--------|
| Actual `info@` inbox delivery confirmation | **UNVERIFIED / BLOCKED** until SMTP + mailbox access proven |
| Telephone / WhatsApp / verified address | **BLOCKED** |
| Legal entity verification | **BLOCKED** |
| Approved photography / catalogue SKUs | **BLOCKED** (catalogue correctly empty) |
| Separate staging vs production database | **RISK** — Preview and Production env share DB secrets; isolate before public launch |
| Explicit authorization for `vercel --prod` / DNS cutover | **BLOCKED** (not done) |
| ERP connection | **BLOCKED** (intentionally NOT CONNECTED) |
| Vercel Git may create Production **environment** builds on push | Observed sibling Production deploys on `*.vercel.app` — **not** public domain; still avoid treating as launch |

---

## Customer journey (Preview) — executed

Homepage → Packaging & Components → category → quotation API → DB record + `ADF-…` reference → notification attempted → inbox **UNVERIFIED**.

Repeated for Fragrance Trading, Toll Manufacturing, Private Label — all **TESTED** with references above.

Desktop page loads **TESTED**; mobile nav covered by local e2e **TESTED**.

---

## Public launch readiness

**NOT READY FOR PUBLIC LAUNCH.**

| Gate | Status |
|------|--------|
| Consolidated staging Preview | **DEPLOYED · TESTED** |
| Packaging + single-email combined | **IMPLEMENTED · DEPLOYED · TESTED** |
| Inbox delivery | **UNVERIFIED** |
| Public production | **NOT DEPLOYED** |

No further development phase started beyond this consolidation release.
