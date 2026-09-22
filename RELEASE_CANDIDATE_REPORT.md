# ADEPT Fragrances — Release Candidate Report

**Branch:** `gui-visual-upgrade`  
**Freeze commit:** `ec61682a81449f8a56b2b44a6b4a86cbdb9fa5c2` — *Freeze GUI RC: quote mobile panel order and accessories flag.*  
**Date:** 2026-09-22  

**Not performed:** merge to `main`, push, Production deploy, DNS / SMTP / ERP / DB changes.

---

## GUI freeze (approved)

Homepage, packaging layout, manufacturing layout, typography, palette, navigation, and footer are frozen — no redesign in this RC.

---

## Refinements in this RC

| # | Item | Result |
|---|------|--------|
| 1 | Mobile “What happens next” below form; desktop sidebar unchanged | Done — `src/app/request-quote/page.tsx` |
| 2 | Accessories image | Flagged in `src/content/media.ts` (`placeholderNote`); **no** replacement imagery |

Mobile form check: form above panel — **pass**. Screenshots: `visual-review/rc/request-quote__390.png`, `request-quote__1440.png`.

---

## Changed files (freeze commit)

```
RELEASE_CANDIDATE_REPORT.md
src/app/request-quote/page.tsx
src/content/media.ts
visual-review/rc/request-quote__1440.png
visual-review/rc/request-quote__390.png
```

Branch: **`gui-visual-upgrade`**, local **ahead of origin** (not pushed).

---

## Tests

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Mobile quote usability (form then panel) | Pass |

---

## Production deployment controls

Documented in `PRODUCTION_SAFETY_ACTIONS.md` §5.  

**Established?** **No — not confirmed.** Last audit: Auto-assign Custom Production Domains effectively **on**; Preview/Production DB **shared**.

**Merge to `main` blocked** until an operator confirms promote-only Production release (auto-domain assign disabled) and staging DB isolation is addressed.

---

## Remaining blockers

1. Confirm Vercel Production auto-domain assignment **off** (promote-only).  
2. Isolate Preview DB from Production.  
3. Replace Accessories with genuine ADEPT packaging accessories photography.  
4. Re-verify SMTP → `info@adeptfragrances.com` inbox before go-live.

**RC status:** Prepared on `gui-visual-upgrade`. **Do not merge** until deployment controls are established.
