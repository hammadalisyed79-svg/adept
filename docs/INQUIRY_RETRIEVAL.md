# Secure Inquiry Retrieval (Until ERP Is Connected)

**Status:** Email notifications are **BLOCKED** until SMTP environment variables are configured.  
Inquiries are **always persisted** in PostgreSQL first. They do not disappear if email fails or is blocked.

Do **not** build a CRM in the website. Use secure database access only.

## Principles

1. There is no public HTTP endpoint to list or read inquiries (`POST /api/inquiries` only).
2. Treat the database as confidential commercial data.
3. Prefer read-only credentials for sales review accounts.
4. Never commit dumps, screenshots with PII, or `.env` files.

## Option A — Prisma Studio (local / bastion only)

```bash
# On a secured machine with DATABASE_URL pointing at staging
npm run db:studio
```

Open `BusinessInquiry`, sort by `createdAt` descending. Filter by `notificationStatus`:

| Status | Meaning |
|--------|---------|
| `SENT` | Notification delivered to info@adeptfragrances.com |
| `SKIPPED` | SMTP not configured (blocked) |
| `FAILED` | SMTP configured but delivery failed |
| `PENDING` | Unexpected — investigate |

Also review `InquiryActivity` (`NOTIFICATION_BLOCKED`, `NOTIFICATION_FAILED`) and `NotificationDelivery`.

Bind Studio to localhost only; do not expose it to the public internet.

## Option B — Read-only SQL

Grant a sales-ops role `SELECT` on inquiry tables only:

```sql
SELECT reference, "inquiryType", status, "contactName", "companyName",
       email, phone, country, industry, "productCategory",
       "estimatedQuantity", "quantityUnit", "projectDescription",
       "notificationStatus", "erpSyncStatus", "createdAt"
FROM "BusinessInquiry"
ORDER BY "createdAt" DESC
LIMIT 50;
```

Never grant public or anonymous DB access.

## Option C — Email (when unblocked)

Official mailbox (display + notifications): **info@adeptfragrances.com**  
Do not create `sales@`, `samples@`, or `manufacturing@` mailboxes.

Set:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASS` (auth identity — need not equal From)
- `SMTP_FROM=info@adeptfragrances.com` (once the provider authorizes this From address)
- `COMPANY_EMAIL=info@adeptfragrances.com`
- `SALES_EMAIL=info@adeptfragrances.com` (retained for code compatibility; same mailbox)

Then submit a test inquiry and confirm:

1. Row exists in `BusinessInquiry` (inquiry type still distinguishes trading / packaging / manufacturing)
2. `notificationStatus = SENT`
3. Message arrives in the **info@adeptfragrances.com** inbox

If SMTP is missing, `getMailConfigStatus()` returns `BLOCKED_NOT_CONFIGURED` and delivery records show `SKIPPED` with an explicit blocked error string.

## Incident: “Did we lose an inquiry?”

1. Search DB by email or approximate time — not by whether email arrived.
2. If row exists and email is `SKIPPED`/`FAILED`, the inquiry is safe; fix notification channel.
3. If no row exists, the submitter saw an error (or never submitted successfully).
