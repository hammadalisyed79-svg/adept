# ADEPT Fragrances — Release Candidate Report

**Branch:** `gui-visual-upgrade`  
**RC commit:** `6f37021899104bb0a09e0d4803536abadceb95be` (`6f37021`)  
**Date:** 2026-09-22  

**Actions not performed:** merge to `main`, push, Production deploy, DNS/SMTP/ERP/DB changes.

---

## GUI freeze scope (approved)

Frozen as polished (no redesign this pass):

- Homepage layout & sections  
- Packaging layout  
- Manufacturing layout  
- Typography & colour palette (charcoal / champagne / ivory / white)  
- Navigation  
- Footer (collapsible mobile groups retained)

---

## Release refinements in this RC

| # | Change | Status |
|---|--------|--------|
| 1 | Mobile “What happens next” **below** quotation form; desktop sidebar unchanged | **Done** (`src/app/request-quote/page.tsx`) |
| 2 | Accessories image | **Flagged only** — no new imagery; `placeholderNote` on `accessories` in `src/content/media.ts` |

Mobile form check (390px): form Y &lt; panel Y — **pass**. Screenshots: `visual-review/rc/request-quote__390.png`, `request-quote__1440.png`.

---

## RC commit & changed files

**Commit:** `6f37021899104bb0a09e0d4803536abadceb95be`

```
RELEASE_CANDIDATE_REPORT.md
src/app/request-quote/page.tsx
src/content/media.ts
visual-review/rc/request-quote__1440.png
visual-review/rc/request-quote__390.png
```

Branch is **`gui-visual-upgrade`**, currently **ahead of origin by 4 commits** (local only — not pushed in this pass).

---

## Safe local tests

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass (`RUN_DB_MIGRATE` skipped) |
| Mobile quote layout check | Pass (form above panel) |

No Production DB write tests. No inquiry form submissions.

---

## Production deployment controls — verification

**Documented** in `PRODUCTION_SAFETY_ACTIONS.md` §5 (disable auto-assign custom Production domains → promote-only).

**Established in Vercel?** **Not verified as completed.** Last audit (2026-09-21) found:

| Control | Audited state | Blocker for merge to live `main`? |
|---------|---------------|-----------------------------------|
| Auto-assign Custom Production Domains | Effectively **ON** — `main` updates public www | **YES** |
| Promote-only release | Procedure written; not confirmed active | **YES** until disabled auto-assign |
| Preview DB isolated from Production | **NOT ISOLATED** (shared Prisma store) | **YES** for safe Preview testing |
| SMTP for `info@` | Previously blocked; re-verify before go-live | Operational risk |
| `RUN_DB_MIGRATE` gate on build | **Yes** (default skip) | OK |

**Do not merge to `main` / promote to Production** until an authorized operator confirms Auto-assign Custom Production Domains is **disabled** (or an equivalent promote-only gate).

---

## Remaining blockers before Production merge

1. **Release control:** Confirm Vercel Production auto-domain assignment is off; use explicit promote.  
2. **Staging DB isolation:** Preview must not share Production Prisma store (`docs/STAGING_DATABASE_ISOLATION.md`).  
3. **Accessories photography:** Replace flagged generated asset with genuine ADEPT packaging accessories.  
4. **SMTP / inbox:** Confirm Production email delivery to `info@adeptfragrances.com`.  
5. **Optional:** Push `gui-visual-upgrade` for Preview review only — **do not** merge until (1)–(2) cleared.

---

## Proposal status

**Release candidate prepared on `gui-visual-upgrade`.**  
**Merge to `main`: blocked** until Production deployment controls are confirmed established.
