# ADEPT — Staged Preview Implementation Report

**Branch:** `preview/website-improvements`  
**Stable Preview alias:** https://adept-git-preview-website-improvements-hammad-fedc.vercel.app  
**Latest deployment:** https://adept-ogtmdmv54-hammad-fedc.vercel.app  
**Latest commit:** `471d3de`  
**Date:** 2026-09-22  

**STOP:** No merge to `main`, no Production promote, no DNS/SMTP/ERP/migrate changes.

---

## Preview safety (verified before push)

| Check | Result |
|-------|--------|
| `www.adeptfragrances.com` | Still on Production `adept-7mp7514jm` / Gate 2 release (`dpl_Gw1Rkmxk…`) |
| `adeptfragrances.com` | Same Production deployment |
| `autoAssignCustomDomains` | Remains **false** (Gate 2 API-verified; public domains did not move after Preview pushes) |
| Preview database | Preview env `DATABASE_URL` / `PRISMA_DATABASE_URL` / `POSTGRES_URL` → staging suffix **`4efe06`** (`adept-staging-postgres`) — not Production `673b6b` |
| Build migrations | `scripts/build-with-db.mjs` skips migrate unless `RUN_DB_MIGRATE=true` (not set on Preview) |
| Preview protection | **SSO / Vercel login required** (unauthenticated request redirects to Vercel login) |

---

## Stage 1 — Website corrections

| | |
|--|--|
| **Commit** | `075d779` (includes `0cd69e1` corrections + nav hierarchy) |
| **Preview** | https://adept-ao625scff-hammad-fedc.vercel.app → Ready |
| **Tests** | lint / typecheck / 43 tests / build — pass |

**Changes:** Five audit corrections, Technology homepage visuals, Solutions → Technology & Growth hierarchy (Overview + indented services + divider).

**Screenshots:** `visual-review/targeted-corrections/` · `visual-review/nav-hierarchy/`

---

## Stage 2 — Chatbot interface (+ Stage 3 knowledge)

| | |
|--|--|
| **Commit** | `0275110` |
| **Preview** | https://adept-3mh3evuo7-hammad-fedc.vercel.app → Ready |
| **Tests** | lint / typecheck / 53 tests / pass |

**Note:** Interface and verified FAQ knowledge ship together (one coherent assistant). Stage 3 content is included here.

**Stage 2 UI:** Floating ADEPT Assistant (ivory/charcoal/champagne), minimise/close, no auto-open.  
**Stage 3 knowledge:** Verified service answers, quick actions, quote deep links, `info@adeptfragrances.com` escalation, no invented prices/promises. Mode: **FAQ only**.

**Screenshots:** `visual-review/chatbot/`

---

## Stage 4 — OpenAI integration (gated / FAQ live)

| | |
|--|--|
| **Commit** | `471d3de` |
| **Preview** | https://adept-ogtmdmv54-hammad-fedc.vercel.app → Ready |
| **Stable alias** | https://adept-git-preview-website-improvements-hammad-fedc.vercel.app |
| **Tests** | lint / typecheck / 56 tests — pass |

**Status:** Official OpenAI SDK + Responses API code is present. **Generative AI is disabled** in Preview (no `OPENAI_API_KEY` in project env; requires `OPENAI_CHAT_ENABLED=true`). Preview serves **FAQ mode**. No API credits purchased.

**To enable later (approval required):**
```env
OPENAI_API_KEY=sk-...
OPENAI_CHAT_ENABLED=true
```
Plus Platform billing + spend limit. ChatGPT subscription ≠ API credits.

**Screenshots:** `visual-review/chatbot-openai/`

---

## Final review URL (use this)

**https://adept-git-preview-website-improvements-hammad-fedc.vercel.app**

Sign in with Vercel SSO. Confirm Technology cards, Solutions menu, and ADEPT Assistant (FAQ). Production site unchanged.

---

## Remaining approvals

1. Visual / UX feedback on Preview  
2. Optional: add OpenAI key + spend limit + `OPENAI_CHAT_ENABLED=true` on Preview only  
3. Explicit approval before merge / Production promote  

**Nothing merged. Nothing promoted to Production.**
