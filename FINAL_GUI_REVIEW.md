# ADEPT Fragrances — Final GUI Review

**Branch:** `gui-visual-upgrade` (local only)  
**Date:** 2026-09-22  
**Safety:** No merge, push, Production deploy, DB, SMTP, or ERP changes. Local preview used dummy DB host. Forms not submitted.

**Verdict:** Prominent SVG placeholders are replaced with photorealistic studio imagery; image decode verified after scroll. **Not declared “complete”** until ADEPT-approved photography replaces generated assets.

---

## Screenshots (verified after scroll + decode)

Directory: `visual-review/final/`

| Shot | File | Image audit |
|------|------|-------------|
| Homepage 1440 | `homepage__1440.png` | 21/21 ok |
| Homepage 390 | `homepage__390.png` | 21/21 ok |
| Packaging 1440 | `packaging__1440.png` | 9/9 ok |
| Packaging 390 | `packaging__390.png` | 9/9 ok |
| Toll Manufacturing 1440 | `toll-manufacturing__1440.png` | 10/10 ok |
| Toll Manufacturing 390 | `toll-manufacturing__390.png` | 10/10 ok |
| Fragrance Trading 1440 | `fragrance-trading__1440.png` | 6/6 ok |
| Request Quote 390 | `request-quote__390.png` | n/a (form only) |

Audit JSON: `visual-review/final/image-audit.json`  
Capture: `scripts/capture-final-visual.mjs` (scroll + load/error timeout; **0** adept decode failures)

---

## Rendering defects fixed

| Issue | Cause | Fix |
|-------|--------|-----|
| Nearly blank / weak image panels | Abstract SVG placeholders + capture before decode | Replaced with PNG; wait for decode after scroll |
| Tiny objects in empty rectangles | Sparse SVG compositions | Photorealistic filled studio frames |
| Tall packaging cards on mobile | `aspect-[3/4]` single column | Always 2 columns; `aspect-square` mobile, `3/4` from `lg` |
| Cramped / text-heavy homepage process | Full descriptions on home | `compact` mode → one short sentence; full copy on `/process` |
| Empty catalogue promoted first | Primary CTA to `/catalogue` | Homepage packaging CTA → **Request a Quote** |
| Phone / WhatsApp advertised when unverified | Copy mentioned channels | Email-only unless env verified; removed “pending configuration” customer copy |
| Internal legal disclaimer in footer | Unverified legal name note | Removed from customer footer |

`MediaImage`: eager load for priority heroes; `object-cover`; PNG uses Next optimizer (`quality={85}`).

---

## Images replaced (22 PNGs → `public/images/adept/`)

Wired in `src/content/media.ts` (`.png`).

**Priority (photorealistic generated studio assets):**  
hero-fragrance-solutions · fragrance-trading · packaging-components · toll-manufacturing · private-label · complete-packaging-set · perfume-bottles · fragrance-oils · complete-brand-solution

**Packaging:** caps · pumps-collars · labels-stickers · folding-cartons · rigid-boxes · accessories  

**Manufacturing (illustrative — not ADEPT facilities):** manufacturing-mixing · manufacturing-filling · quality-control  

**Industries:** industry-fine-fragrance · industry-personal-care · industry-home-care · industry-candles  

SVG files may still exist as unused leftovers; registry points to PNG.

---

## Images still missing (ADEPT-approved)

Replace generated PNGs with **approved ADEPT product photography** before calling the visual upgrade complete:

1. Hero complete ecosystem (branded / real components)
2. Division heroes (trading, packaging, private label)
3. All eight packaging categories (real SKUs when cleared)
4. Verified manufacturing photography **or** permanently labelled stock with rights
5. Industry editorials shot for ADEPT

Do not present manufacturing images as ADEPT facilities until verified.

---

## Mobile layout changes

- Packaging grid: **2 columns**, square images, readable titles on overlay
- Hero stacks image below copy
- Process: vertical timeline with condensed sentences on homepage

---

## Commercial content

- Official email: **info@adeptfragrances.com**
- Telephone / WhatsApp: shown only when configured (not placeholder)
- Catalogue remains available but secondary; quote is primary where catalogue empty
- Manufacturing disclaimer retained on homepage charcoal band

---

## Tests (safe local)

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Final Playwright image audit | Pass (0 decode failures) |

Production write tests not run.

---

## Explicit non-claims

- Visual upgrade is **improved**, not photography-final.
- Generated imagery is original for layout approval, not licensed ADEPT catalogue content.
- Illustrative manufacturing ≠ ADEPT facilities.
