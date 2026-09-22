# ADEPT live site — GUI gaps (2026-09-22)

Reviewed https://www.adeptfragrances.com after Production promote.

## Critical (fixed in this pass)

| Gap | Detail | Fix |
|-----|--------|-----|
| Technology card illustrations clipped | Homepage used `aspect-[16/10]` with tall CSS mockups (`h-full` ERP/browser/chat). Tops of dashboards, browser chrome, and chat headers were cut off by `overflow-hidden`. | Compact compositions that size to width; homepage aspect → `4/3`. |
| Packaging grid label overlay | Heavy `from-charcoal/90` gradient + large `pt-12/16` washed out lower product photography. | Softer/shorter gradient so more of the image remains visible. |
| Industry card copy truncated | Homepage industries still used `line-clamp-2`. | Removed clamp so full short descriptions show. |

## Remaining observations (not changed this pass)

| Gap | Notes |
|-----|--------|
| Technology CTA alignment | Single left-aligned “Technology & Growth overview” under a 4-column grid can feel unbalanced on wide desktops. Design choice — can center or full-width later if you want. |
| CSS comps vs photography | Technology visuals are abstract UI compositions, not product photos. Correct for service cards; if you prefer photography, that is a separate asset brief. |
| Sticky header on dark section | Ivory header over charcoal section is intentional; contrast is readable. |
| Chat launcher vs mobile CTAs | Assistant sits bottom-right with mobile offset; re-check on small phones if a page has sticky bottom CTAs. |

## Verification

Re-check homepage Technology row and Packaging grid at 1440 / 390 after deploy.
