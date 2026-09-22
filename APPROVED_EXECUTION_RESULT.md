# APPROVED EXECUTION RESULT — ADEPT Fragrances

**Date:** 2026-09-22  
**Authorization:** User “approve all” after controlled infra phases  

---

## Classification

| Workstream | Status |
|------------|--------|
| Manual Production promotion (auto-assign off) | **COMPLETED** / **PARTIALLY VERIFIED** (no test gate deploy) |
| Preview-only Free Prisma Postgres | **COMPLETED** |
| DB isolation (Preview ≠ Production) | **VERIFIED** |
| Staging migrations | **COMPLETED** |
| SMTP delivery | **BLOCKED** — secrets exist but are **empty**; mailbox password not available |
| GUI merge + Production promote | *in progress / see final section* |
| DNS / Production DB delete / ERP / paid upgrade | **NOT DONE** (not required) |

---

## Database isolation

| | Production | Preview (staging) |
|--|------------|-------------------|
| Store | `prisma-postgres-purple-drum` (`store_KtXMAUbnv6UZNedj`) | `adept-staging-postgres` (`store_damIXxKrVMmE3tpT`) |
| Plan | Free (existing) | Free (**$0**) |
| Env attachment | **production** only | **preview** only |
| Identity fingerprint (user suffix) | `…673b6b` | `…4efe06` |
| Inquiry count after migrate | **8** (unchanged) | **0** (empty after migrate) |

Production inquiry references unchanged after staging migrate:

`ADF-20260921-B4367A`, `99CE00`, `812440`, `5ACF70`, `7DEFA7`, `7A3C7F`, `FA864E`, `C668E7`

Env layout:

- Production: `DATABASE_URL` + `DATABASE_URL_*` → purple-drum  
- Preview: `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL` → staging  

---

## SMTP

| Finding | Detail |
|---------|--------|
| Keys on Vercel | Present for Production + Preview |
| API read of values | **Empty strings** for HOST/PORT/SECURE/USER/PASS/FROM |
| Local `.env` | No SMTP credentials |
| Runtime behavior | `EMAIL_NOTIFICATIONS_BLOCKED` until nonempty `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` |

**Required from you to finish email:** GoDaddy (or provider) password for `info@adeptfragrances.com` (and confirm SMTP host, typically `smtp.secureserver.net` / port `587`). Do not paste the password into chat if you prefer — set it in Vercel → Project → Settings → Environment Variables.

---

## Rollback / public baseline (pre-promote)

- Public deployment: `dpl_8auMn3xZJW9ADvBwGuuNc9UNbKpH`  
- `www` HTTP 200; apex 308 → www  
- `autoAssignCustomDomains`: **false**

---

## GUI

- Branch: `gui-visual-upgrade`  
- Freeze commit: `ec61682a81449f8a56b2b44a6b4a86cbdb9fa5c2` (preserved in history)
