# LAUNCH READINESS REPORT — ADEPT Fragrances

**Date:** 2026-09-21  
**Public brand:** ADEPT Fragrances  
**Proposed domain:** adeptfragrances.com (configured; ownership **not** assumed)  
**Legal name:** Adept Fragrance Industries (Private) Limited — **unverified**  
**Runtime verified:** Next.js **16.3.5** (project plan previously said 15 — corrected)

---

## Verdict

| Gate | Status |
|------|--------|
| **READY FOR STAGING** | **YES** — after staging Postgres + env vars are configured |
| **READY FOR PUBLIC LAUNCH** | **NO** |
| **BLOCKED (public)** | Missing verified contacts, SMTP (or accepted ops process), legal review, domain ownership proof, photography |

Staging is appropriate for internal/UAT traffic. Public launch remains blocked until business and legal items below are resolved.

---

## Corrections made during this audit

1. Public brand unified to **ADEPT Fragrances** (logo, metadata, copy, docs).
2. Proposed domain defaults set to `https://www.adeptfragrances.com` with `COMPANY_DOMAIN_VERIFIED` flag (default false).
3. Legal name kept configurable via env; remains unverified.
4. Placeholder telephone/WhatsApp no longer shown as live clickable contacts.
5. Email notifications explicitly marked **BLOCKED** when SMTP env is missing (`EMAIL_NOTIFICATIONS_BLOCKED…`); activity `NOTIFICATION_BLOCKED` recorded.
6. Post-save mail/ERP failures wrapped so a saved inquiry cannot be lost if side effects throw.
7. Added `docs/INQUIRY_RETRIEVAL.md` and `docs/STAGING.md` (secure DB retrieval — no CRM).
8. Reconciled docs to Next.js 16; expanded automated tests for mail blocked/failed paths.
9. `.env.example` updated for staging clarity.

---

## Verified working features

| Area | Evidence |
|------|----------|
| All marketing routes render | Build route table + Playwright page loads |
| Brand “ADEPT Fragrances” | E2E homepage + title checks |
| CTAs to quote/contact/services | E2E navigation + form submission |
| Inquiry validation (server Zod) | Unit + E2E validation failure |
| Inquiry DB persistence | Integration + E2E success with `ADF-…` reference |
| Unique references | Integration regex + E2E |
| Rate limiting | Integration test |
| Spam honeypot | Implemented on API (`website` field) |
| No public inquiry list | Only `POST` handler; E2E GET → 404/405 |
| Email blocked without SMTP | Unit + integration + E2E server log |
| Inquiry retained on SMTP failure | Integration test (`notificationStatus=FAILED`) |
| ERP NOT CONNECTED | Integration assert + adapter |
| Prisma migration valid | `prisma validate` passed |
| Security headers | `next.config.ts` |
| Desktop + mobile nav | Playwright desktop + 390×844 |

---

## Actual test results (2026-09-21)

| Command | Result |
|---------|--------|
| `npx prisma validate` | Passed |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed (0 warnings) |
| `npm test` | **18/18 passed** (13 unit + 5 integration) |
| `npm run build` | Passed — Next.js 16.3.5, 25 routes |
| `npm run test:e2e` | **7/7 passed** |

### Notes from live runs

- Without SMTP, successful submissions log: `EMAIL_NOTIFICATIONS_BLOCKED…` and still return a reference to the user.
- SMTP-to-`127.0.0.1:1` failure path confirmed inquiry retained with `FAILED` status.
- **Actual successful inbox delivery was not tested** — no authorized SMTP credentials were supplied. Status: **BLOCKED until SMTP configured**.

---

## Outstanding blockers

### BLOCKED for public launch

| Item | Status |
|------|--------|
| Company registration / legal entity verification | Missing |
| Verified public address | Missing |
| Confirmed production email mailboxes | Unverified (defaults are placeholders) |
| Production telephone | Missing (UI hides placeholder) |
| Production WhatsApp | Missing (UI hides placeholder) |
| Approved photographs | Missing (abstract compositions only) |
| Legal review of Privacy / Terms | Required |
| Domain ownership / DNS for adeptfragrances.com | Not verified |
| SMTP for sales alerts | **BLOCKED_NOT_CONFIGURED** |
| ERP sync | NOT CONNECTED (by design until authorized) |

### Acceptable for staging

- Placeholder/unverified email shown with caution note on Contact
- Email notifications blocked if SMTP unset (retrieve via DB — see docs)
- Abstract visuals instead of facility photography
- Legal drafts marked “LEGAL REVIEW REQUIRED”

---

## Required environment variables

### Required for staging

```
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=          # staging URL
IP_HASH_SALT=                  # unique random string
COMPANY_DOMAIN=https://www.adeptfragrances.com
COMPANY_DOMAIN_VERIFIED=false
COMPANY_LEGAL_NAME_VERIFIED=false
```

### Strongly recommended for staging

```
COMPANY_EMAIL=info@adeptfragrances.com
SALES_EMAIL=info@adeptfragrances.com
```

(`SALES_EMAIL` is retained for mail-code compatibility and must equal the single official mailbox.)

### Optional (unblocks email)

```
SMTP_HOST= SMTP_PORT= SMTP_SECURE=
SMTP_USER= SMTP_PASS= SMTP_FROM=
```

### Optional (when verified)

```
COMPANY_TELEPHONE=
COMPANY_WHATSAPP=
COMPANY_ADDRESS=
COMPANY_ADDRESS_VERIFIED=true
COMPANY_LEGAL_NAME=
COMPANY_LEGAL_NAME_VERIFIED=true
COMPANY_DOMAIN_VERIFIED=true
```

### Leave empty until authorized

```
ERP_API_URL=
ERP_API_KEY=
```

Never commit real `.env` values.

---

## Exact staging deployment steps

1. Provision PostgreSQL; create empty database.
2. Copy `.env.example` → host secrets; set `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `IP_HASH_SALT`.
3. On build host:
   ```bash
   npm ci
   npx prisma migrate deploy
   npm run build
   npm run start
   ```
4. Smoke-test: homepage brand, mobile menu, `/request-quote` submit → `ADF-…` reference.
5. Confirm row in DB (`docs/INQUIRY_RETRIEVAL.md`). Expect `notificationStatus=SKIPPED` until SMTP is set.
6. (Optional) Configure SMTP; submit test inquiry; confirm inbox + `SENT`.
7. Do **not** point public DNS or declare production launch until blockers above are cleared.

Full checklist: `docs/STAGING.md`.

---

## Security audit summary

| Control | Status |
|---------|--------|
| Server-side Zod validation + length limits | Verified |
| Honeypot field | Verified |
| Persistent rate limiting | Verified (DB + memory fallback) |
| No public GET/list of inquiries | Verified |
| Secrets not in client bundle (SMTP/ERP server-only) | Verified |
| `.env` gitignored; `.env.example` dummy-only | Verified |
| Security headers (CSP, frame, nosniff, referrer) | Present |
| Privacy/retention | Draft policy only — **legal review required** before public launch |

---

## Inquiry operations until ERP

1. Website DB is temporary system of record.
2. Email is **BLOCKED** without SMTP — inquiries still save.
3. Retrieve securely via Prisma Studio or read-only SQL (`docs/INQUIRY_RETRIEVAL.md`).
4. Do not build a website CRM.

---

## Missing business information (do not invent)

- Company registration status  
- Address  
- Confirmed email mailboxes  
- Telephone  
- WhatsApp  
- Approved photographs  
- Completed legal review  
- Production domain ownership verification  

---

## Final statements

- **READY FOR STAGING:** YES (with Postgres + env configuration).  
- **READY FOR PUBLIC LAUNCH:** NO.  
- **Email notifications:** BLOCKED until SMTP credentials are supplied and tested.  
- **ERP:** NOT CONNECTED.  
- **Domain adeptfragrances.com:** proposed in config; ownership not assumed.
