# ADEPT Fragrances — GUI / Visual Upgrade Report

**Branch:** `gui-visual-upgrade` (non-production)  
**Date:** 2026-09-22  
**Scope:** Front-end visual UX only — functionality, inquiry logic, SMTP, ERP, DB, DNS unchanged  

**Safety:** Local work only. **Not pushed. Not deployed to Production.** No Production DB writes. No inquiry forms submitted during QA.

---

## What was implemented

### 1. Homepage hero (priority)
Replaced the text-only / glass aside hero with a two-column composition:
- Left: ADEPT eyebrow, display headline, supporting line, CTAs (`Explore Our Solutions`, `Request a Quote`)
- Right: large visual via `MediaImage` → `hero-fragrance-solutions` (bottle + cap + pump + concentrate + box composition placeholder)
- Mobile: image stacks below content

### 2. Four business divisions
Editorial image cards (`EditorialImageCard`) with numbered labels:
- Fragrance Trading · Packaging & Components · Toll Manufacturing · Private Label

### 3. Eight packaging categories
`PackagingVisualGrid` — tall image cards with title anchored at bottom; links to existing category routes. No fake MOQ/pricing.

### 4. Additional homepage sections
- **One Project. Every Component.** — complete brand solution visual + CTA
- **From Compound to Finished Product.** — charcoal manufacturing band (illustrative imagery labelled)
- Process timeline (horizontal xl+, vertical below)
- Industry image cards

### 5. Inner pages upgraded
Packaging index/category, Fragrance Trading, Toll Manufacturing, Private Label, Process, Industries, Request Quote form grouping.

### 6. Typography / spacing / responsive
Display serif headings, sans for nav/body/forms; narrower prose (`max-w-prose`); ivory ↔ white ↔ charcoal rhythm; consistent section padding.

### 7. Media system
Central registry `src/content/media.ts` — replace `src` later without layout edits.  
22 composition SVG placeholders under `public/images/adept/` (clearly labelled; manufacturing marked illustrative).

---

## Code changes (key files)

| File | Role |
|------|------|
| `src/app/page.tsx` | Image-led homepage |
| `src/content/media.ts` | Asset registry + slug maps |
| `src/components/media/MediaImage.tsx` | Next.js Image wrapper |
| `src/components/media/EditorialImageCard.tsx` | Division cards |
| `src/components/media/PackagingVisualGrid.tsx` | Packaging category grid |
| `src/components/media/ProcessTimeline.tsx` | Process timeline (xl horizontal) |
| `src/components/ui/PageHero.tsx` | Optional media hero |
| `src/components/ui/Section.tsx` | Re-exports PageHero; prose width |
| `src/components/Header.tsx` | Dropdown spacing + hints |
| `src/components/forms/InquiryForm.tsx` | Visual field groups (logic unchanged) |
| `src/app/packaging/**` | Image-led packaging pages |
| `src/app/services/**` | Trading / toll / private-label visuals |
| `src/app/process/page.tsx` | Timeline presentation |
| `src/app/industries/**` | Industry imagery |
| `src/content/process.ts` | Brief → Dispatch step titles |
| `public/images/adept/*.svg` | 22 placeholders |
| `scripts/generate-adept-placeholders.mjs` | Regenerates placeholders |
| `scripts/capture-visual-review.mjs` | Screenshot capture |

---

## Image inventory (22 placeholders)

| File | Used on | Purpose |
|------|---------|---------|
| `hero-fragrance-solutions.svg` | Homepage hero | Complete ecosystem composition |
| `fragrance-trading.svg` | Home division, trading page | Concentrate evaluation |
| `packaging-components.svg` | Home division, packaging hero | Components still-life |
| `toll-manufacturing.svg` | Home division, toll hero | Illustrative process |
| `private-label.svg` | Home division, PL hero | Finished pack |
| `perfume-bottles.svg` … `complete-packaging-set.svg` | Packaging grid + category heroes | 8 categories |
| `fragrance-oils.svg` | Trading page | Oils / blotters |
| `manufacturing-mixing.svg` / `filling` / `quality-control` | Home + toll | Illustrative only |
| `complete-brand-solution.svg` | Homepage complete section | Full project visual |
| `industry-*.svg` (4) | Industries + home | Category editorials |

Full replacement sizing: see `visual-review/IMAGE_REPLACEMENT_MANIFEST.md`.

---

## Screenshots

Captured locally at **1440 / 1024 / 768 / 390** under `visual-review/`:

- `homepage__*.png`
- `packaging__*.png`
- `perfume-bottles__*.png`
- `caps__*.png`
- `fragrance-trading__*.png`
- `toll-manufacturing__*.png`
- `private-label__*.png`
- `request-quote__*.png`
- Nav extras: `nav-dropdown-solutions__1440-desktop.png`, `nav-mobile-open__*.png`

35 PNGs total. No horizontal overflow detected by capture script.

---

## Tests run (safe)

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Playwright visual capture (local `:3010`, dummy DB host) | Pass — 0 overflow |

Inquiry / Production DB write tests **not** run.

---

## Missing real photography

All 22 slots still need approved ADEPT studio photography. Update paths in `src/content/media.ts` only. Do not claim manufacturing placeholders depict ADEPT facilities until verified.

---

## Explicitly not done

- No merge to `main`
- No push / Production deploy
- No DNS, SMTP, ERP, or database changes
- No inquiry monitoring documentation in this deliverable
