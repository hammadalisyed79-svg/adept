# ADEPT Targeted Website Corrections — Result

**Branch:** `fix/targeted-website-corrections`  
**Date:** 2026-09-22  
**Scope:** Five confirmed audit issues + Technology homepage card visuals  
**Status:** Ready for visual approval  
**Git:** Local branch only — **not pushed**, **not merged**, **not deployed**

---

## Exact files changed

| File | Change |
|------|--------|
| `src/components/media/TechnologyVisual.tsx` | Redesigned ERP / Website / Marketing / AI compositions; removed in-frame caption labels; contained layouts |
| `src/content/technology.ts` | Concise card summaries (no truncation need) |
| `src/app/page.tsx` | Homepage title includes ADEPT; removed `line-clamp-3` on Technology cards |
| `src/app/technology/page.tsx` | Removed `line-clamp-3` on service cards |
| `src/app/request-quote/page.tsx` | Single “What happens next” panel (no DOM duplicate) |
| `src/app/technology/request-quote/page.tsx` | Same single-panel fix |
| `src/components/Header.tsx` | Contextual Quote CTA: `/technology/*` → `/technology/request-quote` |
| `src/app/sitemap.ts` | Added `/technology/request-quote` |
| `src/app/about/page.tsx` | Distinct About H1 |
| `scripts/capture-targeted-corrections.mjs` | Before/after capture helper |
| `scripts/verify-targeted-corrections.mjs` | Local verification helper |

---

## Five issue-resolution results

| Issue | Result |
|-------|--------|
| **ISSUE-01** Sitemap missing Technology quote URL | **FIXED** — `/technology/request-quote` in sitemap; query variants **not** added |
| **ISSUE-02** Duplicate “What happens next” | **FIXED** — one panel per page; desktop sticky aside + mobile order via single render |
| **ISSUE-03** Header CTA ignores Technology context | **FIXED** — desktop + mobile: Technology routes → `/technology/request-quote`; other routes → `/request-quote` |
| **ISSUE-04** Homepage title omits brand | **FIXED** — `Everything You Need to Create a Fragrance Brand \| ADEPT Fragrances` |
| **ISSUE-05** About H1 near-duplicate | **FIXED** — `A B2B partner for fragrance concentrates, packaging, and manufacturing` |

---

## Technology visuals + copy

| Requirement | Result |
|-------------|--------|
| Four distinct polished compositions | Redesigned ERP (ops console), Website (desktop+phone fully inside frame), Marketing (campaign board), AI (chat UI) |
| ADEPT ivory / charcoal / champagne | Used throughout |
| No clipped devices / labels | Negative-offset phone removed; bottom caption labels removed |
| No fabricated logos / metrics | Abstract shapes only |
| Descriptions not truncated | `line-clamp-3` removed; shorter summaries; verify: no ellipsis |

---

## Before / after screenshot paths

### Technology homepage cards

| Viewport | Before (live www) | After (local `next start` :3458) |
|----------|-------------------|----------------------------------|
| 1440 | `visual-review/targeted-corrections/before/tech-cards__1440.png` | `visual-review/targeted-corrections/after/tech-cards__1440.png` |
| 1024 | — | `visual-review/targeted-corrections/after/tech-cards__1024.png` |
| 768 | — | `visual-review/targeted-corrections/after/tech-cards__768.png` |
| 390 | `visual-review/targeted-corrections/before/tech-cards__390.png` | `visual-review/targeted-corrections/after/tech-cards__390.png` |

### Quotation forms

| Page | Before | After |
|------|--------|-------|
| `/request-quote` 1440 / 390 | `.../before/request-quote__*.png` | `.../after/request-quote__*.png` |
| `/technology/request-quote` 1440 / 390 | `.../before/technology-request-quote__*.png` | `.../after/technology-request-quote__*.png` |

### About hero

| Viewport | Before | After |
|----------|--------|-------|
| 1440 / 390 | `.../before/about-hero__*.png` | `.../after/about-hero__*.png` |

Machine verify log: `visual-review/targeted-corrections/verify.json`

---

## Desktop / mobile verification (local build)

| Check | Result |
|-------|--------|
| Home title brand + meaning | **PASS** |
| About H1 distinct | **PASS** |
| Sitemap includes `/technology/request-quote` only | **PASS** |
| Single “What happens next” on both forms | **PASS** (1 each) |
| Desktop CTA contextual | **PASS** |
| Mobile CTA contextual | **PASS** |
| Card texts not truncated | **PASS** |
| Overflow at 390 / 768 / 1024 / 1440 on key routes | **PASS** (none) |
| Broken images | None observed on inspected routes |
| Fragrance CTA destinations unchanged off Technology | **PASS** |
| Production inquiry submit | **Not performed** |

---

## Test / build results

| Command | Result |
|---------|--------|
| `npm run typecheck` | **PASS** (0) |
| `npm run lint` | **PASS** (0) |
| `npm test` | **PASS** — 43 passed, 2 skipped |
| `npm run build` | **PASS** (0) — migrate skipped; local non-Production DB |

---

## Remaining problems / notes

1. **Visual approval pending** — Technology cards remain CSS compositions (not photography); confirm the new art direction meets luxury bar.  
2. Audit **recommendations** (catalogue empty state, About/Process imagery, AI email-only CTA) were **out of scope** and unchanged.  
3. Corrections are on **local branch only** — www still serves the prior deployment until you approve push / merge / promote.

---

## STOP

Awaiting your visual approval before any push, merge, or Production deployment.
