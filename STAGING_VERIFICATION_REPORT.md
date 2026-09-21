# STAGING VERIFICATION REPORT — ADEPT Fragrances

**Date:** 2026-09-21  
**Public brand:** ADEPT Fragrances  
**Configured domain (proposed public):** adeptfragrances.com  
**ERP:** NOT MODIFIED / NOT CONNECTED  

---

## Verdict

| Gate | Status |
|------|--------|
| **Local staging verification** | **COMPLETE** |
| **Private hosted staging URL** | **NOT DEPLOYED** — no authorized hosting credentials/CLI available |
| **Email delivery to sales@** | **BLOCKED** — SMTP credentials not supplied |
| **Public production deploy** | **NOT PERFORMED** (forbidden / not authorized) |
| **READY FOR PUBLIC LAUNCH** | **NO** |

---

## 1. Brand configuration

| Setting | Value |
|---------|--------|
| Brand | ADEPT Fragrances |
| Domain config | `https://www.adeptfragrances.com` |
| `COMPANY_DOMAIN_VERIFIED` | `false` (ownership not asserted by this process) |
| `COMPANY_EMAIL` | `info@adeptfragrances.com` |
| `SALES_EMAIL` | `sales@adeptfragrances.com` |

Mailbox existence was **not** verified. Addresses are configured as intended recipients only.

---

## 2. Domain / DNS verification (read-only)

Checked without purchasing or changing DNS.

| Check | Result |
|-------|--------|
| `adeptfragrances.com` A | Resolves to `13.248.243.5`, `76.223.105.230` |
| `www.adeptfragrances.com` | CNAME → `adeptfragrances.com` |
| NS | `ns07.domaincontrol.com`, `ns08.domaincontrol.com` (GoDaddy-style) |
| MX | `smtp.secureserver.net` (pref 0), `mailstore1.secureserver.net` (pref 10) |
| HTTPS `https://www.adeptfragrances.com` | HTTP 200 — **existing live site** titled “Adept Fragrances” with retail perfume copy |

**Interpretation:** DNS is active and the name resolves. This does **not** prove legal ownership to this agent, and the current public site is **not** this B2B Next.js codebase.  

**Action taken:** No DNS changes. No deploy to the public production domain.

---

## 3. Staging database

| Item | Result |
|------|--------|
| Authorized remote staging Postgres credentials in environment | **Not found** |
| Database used for verification | Local authorized Postgres `127.0.0.1:5433` / `adept_website` |
| `npx prisma migrate deploy` | **Passed** — `1 migration found`, **No pending migrations to apply** |

Remote/managed staging Postgres can be attached later by setting `DATABASE_URL` only (never commit secrets).

---

## 4. SMTP / email

| Item | Result |
|------|--------|
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | **Not set** |
| Configured sales recipient | `sales@adeptfragrances.com` |
| Inbox delivery test | **BLOCKED** — cannot claim delivery |

When SMTP is supplied, expected env (values via secret store only):

```
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SALES_EMAIL=sales@adeptfragrances.com
COMPANY_EMAIL=info@adeptfragrances.com
```

---

## 5. Customer inquiry workflow test (executed)

Flow exercised against local production build (`next start` on port 3005):

1. Customer POST `/api/inquiries` (quotation-style fragrance trading request)  
2. Server Zod validation  
3. Persist to PostgreSQL  
4. Unique reference generated  
5. Email attempt → **blocked** (no SMTP)  
6. Inbox confirmation → **not possible**

### Inquiry test reference

**`ADF-20260921-BA878C`**

| Field | Value |
|-------|--------|
| Email (submitter) | `staging-verifier@example.com` |
| Type | `FRAGRANCE_TRADING` |
| `notificationStatus` | `SKIPPED` |
| `erpSyncStatus` | `NOT_CONNECTED` |
| EMAIL delivery row | `SKIPPED` — `EMAIL_NOTIFICATIONS_BLOCKED: SMTP is not configured…` |
| ERP delivery row | `SKIPPED` — not connected |

API response: `ok: true` with the reference above. Inquiry **was not lost**.

---

## 6. Automated test results (re-run this session)

| Command | Result |
|---------|--------|
| `npx prisma migrate deploy` | Passed (no pending) |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | **18/18 passed** |
| `npm run build` | Passed (Next.js 16.3.5) |
| `npm run test:e2e` | **7/7 passed** |

Additional E2E success reference from suite: `ADF-20260921-C3F629` (also email-blocked).

---

## 7. Hosted staging deployment

| Item | Status |
|------|--------|
| Vercel / Railway / Fly / Netlify / GH CLI | **Not available** on this machine |
| Git `origin` remote | **None** |
| Deploy credentials in environment | **None** |
| Private staging URL | **Not deployed** |

### Exact steps when hosting access is provided

1. Create a **private** staging host (preview app) — do **not** point `adeptfragrances.com` at it until authorized cutover.  
2. Provision managed PostgreSQL; set `DATABASE_URL` in host secrets.  
3. Set:
   - `NEXT_PUBLIC_SITE_URL=<private-staging-url>`
   - `COMPANY_EMAIL=info@adeptfragrances.com`
   - `SALES_EMAIL=sales@adeptfragrances.com`
   - `COMPANY_DOMAIN=https://www.adeptfragrances.com`
   - `COMPANY_DOMAIN_VERIFIED=false`
   - `IP_HASH_SALT=<long random>`
   - SMTP vars when ready  
4. Release command sequence:
   ```bash
   npm ci
   npx prisma migrate deploy
   npm run build
   npm run start
   ```
5. Smoke: submit quote → confirm `ADF-…` in DB → if SMTP set, confirm inbox at `sales@adeptfragrances.com`.  
6. Keep ERP disconnected until separately authorized.

---

## 8. Remaining blockers

| Blocker | Impact |
|---------|--------|
| No authorized hosted staging credentials | No private staging URL |
| SMTP credentials unavailable | Sales email **BLOCKED** |
| Mailbox existence for info@ / sales@ not confirmed | Operational follow-up |
| Public domain currently serves a different retail site | Cutover must be planned; do not overwrite without authorization |
| Telephone / WhatsApp / address / legal review / photography | Public launch blockers |
| ERP API | Intentionally NOT CONNECTED |

---

## 9. Public launch readiness

**NOT READY FOR PUBLIC LAUNCH.**

Local staging verification of the B2B app (build, DB migrations, inquiry persistence, tests) is complete. Hosted private staging and real sales-email delivery remain blocked on missing authorized infrastructure and SMTP.

---

## 10. Missing access checklist (for ops)

Provide via secure channel (not chat/git):

- [ ] Hosting account + deploy token (or connect git remote)  
- [ ] Managed Postgres `DATABASE_URL` for staging  
- [ ] SMTP credentials capable of sending to `sales@adeptfragrances.com`  
- [ ] Confirmation that `info@` / `sales@` mailboxes exist  
- [ ] Explicit authorization before any DNS change affecting `adeptfragrances.com`
