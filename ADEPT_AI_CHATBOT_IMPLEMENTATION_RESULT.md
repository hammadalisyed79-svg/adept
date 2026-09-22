# ADEPT AI Chatbot — Implementation Result

**Branch:** `feature/adept-assistant-chatbot`  
**Date:** 2026-09-22  
**Status:** STOP for review — **not pushed, merged, or deployed**

---

## Summary

A visitor-facing **ADEPT Assistant** is mounted site-wide. It is a **knowledge-based FAQ assistant** (not generative AI). The existing **AI Support & Chatbots** service page is unchanged. No SMTP, ERP, DNS, or database schema changes.

---

## Exact files changed / added

| Path | Change |
|------|--------|
| `src/app/layout.tsx` | Mount `<AdeptAssistant />` after Footer |
| `src/components/chatbot/AdeptAssistant.tsx` | Floating launcher + chat panel UI |
| `src/lib/chatbot/knowledge.ts` | Verified FAQ knowledge, quick actions, safety patterns |
| `src/lib/chatbot/match.ts` | Keyword FAQ matcher (explicitly not generative AI) |
| `src/lib/validation/chat.ts` | Zod input limits + honeypot |
| `src/app/api/chat/route.ts` | Server-side FAQ API, rate limit, safe errors |
| `tests/unit/chatbot.test.ts` | FAQ accuracy, quote redirects, unsafe refusals, validation |
| `scripts/capture-chatbot.mjs` | Desktop/mobile screenshot capture |
| `visual-review/chatbot/*.png` | Closed / open / in-use screenshots |
| `ADEPT_AI_CHATBOT_IMPLEMENTATION_RESULT.md` | This document |

**Not modified:** inquiry API, Prisma schema, SMTP/mail, ERP, DNS, Technology AI Support marketing page.

---

## Chatbot features implemented

1. **Floating launcher** (bottom-right) — charcoal + champagne; labelled “ADEPT Assistant” / “Automated · ask about services”; **does not auto-open**.
2. **Chat panel** — ivory / charcoal / champagne; minimise, reopen, close; Escape minimises; focus moves to input when opened.
3. **Clear automation disclosure** — “Automated FAQ assistant · not a live human agent”; footer “Knowledge-based answers”.
4. **Quick actions** — Fragrance, Packaging, Toll, Private Label, ERP, Website, Digital Marketing, Request a Quote, Contact ADEPT (prompts + links to existing pages).
5. **Quote routing** — fragrance/packaging/toll/private-label → `/request-quote?type=…`; ERP/website/marketing → `/technology/request-quote?type=…`.
6. **Safe behaviour** — no prices/MOQ/stock/delivery invention; commercial questions → quote forms; unsafe credential/payment requests refused; unknown questions admit gap + contact escalation.
7. **Accessibility** — `role="dialog"`, labelled title, live region for replies, keyboard send (Enter), focusable controls, screen-reader-friendly launcher.

---

## AI provider status

| Check | Result |
|-------|--------|
| OpenAI / Anthropic / Gemini / Vercel AI SDK in `package.json` | **None** |
| AI API keys in env templates / local env | **None** |
| Approved usage budget | **None configured** |
| Mode shipped | **FAQ knowledge only** (`provider: "faq-knowledge"`) |

**Real generative AI is NOT enabled.** Matching is keyword FAQ over a curated knowledge base derived from public website copy.

### To enable generative AI later (STOPPED — needs your approval)

| Item | Requirement |
|------|-------------|
| Provider options | e.g. OpenAI, Anthropic, or Vercel AI Gateway |
| Credentials | Server-only API key (never `NEXT_PUBLIC_*`) |
| Cost | Provider token pricing + possible gateway fees — **purchase/plan not requested in this work** |
| Permissions | Explicit approval to (a) create/pay for a plan, (b) store a secret in Vercel env, (c) optionally send chat text to a third party |
| Privacy | Separate approval before sending Production inquiry DB content or storing transcripts |
| CSP | `connect-src` already self-only — keep LLM calls **server-side** via `/api/chat` |

**No paid integration was purchased or enabled.**

---

## Privacy and security controls

- Server-side Zod validation (max 500 chars input; reply truncated to 2000).
- Honeypot field (`website`).
- Rate limit: **30 messages / 15 minutes / hashed IP** via existing `checkRateLimit` (DB bucket with in-memory fallback).
- No chat transcript persistence; no CRM/inquiry records from chat.
- No client-side secrets; FAQ matching runs on the server.
- Safe 429 / 500 messages with human-contact fallback.
- Does not send Production inquiry records to any AI provider.

---

## Test results

| Check | Result |
|-------|--------|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` | **53 passed**, 2 skipped (incl. 10 new chatbot unit tests) |
| `npx next build` | Pass — route `ƒ /api/chat` present |
| Local smoke `POST /api/chat` | FAQ reply + fragrance deep links |
| Desktop/mobile screenshots | Captured under `visual-review/chatbot/` |
| Isolated Vercel Preview | **Not run** — push/deploy forbidden by this gate |

### Screenshots

| File | View |
|------|------|
| `visual-review/chatbot/desktop-closed__1440.png` | Launcher closed |
| `visual-review/chatbot/desktop-open__1440.png` | Panel open |
| `visual-review/chatbot/desktop-in-use__1440.png` | Fragrance FAQ reply + quote link |
| `visual-review/chatbot/mobile-closed__390.png` | Mobile launcher |
| `visual-review/chatbot/mobile-open__390.png` | Mobile panel |
| `visual-review/chatbot/mobile-in-use__390.png` | Packaging quick action in use |

---

## Remaining blockers / next steps (for your approval)

1. **Review UI + FAQ answers** on local branch.
2. **Decide** whether FAQ mode is sufficient for launch, or approve a paid LLM provider (provider, budget, env secret, privacy).
3. **Optional:** Preview deploy after explicit push approval (not done).
4. **Optional later:** transcript retention policy, live human chat staffing, `TECHNOLOGY_AI` inquiry type (AI Support page still uses mailto today).

---

## STOP

No push, merge, migrate, Production deploy, DNS, SMTP, or ERP changes were performed.
