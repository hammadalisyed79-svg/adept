# ADEPT Fragrances — Final UI Polish Report

**Branch:** `gui-visual-upgrade` (local commit; not pushed / not Production)  
**Date:** 2026-09-22  

No backend, database, SMTP, ERP, DNS, or deployment changes.

---

## Exact files changed

| File | Change |
|------|--------|
| `src/content/process.ts` | Added `homepageProcessPhases` (4 phases) |
| `src/components/media/HomepageProcess.tsx` | **New** — large-number 4-phase homepage process |
| `src/app/page.tsx` | Process → 4 phases; removed redundant contact strip; tighter mobile gaps; stronger industries |
| `src/components/QuoteCta.tsx` | Optional `showEmail` to merge quote + email |
| `src/components/Footer.tsx` | Mobile collapsible Divisions / Company / Contact |
| `src/components/ui/Section.tsx` | Section padding `py-14 md:py-24` (~12% mobile reduction) |
| `src/components/media/EditorialImageCard.tsx` | Slightly tighter mobile card padding |
| `src/components/media/MediaImage.tsx` | Subtle consistent tonal filter |
| `src/app/request-quote/page.tsx` | Desktop sticky commercial panel + visual |
| `scripts/capture-final-visual.mjs` | Writes to `visual-review/polish/` |

---

## What was simplified

1. **Homepage process** — 8 weak steps → **4 strong phases** (Brief & Selection · Sampling & Approval · Production & Quality · Packing & Dispatch) with large numbers. Full 8-step detail remains on `/process`.
2. **Lower homepage** — Removed separate “Speak with our commercial team” block. Single charcoal **Request a quotation** band now includes `info@adeptfragrances.com` + Contact / Quote CTAs (footer still holds structural contact links).
3. **Industries** — Stronger titles (`md:text-2xl`), `line-clamp-2`, top border accent, “Explore →”.
4. **Request quote** — Cleaner hero copy; desktop supporting panel (what happens next + email + image). Form logic unchanged.

---

## Mobile reductions applied

- Global section padding: `py-16` → **`py-14`** on small screens (~12.5%).
- Homepage division / packaging / complete-solution / process / industry gaps reduced (~10–15% via `mt-8` / `gap-4` / card `p-5` on mobile).
- Footer: accordion groups (less vertical fatigue); Contact open by default.
- Desktop footer layout preserved (always expanded columns).

---

## Screenshots

**After (this round):** `visual-review/polish/`

| Page | Desktop | Mobile |
|------|---------|--------|
| Homepage | `homepage__1440.png` | `homepage__390.png` |
| Packaging | `packaging__1440.png` | `packaging__390.png` |
| Toll Manufacturing | `toll-manufacturing__1440.png` | `toll-manufacturing__390.png` |
| Request Quote | `request-quote__1440.png` | `request-quote__390.png` |

**Before (prior round):** `visual-review/final/` — compare process (8-step vs 4-phase), lower homepage (dual ending vs single CTA), request-quote (form-only vs panel).

Image audit: homepage/packaging/toll 100% decode. Request-quote mobile “0/1” is the desktop-only sidebar image (`hidden lg:block`) — expected, not a broken asset.

---

## Image consistency

Light shared treatment on `MediaImage`: `saturate(0.96) brightness(0.99)` for warmer, calmer tonal balance. No unnecessary asset swaps.

---

## Tests

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Playwright polish capture | Pass |

---

## Not done (by design)

- No Production push/merge/deploy
- Inquiry validation / API untouched
- Process page still shows full 8 steps via `ProcessTimeline`
