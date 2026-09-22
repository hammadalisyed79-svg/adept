# TECHNOLOGY & GROWTH IMPLEMENTATION — ADEPT Fragrances

**Branch:** `feature/technology-growth` (local only — not merged, not pushed)  
**Date:** 2026-09-22  
**Base:** `main` @ `b9b1cd7eef85a95e487c5b1f92f15fed04c2e8fd`

---

## Environment verified (before implementation)

| Check | Live evidence |
|-------|----------------|
| Local branch (start) | `main` |
| Local HEAD | `b9b1cd7…` |
| Public www deployment | `dpl_BNCfeh2TLWFaQkhz2io2EWoKBZnd` |
| Production commit on www | `9adf97d…` (GUI promote; docs commit after remains staged) |
| `autoAssignCustomDomains` | **false** |
| Preview DB | `adept-staging-postgres` → preview |
| Production DB | `prisma-postgres-purple-drum` → production |
| Live site | Unchanged by this work (no deploy / promote / push) |

---

## Pages added

| Route | Purpose |
|-------|---------|
| `/technology` | Division overview + three service cards |
| `/technology/erp` | ERP Solutions |
| `/technology/website-development` | Website Development |
| `/technology/digital-marketing` | Digital Marketing |

Existing fragrance / packaging / manufacturing / private-label routes unchanged in behavior.

---

## Navigation changes

- New primary item **Technology & Growth** with dropdown: Overview · ERP Solutions · Website Development · Digital Marketing  
- Existing Solutions and Packaging menus **unchanged**  
- Footer Divisions: added **Technology & Growth** link (four core `divisions` array unchanged)  
- Header child hints added for technology routes  
- Sitemap: four new static routes

---

## Homepage section

Four core division cards **preserved**.

New charcoal section (after divisions):

- Eyebrow: **BEYOND MANUFACTURING**  
- Headline: **Build the Brand. Power the Business.**  
- Supporting copy as specified  
- Three visual cards: ERP · Website Development · Digital Marketing  
- CTA to `/technology`

---

## Actual services described

### ERP
Custom development and third-party implementation; inventory; sales & purchasing; production workflows; manufacturing operations support; finance & reporting; system integrations. Clarifies custom vs third-party; no proprietary product brand claim.

### Website development
Corporate, B2B, ecommerce, catalogues, quotation sites, ERP/website integration where APIs allow.

### Digital marketing
Brand strategy, social, creative content, SEO, digital advertising, campaign management — **no** ranking/ROI/sales guarantees.

---

## Unverified claims excluded

- Named proprietary ERP product  
- Completed client implementations / portfolios / testimonials  
- Certifications  
- Marketing performance results / ROI promises  
- Live website↔ERP sync as a customer deliverable (site adapter remains **NOT CONNECTED** per `docs/ERP_INTEGRATION.md`)  
- Fictional campaign metrics  

Imagery: abstract SVG placeholders under `/public/images/adept/technology-*.svg` (flagged for replacement with approved assets).

---

## Inquiry routing

| Path | Behavior |
|------|----------|
| Technology CTAs | `mailto:info@adeptfragrances.com?subject=…` + Contact page |
| Existing quote form | Unchanged — types `FRAGRANCE_TRADING`, `TOLL_MANUFACTURING`, `PRIVATE_LABEL`, `PACKAGING_COMPONENTS` only |
| SMTP | Not assumed operational; email CTAs open the user mail client |

### Schema / API changes — **BLOCKED** (documented only)

To add dedicated digital inquiry types without misclassifying as fragrance:

1. Prisma `InquiryType` enum — e.g. `TECHNOLOGY_ERP`, `TECHNOLOGY_WEBSITE`, `TECHNOLOGY_MARKETING` (or single `TECHNOLOGY_GROWTH`)  
2. Migration (`ALTER TYPE … ADD VALUE`)  
3. `src/lib/validation/inquiry.ts` `inquiryTypes`  
4. `InquiryForm` labels (+ optional field extras)  
5. Optional `/request-quote?type=…` deep links  

**Not performed** — requires separate authorization. Digital inquiries are **not** silently mapped to fragrance types.

---

## Screenshots

Directory: `visual-review/technology-growth/`

| File | Viewport |
|------|----------|
| `homepage__1440.png` / `homepage__390.png` | Desktop / mobile |
| `technology__1440.png` / `technology__390.png` | Overview |
| `technology-erp__1440.png` / `technology-erp__390.png` | ERP |
| `technology-website__1440.png` / `technology-website__390.png` | Website |
| `technology-marketing__1440.png` / `technology-marketing__390.png` | Marketing |
| `fragrance-trading__1440.png` | Existing route smoke |
| `packaging__1440.png` | Existing route smoke |

---

## Test results (local)

| Check | Result |
|-------|--------|
| `npm run typecheck` | **Pass** |
| `npm run lint` | **Pass** |
| `npm test` (23) | **Pass** |
| `npm run build` | **Pass** |
| Route smoke (local `:3456`) | `/`, `/technology`, `/technology/erp`, `/technology/website-development`, `/technology/digital-marketing`, `/services/fragrance-trading`, `/packaging`, `/request-quote`, `/contact` — all **HTTP 200** |
| Production DB tests | **Not run** (forbidden) |

---

## Remaining blockers

1. **SMTP** — not configured; inbox delivery not demonstrated  
2. **Dedicated inquiry types** — schema/API authorization pending  
3. **Replace SVG placeholders** with approved photography/licensed assets  
4. **Release** — merge / push / promote not performed (per instructions)  
5. **ERP customer integration** — still NOT CONNECTED (unchanged)

---

## Stop

Local implementation complete on `feature/technology-growth`. Live Production website preserved.
