# INFRASTRUCTURE EXECUTION RESULT — ADEPT Fragrances

**Date:** 2026-09-22  
**Project:** `adept` (`prj_lZU3OW1vbzNdMjyburPzE73ooqCt`) · Team: `hammad-fedc`  
**Authorization used:** A (manual Production promotion) · B (Preview DB cost investigate only)  
**Not done (C):** DB purchase/provision, GUI merge, git push, Production deploy/promote, DNS, Production DB, SMTP, ERP  

---

## Classification

| Area | Status |
|------|--------|
| Production baseline capture | **COMPLETED** |
| Manual promotion setting change | **COMPLETED** |
| Public site / domain safety after change | **VERIFIED** |
| Release control (setting + documented promote path) | **PARTIALLY VERIFIED** |
| Staging database cost investigation | **COMPLETED** (pricing only) |
| Database provisioning / isolation | **NOT STARTED** — **REQUIRES SEPARATE APPROVAL** |
| GUI RC freeze preservation | **VERIFIED** |
| Production stabilization (overall) | **NOT COMPLETE** (SMTP + DB isolation still pending) |

**Release control note:** Auto-assign is disabled and read back as `false`. End-to-end proof that a new `main` build stays off custom domains was **not** demonstrated (no test push/deploy, per authorization). Classification remains **PARTIALLY VERIFIED**.

---

## 1. Production setting — before / after

| Control | Before | After |
|---------|--------|-------|
| API field `autoAssignCustomDomains` | `true` (`updatedBy: system`) | `false` (`updatedBy: vRuy9e0hkAQ5OQvMeVj1k8Hx`) |
| UI equivalent (current docs) | Settings → Environments → Production → Branch Tracking → **Auto-assign Custom Production Domains** | Same toggle **OFF** |
| Production branch | `main` | `main` (unchanged) |
| Git integration / create deployments | enabled | enabled (unchanged) |
| Domains disconnected? | — | **No** |
| Deploy / promote triggered by this change? | — | **No** |

**Documented behavior (Vercel Promoting Deployments):** with auto-assign off, Production-branch builds stage without taking custom domains; explicit **Promote** assigns production domains without rebuild. Current aliases remain on the existing deployment until promote/rollback.

---

## 2. Public deployment ID — before / after

| | Value |
|--|-------|
| Before | `dpl_8auMn3xZJW9ADvBwGuuNc9UNbKpH` (`adept-po7qvuxts-hammad-fedc.vercel.app`) |
| After | `dpl_8auMn3xZJW9ADvBwGuuNc9UNbKpH` (**unchanged**) |
| Rollback reference | **Same ID** — record as current public Production |

Production commit on that deployment: `d96381f58cbc5f5a7cff63b6ab13a9606829451d` (`main`).

---

## 3. Website availability — before / after

| Check | Before | After |
|-------|--------|-------|
| `https://www.adeptfragrances.com/` | HTTP **200** | HTTP **200** |
| `https://adeptfragrances.com/` | HTTP **308** → `https://www.adeptfragrances.com/` | HTTP **308** → www (unchanged) |
| HTML `data-dpl-id` | `dpl_8auMn3xZJW9ADvBwGuuNc9UNbKpH` | `dpl_8auMn3xZJW9ADvBwGuuNc9UNbKpH` |

---

## 4. Domain assignment verification

Project domains (unchanged):

| Domain | Verified | Notes |
|--------|----------|-------|
| `www.adeptfragrances.com` | Yes | Serves current Production deployment |
| `adeptfragrances.com` | Yes | Redirect → www |
| `adept-indol.vercel.app` | Yes | Project Production alias |

Also still aliased to the same deployment: `adept-hammad-fedc.vercel.app`, `adept-git-main-hammad-fedc.vercel.app`.

DNS was **not** modified. Misconfigured flag: false.

SSO protection remains `all_except_custom_domains` (custom domains stay public).

---

## 5. Manual promotion configuration status

- **Auto-assign Custom Production Domains:** **DISABLED** (API confirmed).
- **Future custom-domain releases:** require explicit **Promote** (or authorized `vercel promote` / rollback) per current Vercel docs.
- **Still automatic:** Git builds on `main` can still create Production **target** deployments / `.vercel.app` aliases; they should **not** auto-take `www` / apex while this setting stays off.
- **Other domain-update paths (not automatic Git):** manual Promote, Rollback, or explicit alias commands — process discipline still required.
- **Overall release control:** **PARTIALLY VERIFIED** (config + docs; no live promote-gate demonstration).

---

## 6. Database provider and confirmed pricing

**Current Production/Preview store (shared — do not change):**

| Item | Value |
|------|-------|
| Provider | **Prisma Postgres** (Vercel Marketplace) |
| Store name | `prisma-postgres-purple-drum` |
| Store id | `store_KtXMAUbnv6UZNedj` |
| Environments attached | **preview, production** (not isolated) |
| Installation plan (account API) | **Free** · `paymentMethodRequired: false` · cost **Free** |
| API plan details shown | 100K monthly operations · 500MB total storage · max 50 databases |
| Public pricing page (prisma.io/pricing, fetched 2026-09-22) | Free **$0/mo** · **200k** ops/mo · **500 MB** · **50 databases** · no payment method · **no paid backups on Free** |

**Recommended Preview-only option (same provider):** create a **second Prisma Postgres** database under the existing Free installation (quota is **installation-scoped** — ops/storage shared with the existing DB).

| Plan | Monthly base | Ops included | Ops overage | Storage included | Storage overage | Backups | Payment method | DB limit |
|------|--------------|--------------|-------------|------------------|-----------------|---------|----------------|----------|
| **Free** | **$0** | 200k (public page) / 100K (API detail on current install) | None listed | 500 MB total | None listed on Free | — | Not required | 50 |
| Starter | **$10** | 1M | $8 / million | 10 GB | $2.00 / GB | Daily, 7-day | Required for paid | 1,000 |
| Pro | **$49** | 10M | $2 / million | 50 GB | $1.50 / GB | Daily, 7-day | Required | 1,000 |
| Business | **$129** | 50M | $1 / million | 100 GB | $1.00 / GB (page) | Daily, 30-day | Required | 1,000 |

Sources: Vercel storage API for current install; https://www.prisma.io/pricing for published plan table. **Exact incremental monthly cost of a second Free DB:** **$0 base**, subject to shared Free quotas (ops/storage). Exact combined usage cost cannot be projected without usage data — do not invent a usage bill.

---

## 7. Free / lower-cost alternatives

| Option | Base cost | Notes |
|--------|-----------|-------|
| **Second Prisma Postgres on Free** (preferred match to current stack) | **$0** | Fits isolation procedure; shares Free quotas with Production store; no backups on Free |
| Prisma Starter (paid) | **$10/mo** + usage | If staging needs backups / higher quotas |
| Neon Launch (already used on this Vercel team for other projects) | Usage-based; **payment method required** | API quote on existing Neon stores: storage **$0.35/GB-mo**, compute **$0.106/CU-hour** — not $0 base; different product |

**No database was created.** No plan was upgraded.

---

## 8. Database provisioning status

**NOT STARTED** — awaiting explicit cost approval before any Create / Provision / attach / env / migrate work.

---

## 9. GUI branch / freeze commit

| Item | Result |
|------|--------|
| Branch | `gui-visual-upgrade` (current local branch) |
| Freeze commit | `ec61682a81449f8a56b2b44a6b4a86cbdb9fa5c2` — **present** (`Freeze GUI RC: quote mobile panel order and accessories flag.`) |
| Merge / push / deploy / promote | **Not performed** |

---

## 10. Prepared isolation actions (NOT EXECUTED) — after separate approval

Target: Production keeps `prisma-postgres-purple-drum`; Preview gets a new independent store.

**Env vars / fallbacks that must resolve to Preview-only credentials** (`src/lib/db.ts` order):

1. `DATABASE_URL`  
2. `DATABASE_URL_PRISMA_DATABASE_URL`  
3. `DATABASE_URL_DATABASE_URL`  
4. `DATABASE_URL_POSTGRES_URL`  
5. `POSTGRES_PRISMA_URL`  
6. `POSTGRES_URL`  
7. `PRISMA_DATABASE_URL`  

Today all injected `DATABASE_URL*` secrets are attached to **Preview and Production**. After provisioning: connect new store to **Preview only**; remove or override Preview attachment of the Production store; leave Production env untouched. Ensure no Preview fallback still points at the Production store (first nonempty candidate wins).

**Verification steps (post-approval only):**

1. Compare store IDs / hostnames securely (no connection strings in reports).  
2. `prisma migrate deploy` against staging URL only (`RUN_DB_MIGRATE` gated).  
3. Re-run Production inquiry reference check (`pre-migrate-safety.mjs`) — counts/refs unchanged.  
4. Submit test inquiries on Preview only.  
5. Confirm those refs do **not** appear in Production.

---

## 11. Errors / unresolved risks

| Risk | Status |
|------|--------|
| Shared Preview + Production database | **Still open** — isolation not started |
| SMTP / inquiry email delivery | **Still pending** (out of this phase) |
| Free-plan ops figure API (100K) vs public page (200k) | Minor display mismatch — treat Free as $0 with published quotas from pricing page; confirm in Marketplace UI before provision |
| Release control not live-proven with a staged `main` build | Acceptable under no-test-deploy rule; prove on next intentional Production build |
| GUI RC still local / not on Production | By design — freeze preserved |

**Incidents during setting change:** none. Site remained on the same deployment throughout.

---

## STOP

Authorized release-control change applied and checked. Database pricing investigated. **No provisioning.**  

**Awaiting your explicit approval** before creating a Preview-only database (recommend: Prisma Postgres **Free** second store under existing install, unless you prefer Starter/Pro or Neon).
