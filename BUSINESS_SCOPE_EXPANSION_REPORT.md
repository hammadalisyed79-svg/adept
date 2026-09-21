# BUSINESS SCOPE EXPANSION REPORT — ADEPT Fragrances

**Date:** 2026-09-21  
**Public brand:** ADEPT Fragrances  
**Scope:** Expand positioning to fragrance concentrates + packaging components + manufacturing / private label without rebuilding the application  
**ERP:** NOT CONNECTED / NOT MODIFIED  
**Public deploy:** NOT PERFORMED  

---

## Verdict

| Gate | Status |
|------|--------|
| Scope expansion implemented in existing app | **YES** |
| Packaging division + category pages | **YES** |
| Quotation catalogue structure (no invented SKUs) | **YES** — published catalogue empty until verified data |
| Inquiry form / API / DB additive packaging support | **YES** |
| Typecheck / lint / build / unit / integration / e2e | **PASS** |
| SMTP email delivery | **BLOCKED** — credentials still absent |
| Public production deploy | **NOT DONE** (not authorized) |

---

## Pages added

| Route | Purpose |
|-------|---------|
| `/packaging` | Packaging & Components division hub |
| `/packaging/perfume-bottles` | Category |
| `/packaging/caps` | Category |
| `/packaging/pumps-and-collars` | Category |
| `/packaging/labels-and-stickers` | Category |
| `/packaging/folding-cartons` | Category |
| `/packaging/rigid-boxes` | Category |
| `/packaging/accessories` | Category |
| `/packaging/complete-packaging-sets` | Category |
| `/catalogue` | Quotation-based B2B catalogue index |
| `/catalogue/[slug]` | Product detail (only for verified published items) |

Category content is driven by `src/content/packaging.ts` (extensible). Copy describes intended range; it does **not** claim stock or in-house manufacture of every item.

---

## Pages / surfaces updated

| Surface | Change |
|---------|--------|
| Homepage (`/`) | New section order: Hero → Introduction → Four divisions → Packaging collection → Industries → Complete brand solutions → How we work → Quality & sourcing → Quote CTA → Contact |
| About (`/about`) | Expanded positioning; four divisions; trading / sourcing / manufacturing distinction |
| Navigation (`src/lib/navigation.ts` + `Header`) | Solutions dropdown + Packaging & Components dropdown |
| Footer | Divisions include packaging; catalogue link; tagline updated |
| Request a Quote | `PACKAGING_COMPONENTS` type; packaging fields; metadata |
| Sitemap | Packaging + catalogue routes |
| Layout metadata | Uses company positioning (already centralised) |
| Quote CTA default copy | Mentions packaging |

**Headline / supporting copy (site-wide config):**

- Headline: *Everything You Need to Create a Fragrance Brand.*
- Supporting: *From fragrance concentrates and packaging components to complete manufacturing solutions, ADEPT supports your business from concept to finished product.*

**Four divisions:** Fragrance Trading · Packaging & Components · Toll Manufacturing · Private Label

---

## Catalogue structure

Maintainable file-based catalogue — no separate CMS/ERP:

- Source: `src/content/catalogue.ts`
- Shape: name, SKU, categorySlug, description, material, capacity/dimensions, finishes, customization, MOQ, image, specification URL, availabilityStatus, `verified`
- Publish rule: `verified === true` **and** `availabilityStatus !== "unpublished"`
- **Initial published products:** none (empty array by design — no invented SKUs, photos, MOQ, prices, or stock)

Retail cart intentionally not built. CTA paths lead to quotation.

---

## Inquiry changes

### New inquiry type

`PACKAGING_COMPONENTS` (Prisma enum + Zod + form)

### Selectable packaging categories (multi-select)

Perfume bottles, Caps, Pumps, Collars, Labels, Stickers, Folding cartons, Rigid boxes, Accessories, Complete packaging sets, Other packaging requirements

### Captured fields (additive)

Company, contact, email, telephone, country, industry, packaging categories, overall quantity/unit, capacity/size, material, colour/finish, customization / project details, delivery destination, optional bottle/component reference, matching notes, optional line items (quantity per item)

Compatibility language: matching notes accepted; **no claim of verified compatibility** until technical review.

### Preserved behaviour

- Existing fragrance / toll / private-label inquiry types and fields
- Inquiry references (`ADF-…`)
- Persistence, duplicate soft-guard, rate limiting
- Notification pipeline (still SKIPPED/BLOCKED without SMTP)
- ERP adapter remains NOT CONNECTED
- Existing inquiry rows retained (additive migration only)

---

## Database migrations

| Migration | Effect |
|-----------|--------|
| `20260921143000_packaging_inquiry_fields` | `ALTER TYPE "InquiryType" ADD VALUE 'PACKAGING_COMPONENTS'`; nullable columns on `BusinessInquiry`: `packagingCategories`, `deliveryDestination`, `componentReference`, `matchingRequirements`, `material`, `colourFinish`, `capacitySize`, `lineItemsJson` |

**Local validation:** `prisma migrate deploy` applied successfully against local Postgres (`adept_website` @ `127.0.0.1:5433`). Existing rows unchanged; new columns null until packaging inquiries arrive.

---

## Test results (executed)

| Check | Result |
|-------|--------|
| `npx prisma migrate deploy` | Pass |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run test` (Vitest unit + integration) | **21 passed** |
| `npm run build` (generate + migrate + next build) | Pass — packaging + catalogue routes in build output |
| `npm run test:e2e` (Playwright) | **8 passed** |

### Coverage highlights

- Unit: packaging inquiry validation (accept with categories/line items; reject empty packaging brief)
- Integration: packaging fields + `lineItemsJson` persisted; fragrance trading still works after schema expansion
- E2E: homepage headline/divisions; packaging + catalogue routes; private-label inquiry still succeeds; packaging inquiry succeeds (`ADF-…` returned)

SMTP remains blocked in local runs — inquiries save; email delivery is not claimed as working.

---

## Remaining business data required

Before publishing catalogue items or stronger commercial claims:

1. Verified product SKUs / references and specifications  
2. Approved product photography (rights-cleared; not third-party supplier imagery without permission)  
3. Confirmed MOQ, finishes, materials, and dimensions per SKU  
4. Specification documents (URLs or files)  
5. Availability status policy per item  
6. Verified legal entity name (still unverified)  
7. Verified address / telephone / WhatsApp if shown as live contacts  
8. Domain ownership proof before public cutover to adeptfragrances.com  

---

## Deployment blockers (unchanged / still open)

| Blocker | Status |
|---------|--------|
| SMTP (`SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` + sales mailbox) | **BLOCKED** — notifications SKIPPED |
| Hosted staging DATABASE_URL / Vercel env consistency | Previously documented; not re-deployed in this task |
| Public DNS / production promotion | **Not authorized** — not performed |
| ERP connection | **Not authorized** — adapter NOT CONNECTED |
| Legal / brand photography / verified catalogue content | Pending business input |

**This task did not deploy publicly and did not integrate ERP.**

---

## Implementation notes (non-goals respected)

- Application not rebuilt; features extended in place  
- No retail shopping cart  
- No invented product data  
- Manufacturing vs trading vs sourcing distinguished in copy  
- Packaging treated as an equal core division on homepage and navigation  
- Build script now loads local `.env` when process env lacks `DATABASE_URL` (local parity with Prisma CLI)

---

## Key files

- `src/lib/company.ts` — hero / positioning  
- `src/lib/navigation.ts` — nav + divisions  
- `src/content/packaging.ts` — category definitions  
- `src/content/catalogue.ts` — quotation catalogue  
- `src/lib/validation/inquiry.ts` — packaging validation  
- `prisma/schema.prisma` + `prisma/migrations/20260921143000_packaging_inquiry_fields/`  
- `src/app/packaging/**`, `src/app/catalogue/**`, `src/app/page.tsx`, `src/app/about/page.tsx`  
- `src/components/forms/InquiryForm.tsx`  
