# ADEPT Fragrance Industries — Project Plan

**Status:** In progress  
**Brand:** ADEPT · Fragrance Industries  
**Legal name (proposed, unverified):** Adept Fragrance Industries (Private) Limited  
**Positioning:** Integrated fragrance sourcing and manufacturing solutions for ambitious brands.

---

## 1. Project Scope

Build a production-ready B2B corporate website for fragrance trading and toll manufacturing:

- Marketing site (Home, About, Services, Industries, Process, Insights, Contact, Quote, Legal)
- Configurable company identity (no invented facts)
- B2B inquiry / quotation system with PostgreSQL persistence
- ERP integration adapter (NOT CONNECTED until API specs exist)
- SEO, security, accessibility, responsive UX
- Tests (unit, integration, e2e) and deployment documentation

**Out of scope:** CRM/ERP clone, admin CMS, fake credentials/history/certifications, BWY consumer branding, public deployment without authorization.

---

## 2. Architecture

```
Next.js 15 (App Router) + TypeScript + Tailwind CSS
├── app/                  # Routes, layouts, API routes
├── components/           # UI + layout + forms
├── lib/                  # Config, db, validation, rate-limit, mail, ERP
├── content/              # Static articles & industry copy
├── prisma/               # Schema + migrations
└── tests/                # Unit, integration, Playwright e2e
```

| Layer | Choice |
|-------|--------|
| Framework | Next.js App Router |
| Styling | Tailwind CSS + CSS variables |
| Validation | Zod (server + client) |
| Database | PostgreSQL via Prisma |
| Email | Nodemailer adapter (optional env) |
| ERP | Adapter interface; stub when unconfigured |
| Tests | Vitest + Playwright |

---

## 3. Page Inventory

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, divisions, industries, process preview, CTAs |
| `/about` | Corporate intro, mission/vision, philosophy (no invented history) |
| `/services/fragrance-trading` | Trading capabilities + sample CTA |
| `/services/toll-manufacturing` | Manufacturing capabilities + partner distinction |
| `/services/private-label` | Private-label journey + project CTA |
| `/industries` | Industry index |
| `/industries/[slug]` | Fine fragrance, personal care, home care, candles |
| `/process` | 8-step process |
| `/insights` | Article index |
| `/insights/[slug]` | Individual articles |
| `/contact` | Contact + inquiry form |
| `/request-quote` | Full quotation system |
| `/privacy` | Privacy policy (requires legal review) |
| `/terms` | Terms of use (requires legal review) |
| `/api/inquiries` | POST inquiry endpoint |

---

## 4. Database Structure

- **BusinessInquiry** — unique reference, type, contact, requirements, status, source, notification status
- **InquiryActivity** — audit trail of status/note events
- **NotificationDelivery** — email/ERP delivery attempts and outcomes

Statuses: `NEW`, `UNDER_REVIEW`, `SAMPLING`, `QUOTED`, `WON`, `LOST`

---

## 5. Integration Strategy

1. Persist every inquiry in website DB (system of record until ERP connected).
2. `ErpAdapter` interface: createCustomer, createLead, syncInquiry, updateStatus, attachQuotationRef.
3. `NullErpAdapter` / `NotConnectedErpAdapter` when env missing — log + mark `erpSyncStatus: NOT_CONNECTED`.
4. Document required ERP API contracts in `docs/ERP_INTEGRATION.md`.

---

## 6. Implementation Phases

| Phase | Work | Status |
|-------|------|--------|
| 0 | Repo audit, PROJECT_PLAN | Done |
| 1 | Next.js scaffold, Tailwind, company config, layout | Done |
| 2 | All marketing pages + content | Done |
| 3 | Prisma schema, migrations, inquiry API | Done |
| 4 | Forms, rate limit, notifications, ERP adapter | Done |
| 5 | SEO (metadata, sitemap, robots, JSON-LD) | Done |
| 6 | Tests, lint, build, fix defects | Done |
| 7 | README, deploy docs, FINAL_IMPLEMENTATION_REPORT | Done |

---

## 7. Acceptance Criteria

- [x] All listed routes render with real content (no lorem ipsum)
- [x] Company details loaded from centralized config
- [x] Quote/contact forms validate server-side; persist with unique reference
- [x] Rate limiting + spam honeypot active
- [x] Success only when DB save succeeds
- [x] ERP marked NOT CONNECTED when unconfigured
- [x] Legal pages marked as requiring review
- [x] `npm run build`, lint, typecheck, unit/integration/e2e pass or documented failures
- [x] `.env.example` with dummy values only
- [x] No BWY branding; no invented company credentials

---

## 8. Private Content Checklist (unconfirmed)

Do **not** publish until verified:

- [ ] Legal entity registration / incorporation status
- [ ] Registered office address
- [ ] Production telephone / WhatsApp numbers
- [ ] Production email addresses
- [ ] Domain / production URL
- [ ] Social profile URLs
- [ ] Factory / lab photography rights
- [ ] Certifications, capacity, years in business, awards
- [ ] ERP API credentials and endpoints
- [ ] SMTP / transactional email credentials
- [ ] Legal review of Privacy Policy and Terms

---

## Progress Log

- 2026-09-21: Empty repository confirmed. Plan created. Implementation starting.
- 2026-09-21: Full site implemented. Prisma migration applied. Typecheck, lint, build, 12 Vitest tests, and 6 Playwright e2e tests passed. FINAL_IMPLEMENTATION_REPORT.md written.
