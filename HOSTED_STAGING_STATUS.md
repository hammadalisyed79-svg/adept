# HOSTED STAGING STATUS — ADEPT Fragrances

**Updated:** 2026-09-21  
**ERP:** NOT MODIFIED / NOT CONNECTED  
**Public DNS (`adeptfragrances.com`):** NOT CHANGED by this deploy (no `vercel --prod`)

---

## Verdict

| Item | Status |
|------|--------|
| **Staging URL** | **https://adept-4j0mtvuah-hammad-fedc.vercel.app** (Vercel **preview**) |
| **Deployment protection** | **Enabled** (anonymous browser access blocked; CLI bypass used for tests) |
| **Database** | **Connected** — Prisma migrate applied to hosted Postgres (`db.prisma.io`) |
| **Migration** | `20260921083213_init` applied (then “no pending” on later builds) |
| **Inquiry API** | **Verified** — reference **`ADF-20260921-C668E7`** |
| **Email → info@ inbox** | **NOT VERIFIED** — cannot claim delivery; see Email section |
| **Production / adeptfragrances.com** | **Not deployed** (`vercel --prod` not run) |
| **READY FOR PUBLIC LAUNCH** | **NO** |

---

## What succeeded

1. Vercel CLI authenticated to team **hammad-fedc**, project **adept**.
2. Preview deployment built and reached **Ready**.
3. Homepage HTML confirmed brand **ADEPT Fragrances** and `info@adeptfragrances.com`.
4. `/request-quote` returned HTTP 200 via protected access.
5. `POST /api/inquiries` returned:
   ```json
   {"ok":true,"reference":"ADF-20260921-C668E7","message":"Thank you..."}
   ```
6. Hosted DB migrations ran during build using `DATABASE_URL_PRISMA_DATABASE_URL` (primary `DATABASE_URL` was empty).

---

## Email delivery

**Policy (2026-09-21):** single official mailbox `info@adeptfragrances.com` for all display and inquiry notifications. Do not use `sales@`, `samples@`, or `manufacturing@`.

| Check | Result |
|-------|--------|
| `SMTP_*` keys present in Vercel env | Yes (Preview + Production) — values not re-verified this pass |
| `SALES_EMAIL` / `COMPANY_EMAIL` | Must both be `info@adeptfragrances.com` |
| Mailbox existence for `info@` | **Not independently verified** |
| Actual inbox receipt for `ADF-20260921-C668E7` | **Not confirmed** |
| Claim “email sent” | **Not made** |

**Status: EMAIL DELIVERY UNVERIFIED.**  
If SMTP secrets are empty placeholders, outbound mail will be skipped/failed while the inquiry remains in Postgres. Confirm in Neon/Prisma tables (`notificationStatus`, `NotificationDelivery`) and the `info@adeptfragrances.com` inbox.

---

## Database notes

- Build log: `Datasource "db": PostgreSQL database "postgres" at "db.prisma.io:5432"`.
- Empty `DATABASE_URL` on Vercel was worked around via `scripts/build-with-db.mjs` + runtime resolution in `src/lib/db.ts` preferring `DATABASE_URL_PRISMA_DATABASE_URL`.
- **Recommended fix in Vercel dashboard:** set `DATABASE_URL` to the same nonempty Prisma/Neon connection string so tooling is simpler.

---

## Domain / DNS (dashboard observation)

Your Vercel Domains UI shows `adeptfragrances.com` / `www.adeptfragrances.com` configured with **No Deployment** until a production deploy.  

This session intentionally used **preview only** so those production domains were not updated.

---

## How to open the staging site

1. Open https://adept-4j0mtvuah-hammad-fedc.vercel.app  
2. Complete Vercel Deployment Protection login (team member / password / SSO as configured).  
3. Or use `npx vercel curl <url>` from an authenticated CLI for smoke tests.

---

## Remaining launch blockers

- Confirm SMTP credentials are real and delivery to `info@adeptfragrances.com`  
- Confirm the `info@` mailbox exists (only official address)  
- Set nonempty `DATABASE_URL` (and preferably `NEXT_PUBLIC_SITE_URL` for the staging host)  
- Set Vercel `COMPANY_EMAIL` and `SALES_EMAIL` both to `info@adeptfragrances.com`  
- Telephone / WhatsApp / address / legal review / photography  
- Explicit authorization before `vercel --prod` / attaching traffic to `adeptfragrances.com`  
- ERP still NOT CONNECTED  

---

## Missing only if you need more

- Inbox confirmation screenshot or DB row for email `SENT`  
- Explicit go-ahead for production promotion
