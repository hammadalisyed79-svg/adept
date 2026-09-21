# ADEPT Fragrances — GUI / Visual Upgrade Report

**Branch:** `gui-visual-upgrade`  
**Scope:** Front-end visual UX only  
**Date:** 2026-09-21  

## Safety

- Work performed on feature branch only — **not merged to Production / main**.
- No changes to inquiry API logic, SMTP, ERP, database schema, DNS, or Vercel Production config.
- No test inquiries submitted to Production.
- Placeholder imagery is clearly labelled; manufacturing visuals are **not** claimed as ADEPT facilities.

---

## Pages visually upgraded

| Route | Changes |
|-------|---------|
| `/` | New hero (copy + image), editorial division cards, packaging visual grid, complete-solution section, charcoal manufacturing band, process timeline, industry image cards |
| `/packaging` | Image-led category grid + hero media |
| `/packaging/[slug]` | Category hero image, capabilities grid, “Tell Us What You’re Looking For” CTA |
| `/services/fragrance-trading` | Technical / house-style layout, fine vs industrial, application visuals |
| `/services/toll-manufacturing` | Process imagery band + image-led capability cards (verified copy retained) |
| `/services/private-label` | “From Brief to Shelf” transformation story + journey steps |
| `/process` | Horizontal (desktop) / vertical (mobile) timeline |
| `/industries` + `/industries/[slug]` | Editorial image cards / hero media |
| `/request-quote` | Wider layout; form visual grouping only |

Navigation (`Header`) refined: sticky understated bar, dropdown spacing + short category hints. Label “Process” retained (structure unchanged).

---

## Image slots / assets

**Registry:** `src/content/media.ts` — swap `src` paths later without editing layouts.

**Placeholders:** `public/images/adept/*.svg` (22 files), generated via `scripts/generate-adept-placeholders.mjs`

Including:  
`hero-fragrance-solutions`, `fragrance-trading`, `packaging-components`, `toll-manufacturing`, `private-label`, packaging category slots, manufacturing / QC slots, industry slots, `complete-brand-solution`.

---

## Components created

- `MediaImage` — Next.js `Image`, fill + aspect ratios, SVG `unoptimized`, optional hover scale (~1.03), `priority` for heroes
- `EditorialImageCard` — division-style editorial cards
- `PackagingVisualGrid` — tall image cards with title anchored at bottom
- `ProcessTimeline` — 8-step horizontal / vertical timeline
- `PageHero` — optional media column (extracted for reuse)

---

## Responsive

- Hero: content left / image right on desktop; stacked (image below) on mobile
- Packaging grid: 4 → 2 → 1 columns
- Process: horizontal ≥ `lg`, vertical below
- Form: multi-column desktop groups, single column mobile
- Header: existing mobile accordion preserved

---

## Performance

- `next/image` with responsive `sizes`
- Aspect-ratio wrappers to limit CLS
- `priority` only on primary heroes
- SVG placeholders are lightweight; replace with WebP/AVIF photography when approved
- Below-fold images lazy by default

---

## Accessibility

- Informative alts from media registry (placeholders note illustrative manufacturing)
- Focus-visible form fields; checkbox selected states
- Keyboard nav / sticky header behaviour preserved
- `prefers-reduced-motion` respected for hover scale and fade utilities

---

## Tests run / results

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm test` | Pass (23 tests) |
| `npm run build` | Pass |

---

## Preview URL / screenshots

Not attached in this pass. Deploy the `gui-visual-upgrade` branch to a **Vercel Preview** (do not promote to Production) for visual QA at 1440 / 1024 / 768 / 390.

---

## Missing real ADEPT photography

Replace all SVG placeholders under `/public/images/adept/` with approved studio photography:

1. Hero complete-ecosystem composition (bottle, cap, pump/collar, concentrate, rigid box, label)
2. Division heroes (trading, packaging, toll, private label)
3. Each packaging category
4. Manufacturing process set (only if verified as ADEPT or clearly marked stock/illustrative)
5. Industry editorials
6. Private-label transformation sequence

Update only `src` (and formats) in `src/content/media.ts` — page layouts stay unchanged.

---

## Out of scope (intentionally untouched)

Backend inquiry creation, mail, ERP adapter, Prisma, env secrets, DNS, Production Vercel settings.
