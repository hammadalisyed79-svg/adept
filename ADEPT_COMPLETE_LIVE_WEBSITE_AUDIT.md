# ADEPT Complete Live Website Audit

**Site:** https://www.adeptfragrances.com  
**Audited:** 2026-09-22  
**Public deployment (at audit):** `dpl_Gw1Rkmxk6jbXq4p27hwnQNYRtFuB`  
**Method:** Live-only Playwright crawl + full-page screenshots (1440×900 and 390×844) + HTTP/SEO/DOM checks  
**Artifacts:** `visual-review/live-complete-audit/` (`audit-raw.json`, `analysis.json`, `screenshots/`)  
**Constraint:** Audit only — no code, Git, database, DNS, SMTP, ERP, or deployment changes. **No Production inquiry submissions.**

---

## Executive summary

The live site is broadly coherent: luxury B2B branding is consistent, all discovered public routes return HTTP 200 (except intentional 404 tests), apex redirects correctly, robots/sitemap are present, forms validate client-side without submitting, Technology deep links select the correct service, and no broken images, horizontal overflow, or console/network failures were recorded in the automated pass.

**Confirmed issues are limited but real.** The highest-impact findings are: Technology inquiry URL missing from the sitemap; duplicated “What happens next” headings on both quotation pages; and the global header “Request a Quote” CTA always sending Technology visitors to the fragrance form.

---

## 1. Route discovery

### Sources

| Source | Result |
|--------|--------|
| `https://www.adeptfragrances.com/sitemap.xml` | **35** URLs |
| Header / Solutions / Packaging / footer link harvest | Additional discovery |
| Known inquiry deep links | Added `/technology/request-quote` (+ query variants for journey checks) |
| App routes vs sitemap | Live sitemap is authoritative for published URLs |

### Not in sitemap (but live HTTP 200)

| Path | Notes |
|------|-------|
| `/technology/request-quote` | Primary Technology quotation entry — **confirmed gap** |

### Query variants exercised (not separate sitemap URLs)

- `/technology/request-quote?type=erp`
- `/technology/request-quote?type=website`
- `/technology/request-quote?type=marketing`

### Infrastructure / negative tests

| Check | Result |
|-------|--------|
| `https://adeptfragrances.com` | **308** → `https://www.adeptfragrances.com/` |
| `/robots.txt` | Allow `/`; Disallow `/api/`; Sitemap declared |
| `/this-page-does-not-exist-audit-404` | **404**, title “Page not found \| ADEPT Fragrances”, links to Home + Request a Quote |
| `/catalogue/not-a-real-slug-xyz` | **404** |

**No `/catalogue/[slug]` product pages** are published (catalogue empty state only).

---

## 2. Screenshot inventory

**Directory:** `visual-review/live-complete-audit/screenshots/`  
**Count:** 80 PNG files (36 routes × desktop+mobile, plus form-validation and deep-link captures)

Naming:

- `{route-slug}__1440.png` — desktop full page  
- `{route-slug}__390.png` — mobile full page  
- `form-validation_*__1440.png` — empty/invalid submit state (no Production POST success)  
- `deeplink_{erp|website|marketing}__1440.png` — Technology service selection

---

## 3. Route-by-route audit table

Legend: **OK** = no confirmed defect on that check · **ISSUE** = see issue register · **REC** = recommendation only · **N/T** = not tested (by policy)

| # | URL | HTTP | Desktop shot | Mobile shot | Visual / brand | Layout overflow | Assets | Nav/CTAs | SEO (title/desc/H1/canonical) | A11y notes | Console / net | Notes |
|---|-----|------|--------------|-------------|----------------|-----------------|--------|----------|-------------------------------|------------|----------------|-------|
| 1 | `/` | 200 | `home__1440.png` | `home__390.png` | OK | OK | OK (21 imgs) | OK | Title lacks brand name → **ISSUE-04** | Skip link present | OK | Four core divisions exclude Technology (separate section) — REC |
| 2 | `/about` | 200 | `about__1440.png` | `about__390.png` | Text-heavy | OK | 0 photos | OK | H1 near-duplicate of home → **ISSUE-05** | OK | OK | Responsible disclaimers (no unverified claims) — positive |
| 3 | `/catalogue` | 200 | `catalogue__1440.png` | `catalogue__390.png` | Empty state clear | OK | OK | OK | OK | OK | OK | No SKUs — **REC-01** |
| 4 | `/contact` | 200 | `contact__1440.png` | `contact__390.png` | OK | OK | OK | OK | OK | OK | OK | Form lacks Technology service — **REC-02**; location unpublished (stated) |
| 5 | `/industries` | 200 | `industries__1440.png` | `industries__390.png` | OK | OK | OK | OK | OK | OK | OK | |
| 6 | `/industries/fine-fragrance` | 200 | `industries_fine-fragrance__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 7 | `/industries/personal-care` | 200 | `industries_personal-care__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 8 | `/industries/home-care-detergents` | 200 | `industries_home-care-detergents__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 9 | `/industries/candles-home-fragrance` | 200 | `industries_candles-home-fragrance__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 10 | `/insights` | 200 | `insights__1440.png` | `insights__390.png` | OK | OK | OK | OK | OK | OK | OK | |
| 11 | `/insights/fine-fragrance-vs-industrial-fragrance` | 200 | `insights_fine-fragrance-vs-*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 12 | `/insights/understanding-fragrance-concentration` | 200 | `insights_understanding-*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 13 | `/insights/private-label-perfume-manufacturing` | 200 | `insights_private-label-*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 14 | `/insights/fragrance-selection-for-detergents` | 200 | `insights_fragrance-selection-*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 15 | `/packaging` | 200 | `packaging__1440.png` | `packaging__390.png` | OK | OK | OK | OK | OK | OK | OK | |
| 16 | `/packaging/perfume-bottles` | 200 | `packaging_perfume-bottles__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 17 | `/packaging/caps` | 200 | `packaging_caps__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 18 | `/packaging/pumps-and-collars` | 200 | `packaging_pumps-and-collars__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 19 | `/packaging/labels-and-stickers` | 200 | `packaging_labels-and-stickers__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 20 | `/packaging/folding-cartons` | 200 | `packaging_folding-cartons__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 21 | `/packaging/rigid-boxes` | 200 | `packaging_rigid-boxes__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 22 | `/packaging/accessories` | 200 | `packaging_accessories__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 23 | `/packaging/complete-packaging-sets` | 200 | `packaging_complete-packaging-sets__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 24 | `/process` | 200 | `process__1440.png` | `process__390.png` | Text-heavy | OK | 0 photos | OK | OK | OK | OK | **REC-03** imagery |
| 25 | `/privacy` | 200 | `privacy__1440.png` | `privacy__390.png` | OK | OK | OK | OK | OK | OK | OK | Substantive policy present |
| 26 | `/terms` | 200 | `terms__1440.png` | `terms__390.png` | OK | OK | OK | OK | OK | OK | OK | Substantive terms present |
| 27 | `/request-quote` | 200 | `request-quote__1440.png` | `request-quote__390.png` | OK | OK | OK | OK | OK | Duplicate H2 → **ISSUE-02** | OK | Validation **OK** (N/T successful submit) |
| 28 | `/services/fragrance-trading` | 200 | `services_fragrance-trading__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 29 | `/services/toll-manufacturing` | 200 | `services_toll-manufacturing__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 30 | `/services/private-label` | 200 | `services_private-label__*` | same | OK | OK | OK | OK | OK | OK | OK | |
| 31 | `/technology` | 200 | `technology__1440.png` | `technology__390.png` | Abstract visuals | OK | CSS visuals | OK | OK | OK | OK | Repeated hero visual motif — **REC-04** |
| 32 | `/technology/erp` | 200 | `technology_erp__*` | same | Abstract visuals | OK | OK | Header CTA → fragrance form **ISSUE-03** | OK | OK | OK | |
| 33 | `/technology/website-development` | 200 | `technology_website-development__*` | same | Abstract visuals | OK | OK | Same CTA issue | OK | OK | OK | |
| 34 | `/technology/digital-marketing` | 200 | `technology_digital-marketing__*` | same | Abstract visuals | OK | OK | Same CTA issue | OK | OK | OK | |
| 35 | `/technology/ai-support` | 200 | `technology_ai-support__*` | same | Abstract visuals | OK | OK | Email CTA only | OK | OK | OK | No Technology form — **REC-05** (likely intentional) |
| 36 | `/technology/request-quote` | 200 | `technology_request-quote__*` | same | OK | OK | OK | OK | Missing from sitemap → **ISSUE-01** | Duplicate H2 → **ISSUE-02** | OK | Deep links OK; validation OK; N/T successful submit |

---

## 4. Quotation journey review (no Production submits)

| Journey | Entry | Service selection | Validation (empty / bad email) | Success submit | Evidence |
|---------|-------|-------------------|-------------------------------|----------------|----------|
| Fragrance / packaging / toll / private label | `/request-quote`, header CTA, many page CTAs | Select options: Fragrance Trading, Toll Manufacturing, Private Label, Packaging & Components | **Blocked** (invalid controls / alerts) | **N/T** | `form-validation_request-quote__1440.png` |
| Contact form | `/contact` | Same fragrance service set (no Technology) | Not re-driven beyond page load | **N/T** | Page screenshots |
| Technology ERP | `/technology/erp` → Discuss CTA / form `?type=erp` | `TECHNOLOGY_ERP` only | **Blocked** | **N/T** | `deeplink_erp__1440.png`, validation shots |
| Technology Website | `?type=website` | `TECHNOLOGY_WEBSITE` only | **Blocked** | **N/T** | `deeplink_website__1440.png` |
| Technology Marketing | `?type=marketing` | `TECHNOLOGY_MARKETING` only | **Blocked** | **N/T** | `deeplink_marketing__1440.png` |
| AI Support | `/technology/ai-support` | N/A — **mailto** CTA | N/A | N/A | Live HTML mailto with subject |

**Not claimed:** SMTP inbox delivery, end-to-end Production persistence (Preview write-path evidence exists from prior gates; not re-run here).

---

## 5. SEO / crawl / legal / redirects

| Check | Result |
|-------|--------|
| Sitemap | Present; 35 URLs; **missing** `/technology/request-quote` |
| robots.txt | Present; API disallowed; sitemap linked |
| Apex → www | 308 permanent redirect |
| Canonicals | All sampled pages use `https://www.adeptfragrances.com…` |
| Unique titles | No duplicate titles across the 36 routes |
| Single H1 | All 36 routes: exactly one H1 |
| Meta descriptions | Present on all 36 |
| Privacy / Terms | Live, substantial copy |
| 404 | Branded not-found with recovery links |

---

## 6. Confirmed issue register

### ISSUE-01 — Technology inquiry URL absent from sitemap  
- **Priority:** High  
- **URL:** https://www.adeptfragrances.com/technology/request-quote (live 200)  
- **Evidence:** Live `sitemap.xml` has no matching `<loc>`; discovery list `notInSitemap: ["/technology/request-quote"]` in `audit-raw.json`  
- **What is wrong:** A primary conversion URL is crawlable via links but not declared in the sitemap.  
- **Recommended correction:** Add the URL (and optionally note query variants are not required as separate sitemap entries) to `sitemap.ts` / generated sitemap.

### ISSUE-02 — Duplicate “What happens next” headings on quotation pages  
- **Priority:** High  
- **URLs:**  
  - https://www.adeptfragrances.com/request-quote  
  - https://www.adeptfragrances.com/technology/request-quote  
- **Evidence:** DOM query returns **two** `h2` nodes with text “What happens next” on each page; screenshots `request-quote__1440.png`, `technology_request-quote__1440.png`, `form-validation_*`  
- **What is wrong:** Aside / info panel content is rendered twice, harming layout clarity and heading outline accessibility.  
- **Recommended correction:** Remove the duplicate aside render (likely double-mount in the quote layout component).

### ISSUE-03 — Global “Request a Quote” CTA ignores Technology context  
- **Priority:** Medium  
- **URL example:** https://www.adeptfragrances.com/technology/erp (also website-development, digital-marketing, technology hub)  
- **Evidence:** Header links resolve to `/request-quote` (fragrance form), not `/technology/request-quote`; Playwright header CTA dump on `/technology/erp`  
- **What is wrong:** Users deep in Technology journeys are sent to the fragrance quotation form, which cannot select ERP/Website/Marketing services.  
- **Recommended correction:** Context-aware header/mobile CTA on `/technology/*` → `/technology/request-quote` (keep fragrance CTA elsewhere), or add a clear secondary Technology CTA in the header when on those routes.

### ISSUE-04 — Homepage document title omits brand name  
- **Priority:** Medium  
- **URL:** https://www.adeptfragrances.com/  
- **Evidence:** Live `<title>` = `Everything You Need to Create a Fragrance Brand.` (no “ADEPT”) while other pages use `| ADEPT Fragrances`  
- **What is wrong:** Weaker SERP brand recognition vs the rest of the site.  
- **Recommended correction:** Align title pattern, e.g. `Everything You Need to Create a Fragrance Brand | ADEPT Fragrances`.

### ISSUE-05 — About H1 nearly duplicates homepage H1  
- **Priority:** Low  
- **URL:** https://www.adeptfragrances.com/about  
- **Evidence:** About H1 `Everything you need to create a fragrance brand` vs Home H1 `Everything You Need to Create a Fragrance Brand.`  
- **What is wrong:** Thin differentiation between two important pages for users and SEO.  
- **Recommended correction:** Give About a distinct H1 focused on company positioning / supplier model.

---

## 7. Recommendations (not confirmed defects)

| ID | Priority | Topic | Detail |
|----|----------|-------|--------|
| REC-01 | Medium | Catalogue empty | Empty state is honest, but nav “Catalogue” currently leads to zero SKUs — publish verified items or soften nav prominence until ready. |
| REC-02 | Medium | Contact / fragrance form scope | Neither form lists Technology services — acceptable if intentional, but add a visible link to `/technology/request-quote` near those forms. |
| REC-03 | Low | Imagery on About / Process / Insights articles | Text-led pages with 0 images feel thinner than photo-rich service pages. |
| REC-04 | Low | Technology visual language | Abstract CSS “UI mock” graphics repeat across Technology pages; consider unique photography or tighter variety for luxury parity with fragrance pages. |
| REC-05 | Low | AI Support CTA | Email-only path is consistent with prior product intent; optionally cross-link Technology form for non-AI tech needs. |
| REC-06 | Low | Spelling consistency | Mix of “enquiry/inquiries” and “inquiry” appears across Technology copy — pick one locale convention. |
| REC-07 | Low | Sticky header in full-page screenshots | Sticky `header` (`position: sticky; z-index: 50`) can appear mid-scroll in full-page captures — **not** treated as a live layout bug. |

---

## 8. Explicitly not marked PASS / not tested

| Item | Status |
|------|--------|
| Successful Production inquiry create (fragrance or Technology) | **Not tested** (policy) |
| SMTP inbox delivery | **Not verified** |
| Paid ads / Search Console / Core Web Vitals field data | **Not tested** |
| Screen-reader full pass / WCAG lab audit | **Not tested** (spot checks only: skip link, H1 count, alts) |
| Every interactive hover/focus state | **Not exhaustively tested** |
| Third-party cookie / analytics consent UX | **Not observed** as a separate CMP layer |

Automated PASS observations (evidence in `audit-raw.json`): no broken `<img>`, no horizontal overflow at 1440/390, no page console errors, no failed same-origin network responses recorded during crawls, form empty/invalid submit blocked without success screens.

---

## 9. Proposed correction order

1. **ISSUE-02** — Remove duplicate quotation aside (quick, high user-visible quality).  
2. **ISSUE-01** — Add `/technology/request-quote` to sitemap.  
3. **ISSUE-03** — Context-aware Quote CTA on Technology routes.  
4. **ISSUE-04** — Homepage title brand suffix.  
5. **ISSUE-05** — Distinct About H1.  
6. **REC-02** then **REC-01** — Journey discoverability / catalogue readiness.  
7. Visual polish **REC-03 / REC-04 / REC-06** as capacity allows.

---

## 10. Stop

Audit complete. No fixes implemented. No Git push, migrate, deploy, or Production inquiry submission performed.

**Raw evidence:** `visual-review/live-complete-audit/audit-raw.json`  
**Re-run script (read-only vs live www):** `scripts/audit-live-complete.mjs`
