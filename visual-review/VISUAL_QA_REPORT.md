# ADEPT Fragrances — Visual QA Report

**Branch:** `gui-visual-upgrade` (not merged, not pushed in this pass)  
**Local preview:** `http://127.0.0.1:3010`  
**DB/SMTP:** pointed at unused `127.0.0.1:1` / SMTP cleared — no Production writes; forms not submitted  
**Date:** 2026-09-22  

---

## Screenshots

All files under `visual-review/` (35 PNGs).

| Page | 1440 | 1024 | 768 | 390 |
|------|------|------|-----|-----|
| Homepage | `homepage__1440-desktop.png` | `homepage__1024-laptop.png` | `homepage__768-tablet.png` | `homepage__390-mobile.png` |
| Packaging | `packaging__*` | ✓ | ✓ | ✓ |
| Perfume bottles | `perfume-bottles__*` | ✓ | ✓ | ✓ |
| Caps | `caps__*` | ✓ | ✓ | ✓ |
| Fragrance Trading | `fragrance-trading__*` | ✓ | ✓ | ✓ |
| Toll Manufacturing | `toll-manufacturing__*` | ✓ | ✓ | ✓ |
| Private Label | `private-label__*` | ✓ | ✓ | ✓ |
| Request a Quote | `request-quote__*` | ✓ | ✓ | ✓ |

Extras: `nav-dropdown-solutions__1440-desktop.png`, `nav-mobile-open__768-tablet.png`, `nav-mobile-open__390-mobile.png`.

Capture script: `scripts/capture-visual-review.mjs` — **0 horizontal overflow** issues across all captures.

---

## Inspection summary

| Check | Result |
|-------|--------|
| Hero composition | Pass — text left / image right (desktop); stacked mobile |
| Image placement | Pass after fix (removed duplicate category image) |
| Placeholder quality | Expected — abstract SVGs; replace per manifest |
| Typography | Pass — display serif headings, sans body/nav |
| Spacing / rhythm | Pass — ivory / white / charcoal alternation |
| Cards / grids | Pass — packaging 4→2→1; divisions 2×2 |
| Alignment | Pass |
| Cropping | Pass on placeholders (object-cover + aspect boxes) |
| Mobile overflow | Pass |
| Navigation | Pass — Solutions dropdown + mobile accordion |
| CTA visibility | Pass |

**Laptop note:** Desktop nav appears at `xl` (≥1280). At 1024 / 768 the hamburger is used — intentional given nav density; not treated as a defect.

---

## Layout defects fixed (this pass only)

1. **Process timeline cramped at 1024** — 8-column horizontal layout now `xl+` only; vertical timeline below.
2. **Duplicate packaging category image** — hero + identical second image removed; capabilities remain as option tiles only.

No broader redesign.

---

## Tests run

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Playwright visual capture | Pass (0 overflow) |

Inquiry / Production DB tests **not** run.

---

## Image replacement

See `visual-review/IMAGE_REPLACEMENT_MANIFEST.md` — all **22** placeholders need approved photography (P0 first).

---

## Safety

- No merge to `main`
- No git push in this pass
- No Production deploy / DNS / SMTP / ERP / DB changes
- No inquiry form submissions
