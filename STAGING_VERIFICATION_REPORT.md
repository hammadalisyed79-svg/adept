# STAGING VERIFICATION REPORT — ADEPT Fragrances

**Date:** 2026-09-21  
**Updated:** 2026-09-21 (single official email configuration)  
**Public brand:** ADEPT Fragrances  
**Configured domain (proposed public):** adeptfragrances.com  
**ERP:** NOT MODIFIED / NOT CONNECTED  

---

## Verdict

| Gate | Status |
|------|--------|
| **Local staging verification** | **COMPLETE** |
| **Private hosted staging** | See `HOSTED_STAGING_STATUS.md` (preview URL exists; protection enabled) |
| **Official business email** | **info@adeptfragrances.com** (only mailbox — display + notifications) |
| **Email inbox delivery** | **NOT CONFIRMED** — SMTP credentials not available in this environment |
| **Public production deploy** | **NOT PERFORMED** (forbidden / not authorized) |
| **READY FOR PUBLIC LAUNCH** | **NO** |

---

## Amendment — Single email configuration (2026-09-21)

Business decision: ADEPT has **one** official email address for all purposes.

| Item | Value |
|------|--------|
| Display / contact email | `info@adeptfragrances.com` |
| Notification recipient (`SALES_EMAIL`) | `info@adeptfragrances.com` |
| Intended `SMTP_FROM` (when authorized) | `info@adeptfragrances.com` |
| Removed / not used | `sales@`, `samples@`, `manufacturing@` |
| Extra mailboxes created | **None** |

`SALES_EMAIL` is retained in env/code **only** for compatibility with the existing mail module; it must equal `info@adeptfragrances.com`. Inquiry **types** in Postgres remain separate (`FRAGRANCE_TRADING`, `PACKAGING_COMPONENTS`, `TOLL_MANUFACTURING`, `PRIVATE_LABEL`, `GENERAL`). Existing inquiry rows and references are preserved.

---

## 1. Brand / contact configuration

| Setting | Value |
|---------|--------|
| Brand | ADEPT Fragrances |
| Domain config | `https://www.adeptfragrances.com` |
| `COMPANY_DOMAIN_VERIFIED` | `false` |
| `COMPANY_EMAIL` | `info@adeptfragrances.com` |
| `SALES_EMAIL` | `info@adeptfragrances.com` |

Mailbox existence was **not** independently verified in this session. The address is the configured official contact only.

---

## 2. Domain / DNS verification (read-only)

Unchanged from prior staging pass: DNS resolves; current public site is **not** this B2B codebase. **No DNS changes. No public deploy.**

---

## 3. Staging database

| Item | Result |
|------|--------|
| Local DB | Postgres `127.0.0.1:5433` / `adept_website` |
| Migrations | Applied including packaging fields migration; existing inquiries retained |

---

## 4. SMTP / email notification logic

| Item | Result |
|------|--------|
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | **Not set** in local env |
| Notification recipient (code default) | `info@adeptfragrances.com` |
| `SMTP_FROM` default (when unset) | `info@adeptfragrances.com` |
| SMTP_USER must equal From? | **No** — auth identity may differ |
| Inbox delivery test | **NOT PERFORMED** — no SMTP credentials / mailbox access |

When SMTP is supplied, expected secret-store values:

```
COMPANY_EMAIL=info@adeptfragrances.com
SALES_EMAIL=info@adeptfragrances.com
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=          # may differ from From
SMTP_PASS=
SMTP_FROM=info@adeptfragrances.com
```

Unit/integration tests confirm: blocked path still saves inquiries; when SMTP is present but unreachable, delivery recipient recorded as `info@adeptfragrances.com`.

---

## 5. Inquiry routing (categories preserved)

Notifications all go to **info@**; commercial triage uses `inquiryType` in the database / email subject:

- `FRAGRANCE_TRADING`
- `PACKAGING_COMPONENTS`
- `TOLL_MANUFACTURING`
- `PRIVATE_LABEL`
- `GENERAL`

No separate mailboxes per category.

---

## 6. Automated test results (single-email update)

| Command | Result |
|---------|--------|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | **23/23 passed** |
| Inbox receipt | **Not claimed** — SMTP credentials unavailable |

---

## 7. Hosted staging / public launch

Public production deploy **not** performed. Hosted preview details: `HOSTED_STAGING_STATUS.md`. ERP remains **NOT CONNECTED**.

---

## 8. Remaining blockers

| Blocker | Impact |
|---------|--------|
| SMTP credentials unavailable | Outbound notifications **BLOCKED** / SKIPPED |
| Actual `info@` inbox receipt not confirmed | Cannot claim email delivery |
| Telephone / WhatsApp / address / legal / photography | Public launch blockers |
| Public DNS cutover | Requires explicit authorization |
| ERP API | Intentionally NOT CONNECTED |

---

## 9. Public launch readiness

**NOT READY FOR PUBLIC LAUNCH.**

Local app verification and single-email configuration are complete. Real inbox delivery remains blocked until SMTP credentials and mailbox access are provided.
