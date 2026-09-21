# ADEPT Fragrances — Website

Premium B2B corporate website for fragrance trading, toll manufacturing, and private-label solutions.

**Public brand:** ADEPT Fragrances  
**Proposed domain:** [adeptfragrances.com](https://www.adeptfragrances.com) (ownership not assumed until verified)  
**Positioning:** Integrated fragrance sourcing and manufacturing solutions for ambitious brands.  
**Tagline:** Precision in Fragrance. Excellence in Manufacturing.

> Proposed legal name (`Adept Fragrance Industries (Private) Limited`) is **not verified**. Do not present it as an incorporated entity until confirmed.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma ORM
- Zod validation, persistent rate limiting, optional SMTP notifications
- ERP integration adapter (NOT CONNECTED until authorized API exists)
- Vitest + Playwright

## Quick start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### Setup

```bash
cp .env.example .env
# Edit DATABASE_URL and contact values

npm install
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit + integration tests (Vitest) |
| `npm run test:e2e` | Playwright e2e (requires build + DB) |
| `npm run db:migrate` | Prisma migrate (dev) |
| `npm run db:studio` | Prisma Studio (secure inquiry review) |

## Configuration

Company identity lives in `src/lib/company.ts` and is overridable via environment variables (see `.env.example`).

## Inquiry system

`POST /api/inquiries` validates input, applies honeypot + rate limiting, persists a `BusinessInquiry` with unique reference (`ADF-YYYYMMDD-XXXXXX`), then attempts email notification if SMTP is configured.

- If SMTP is missing → email is **BLOCKED**; inquiry remains in the database.
- If SMTP fails → inquiry is **retained**; failure is logged.
- There is **no** public list/read API for inquiries.

See `docs/INQUIRY_RETRIEVAL.md` and `docs/STAGING.md`.

## Documentation

- [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- [docs/DATABASE.md](./docs/DATABASE.md)
- [docs/STAGING.md](./docs/STAGING.md)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- [docs/ERP_INTEGRATION.md](./docs/ERP_INTEGRATION.md)
- [docs/INQUIRY_RETRIEVAL.md](./docs/INQUIRY_RETRIEVAL.md)
- [docs/PRIVATE_CONTENT_CHECKLIST.md](./docs/PRIVATE_CONTENT_CHECKLIST.md)
- [FINAL_IMPLEMENTATION_REPORT.md](./FINAL_IMPLEMENTATION_REPORT.md)
- [LAUNCH_READINESS_REPORT.md](./LAUNCH_READINESS_REPORT.md)

## Brand note

BWY is a separate consumer perfume brand and is intentionally excluded from this site.
