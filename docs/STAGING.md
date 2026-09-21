# Staging Preparation

## Verdict target

Staging may go live once PostgreSQL and environment variables are set.  
Public launch remains blocked until business contacts, legal review, and domain verification are complete (see `LAUNCH_READINESS_REPORT.md`).

## 1. Provision staging database

1. Create a PostgreSQL 14+ database (managed or VM).
2. Store the connection string only in the host secret store / `.env` (never in git).
3. Run migrations:

```bash
npm ci
npx prisma migrate deploy
```

## 2. Required environment variables

| Variable | Staging requirement |
|----------|---------------------|
| `DATABASE_URL` | **Required** |
| `NEXT_PUBLIC_SITE_URL` | Staging URL (e.g. `https://staging.adeptfragrances.com` or host preview URL) |
| `COMPANY_DOMAIN` | `https://www.adeptfragrances.com` (proposed; ownership not assumed) |
| `COMPANY_DOMAIN_VERIFIED` | `false` until DNS ownership confirmed |
| `COMPANY_EMAIL` / `SALES_EMAIL` | Both **info@adeptfragrances.com** (single official mailbox; `SALES_EMAIL` kept for mail-code compatibility) |
| `COMPANY_TELEPHONE` / `COMPANY_WHATSAPP` | Set only when verified (omit placeholders) |
| `COMPANY_ADDRESS` / `COMPANY_ADDRESS_VERIFIED` | Leave empty / `false` until verified |
| `COMPANY_LEGAL_NAME` / `COMPANY_LEGAL_NAME_VERIFIED` | Keep unverified (`false`) |
| `IP_HASH_SALT` | Long random string unique to staging |
| `SMTP_*` | Optional for staging; if unset, email is **BLOCKED** (inquiries still save) |
| `ERP_API_URL` / `ERP_API_KEY` | Leave empty → ERP **NOT CONNECTED** |

Copy from `.env.example` and fill secrets in the staging host.

## 3. Build and run

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

## 4. Staging smoke checklist

- [ ] `/` loads; brand shows **ADEPT Fragrances**
- [ ] Mobile menu works
- [ ] Each service + industry page loads
- [ ] Submit quote form → confirmation reference `ADF-…`
- [ ] Row visible via secure DB access (`docs/INQUIRY_RETRIEVAL.md`)
- [ ] If SMTP unset: `notificationStatus = SKIPPED` and activity `NOTIFICATION_BLOCKED`
- [ ] If SMTP set: test message received; status `SENT`
- [ ] `/api/inquiries` rejects GET (method not allowed / 405)
- [ ] No inquiry list UI on public site

## 5. Email status

| SMTP configured? | Behavior |
|------------------|----------|
| No | **BLOCKED** — inquiry saved; notification skipped with explicit error |
| Yes, delivery OK | Inquiry saved; email sent; status `SENT` |
| Yes, delivery fails | Inquiry **kept**; status `FAILED`; error logged in `NotificationDelivery` |
