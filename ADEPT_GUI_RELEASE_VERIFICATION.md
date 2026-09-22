# ADEPT GUI Release Verification

**Date:** 2026-09-22  
**Scope:** Confirm the three GUI fixes from `ADEPT_GUI_GAPS_REVIEW.md` on the **public** site.  
**Actions taken:** Read-only verification + screenshots. **No** code changes, push, merge, promote, migrate, SMTP/ERP/DNS, or paid API changes.

---

## Commit ↔ deployment mapping

| Item | Value |
|------|--------|
| **Git `origin/main` / local `HEAD`** | `fefa2e6253aef9042c11df6834ac8e7f29f4c5c3` |
| **Main message** | Fix clipped Technology card visuals and packaging image overlays. |
| **Fix commit (all three fixes)** | **`fefa2e6`** — same as `origin/main` (ancestor check: yes) |
| **Public www deployment** | `dpl_9eT1umstGZj56UdNhap1ia4XpNYs` |
| **Deployment host** | `adept-pvwlwnslq-hammad-fedc.vercel.app` |
| **Alias** | `www.adeptfragrances.com` → that deployment |
| **Deployment created** | 2026-09-22 16:22:23 +0500 (≈1 min after fix commit 16:21:32) |
| **Target / status** | Production · Ready |

**Verdict: LIVE** — Public www is served from the Production deployment that followed the GUI-fix commit on `main`. Fix commit ≡ current `main`.

Vercel inspect JSON for this deployment did not expose `githubCommitSha` in the CLI payload; linkage is established via (1) www alias → `dpl_9eT1umst…`, (2) timing after `fefa2e6` push/promote, (3) live DOM/CSS behaviour matching that commit (aspect ≈ 4/3, no `line-clamp-2`).

---

## Fix checklist vs live evidence

| Fix | In commit `fefa2e6` | LIVE on www? | Evidence |
|-----|---------------------|--------------|----------|
| Technology illustration clipping | Yes | **Yes** | DOM: four `[data-tech-visual]` frames, aspect ≈ **1.33 (4/3)**, `clippedChild: false`. Screenshot: `tech-cards-section__1440.png` — ERP header, browser chrome, chat header fully inside frames. |
| Packaging gradient adjustment | Yes | **Yes** | Screenshot: `packaging-grid-section__1440.png` — product photography visible above labels; softer bottom fade (not a solid wash). |
| Industry description unclamping | Yes | **Yes** | DOM: `webkitLineClamp: none`; full sentences for all four industries. Screenshot: `industries__1440.png`. Live HTML: `line-clamp-2` absent. |

---

## Screenshot inventory

All under `visual-review/gui-release-verification/` from **https://www.adeptfragrances.com**:

| Path | View |
|------|------|
| `tech-cards-section__1440.png` | Full Technology card row (desktop) |
| `tech-cards-section__390.png` | Technology section (mobile) |
| `packaging-grid-section__1440.png` | Packaging grid (desktop) |
| `packaging-grid-section__390.png` | Packaging grid (mobile) |
| `industries__1440.png` | Industry cards + full descriptions |
| `industries__390.png` | Industries (mobile) |
| `chatbot-open__390.png` | ADEPT Assistant open on 390px |
| `dom-findings.json` | DOM measurement dump |

Supporting captures: `tech-cards__1440.png`, `tech-cards__390.png`, `packaging-grid__1440.png`, `packaging-grid__390.png`.

---

## Verification results (visual + DOM)

### Technology cards
- Frames measure **255×191** (ratio **1.33**), consistent with **`aspect-[4/3]`**, not the old short `16/10` homepage framing.
- No child geometry reported outside the visual frames (`clippedChild: false` for erp / website / marketing / ai).
- Visual: dashboard header, browser chrome, marketing board, and AI chat header/composer are fully visible with padding.

### Packaging grid
- Product photos clearly visible (bottles, caps, pumps, labels, cartons, etc.).
- Label gradient present for contrast but does not blank out the lower half of photography as in the pre-fix complaint.
- CTAs “Request a Quote” / “All packaging” visible below the grid.

### Industry descriptions
- Full copy visible for Fine Fragrance, Personal Care, Home Care and Detergents, Candles and Home Fragrance.
- No CSS line-clamp; no ellipsis truncation in measured text.

### Horizontal overflow
- At 1440: `scrollWidth === clientWidth` (1440).
- At 390 (page): no document-level horizontal overflow flagged.

### Chatbot (390, open)
- Panel opens; labelled automated assistant; header not clipped.
- **Defect:** Open panel **overlaps** in-viewport homepage CTAs in the quotation band (`Request a Quote`, `Contact Us` — `overlap: true` in `dom-findings.json`). Launcher also overlaps lower-right content when closed (seen on industries/packaging shots).
- Quick-action chips intentionally scroll horizontally inside the panel (not page overflow).

---

## Remaining defects (with evidence)

1. **Chatbot covers important CTAs when open on mobile** — `chatbot-open__390.png`; DOM overlaps on Request a Quote / Contact Us while scrolled to the quotation section.
2. **Closed launcher overlaps card content** — e.g. Candles description / packaging tile corner in `industries__1440.png` / packaging shots.
3. **Technology overview CTA still left-aligned under 4-column grid** — design imbalance noted in `ADEPT_GUI_GAPS_REVIEW.md`; visible in `tech-cards-section__1440.png` (not a regression of the three fixes).
4. **Live HTML still contains `aspect-[16/10]` somewhere** — not the homepage Technology cards (measured 4/3); likely another page/section. Not the reported clipping defect.

---

## STOP

Report complete. No push, merge, promote, or further deployment performed.
