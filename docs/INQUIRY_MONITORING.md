# Inquiry Monitoring (Manual) — ADEPT Fragrances

**Status:** Operational procedure while SMTP/inbox delivery is **blocked**  
**Official mailbox:** info@adeptfragrances.com  
**Do not rely on email notifications until delivery is proven.**

This is **manual** monitoring. There is no automatic monitor, CRM, or public inquiry dashboard.

---

## Principles

1. Inquiries are stored in PostgreSQL (`BusinessInquiry`) even when email is skipped/failed.  
2. Use **read-only** database access when possible.  
3. **Never** put customer emails, phones, or names in Git, markdown reports, or chat logs.  
4. Record only **reference numbers** (`ADF-…`) in any shared/git-safe notes.  
5. Contact customers only via authorized sales staff using `info@` (or verified phone/WhatsApp when configured).  
6. Do **not** treat `notificationStatus = SKIPPED` alone as “test inquiry.”

---

## Schedule (until inbox delivery is confirmed)

| When | Action |
|------|--------|
| Business opening | List latest inquiries; review any new since last check |
| Mid business day | Repeat check |
| Business closing | Final check; escalate unfinished genuine leads |

---

## Secure tools

| Tool | Use |
|------|-----|
| Prisma Studio | `npm run db:studio` with **Production** `DATABASE_URL` in a secured shell only |
| SQL (read-only role preferred) | See queries below |
| Classifier (optional) | `node scripts/classify-inquiries-safe.mjs` — prints refs/counts only, no PII |

**Connection:** Obtain Production database URL from Vercel dashboard / secret store. Do not paste it into tickets or commits.

---

## A. List latest inquiries (no PII in exports)

```sql
SELECT
  reference,
  "inquiryType",
  status,
  "notificationStatus",
  "erpSyncStatus",
  "createdAt",
  "sourcePage"
FROM "BusinessInquiry"
ORDER BY "createdAt" DESC
LIMIT 50;
```

In Prisma Studio: open `BusinessInquiry`, sort by `createdAt` descending.

---

## B. New inquiries since previous check

Keep a local watermark (reference or timestamp) in the **secure ops log** (not Git).

```sql
SELECT
  reference,
  "inquiryType",
  status,
  "notificationStatus",
  "createdAt"
FROM "BusinessInquiry"
WHERE "createdAt" > TIMESTAMPTZ 'YYYY-MM-DD HH24:MI:SS+00'  -- last check time
ORDER BY "createdAt" ASC;
```

Or: note the newest `reference` from the last check; review all rows created after that.

---

## C. Failed or skipped notifications (still may be genuine)

```sql
SELECT
  reference,
  "inquiryType",
  status,
  "notificationStatus",
  "createdAt"
FROM "BusinessInquiry"
WHERE "notificationStatus" IN ('SKIPPED', 'FAILED', 'PENDING')
ORDER BY "createdAt" DESC
LIMIT 100;
```

Cross-check `NotificationDelivery` for channel `EMAIL`:

```sql
SELECT
  n."createdAt",
  n.status,
  n.error,
  i.reference,
  i."inquiryType"
FROM "NotificationDelivery" n
JOIN "BusinessInquiry" i ON i.id = n."inquiryId"
WHERE n.channel = 'EMAIL'
ORDER BY n."createdAt" DESC
LIMIT 50;
```

(`error` may contain system messages — do not copy customer fields.)

---

## D. Retrieve customer contact securely (authorized staff only)

In Prisma Studio, open the row by `reference`.  
Or:

```sql
SELECT
  reference,
  "contactName",
  "companyName",
  email,
  phone,
  country,
  "inquiryType",
  "productCategory",
  "projectDescription",
  status,
  "notificationStatus",
  "createdAt"
FROM "BusinessInquiry"
WHERE reference = 'ADF-YYYYMMDD-XXXXXX';
```

View results only on a secured workstation. **Do not** paste results into Git or public chat.

---

## E. Distinguishing test vs potentially genuine

Use **positive test evidence**, for example:

- Email domain `example.com` / known automation local-parts (`staging-smoke-`, `pw-`, `infra-audit-`, …)  
- Contact/company strings from known smoke tests (“Staging Smoke”, “Playwright”, “ADEPT Staging”, …)  
- Project text explicitly describing end-to-end / staging / infrastructure tests  

**Do not** mark as test only because:

- `notificationStatus` is `SKIPPED` or `FAILED`  
- Inquiry arrived during development hours  
- Type is `PACKAGING_COMPONENTS`

If unsure → treat as **potentially genuine** and have sales review.

---

## F. Reviewed-inquiry log (outside Git)

Create a file **outside the repository**, e.g.:

`%USERPROFILE%\.adept-ops\inquiry-review-log.csv`

Suggested columns (no emails/phones in shared copies):

| reviewedAt | reference | inquiryType | classification | action | reviewer |
|------------|-----------|-------------|----------------|--------|----------|
| ISO date | ADF-… | TYPE | genuine / test / unclear | emailed / called / none | initials |

Optional private column for contact notes may exist only in an encrypted/staff-only store — never commit it.

---

## G. If a genuine inquiry needs action

1. Authorized person opens the row securely.  
2. Contact the customer manually (email from `info@adeptfragrances.com` preferred).  
3. Update internal sales notes offline.  
4. Optionally set inquiry `status` in DB only if that process is authorized (default: leave status; track in ops log).  
5. Log the `reference` as reviewed.

---

## H. What this procedure is not

- Not automatic monitoring  
- Not a CRM  
- Not a substitute for working SMTP/inbox delivery  
- Not authorization to delete or bulk-edit inquiries  
