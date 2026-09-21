# Database Setup

## Requirements

- PostgreSQL 14+ (16 recommended)
- Connection string in `DATABASE_URL`

## Local setup

1. Create a database and user:

```sql
CREATE USER adept WITH PASSWORD 'adept';
CREATE DATABASE adept_website OWNER adept;
GRANT ALL PRIVILEGES ON DATABASE adept_website TO adept;
```

2. Copy environment template:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL`, for example:

```
DATABASE_URL="postgresql://adept:adept@localhost:5432/adept_website?schema=public"
```

4. Generate client and run migrations:

```bash
npm run db:generate
npx prisma migrate deploy
```

For local development with migration creation:

```bash
npx prisma migrate dev --name init
```

## Models

- `BusinessInquiry` — lead / quotation inquiry (unique `reference`)
- `InquiryActivity` — audit events
- `NotificationDelivery` — email / ERP delivery attempts
- `RateLimitBucket` — persistent rate-limit counters

## Notes

- Do not seed production with fake customer inquiries.
- Inquiry records are never exposed via public pages or public APIs.
- Only `POST /api/inquiries` accepts inquiry input; there is no public list endpoint.
