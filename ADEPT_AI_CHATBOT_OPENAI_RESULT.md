# ADEPT Assistant — OpenAI Integration Result

**Branch:** `feature/adept-assistant-openai`  
**Date:** 2026-09-22  
**Status:** STOP for review — **not pushed, merged, or deployed**

---

## Inspection findings (before enabling paid usage)

| Check | Result |
|-------|--------|
| Existing OpenAI SDK / API route | Previously **none**; FAQ chatbot only on prior branch |
| `OPENAI_API_KEY` in `.env` / `.env.local` / Vercel env pulls | **Not found** (scanned; no `sk-` OpenAI keys). Only empty/`ERP_API_KEY` matched “API key” patterns |
| Authorized API billing / spend limits | **Unknown / not configured in this repo** — must be set in [OpenAI Platform](https://platform.openai.com) |
| ChatGPT subscription ≠ API credits | **Confirmed policy:** Paid ChatGPT does **not** include API usage. API needs separate platform billing |

**Note:** You indicated the key is in `.env`, but no OpenAI key is present in the project env files inspected. Generative mode stays **disabled** until you add `OPENAI_API_KEY` and set `OPENAI_CHAT_ENABLED=true`.

---

## Provider choice

- **Proposed:** Official **OpenAI** Node SDK + **Responses API** (`client.responses.create`)
- **Default model:** `gpt-4o-mini` (override with `OPENAI_CHAT_MODEL`)
- **Claude / Anthropic:** not used

---

## Cost estimates (gpt-4o-mini, list prices)

Public rates (approx.): **$0.15 / 1M input tokens**, **$0.60 / 1M output tokens**.

Assumptions per chat turn: ~1,500 input tokens (system knowledge + question) + ~250 output tokens.

| Monthly chat volume | Est. tokens (in+out) | Rough monthly cost |
|---------------------|----------------------|--------------------|
| 500 messages | ~0.9M | **~$0.20** |
| 2,000 messages | ~3.5M | **~$0.80** |
| 10,000 messages | ~17.5M | **~$4** |
| 50,000 messages | ~87.5M | **~$20** |

Knowledge grounding increases input size; costs scale with knowledge base length. Set a **platform spend limit** before enabling.

**No credits were purchased and no paid API calls were made in this work** (generative path gated off).

---

## Implemented functionality

1. Premium floating **ADEPT Assistant** (existing UI retained / refined labels).
2. Server route `POST /api/chat`:
   - Always validates, rate-limits, honeypot-checks.
   - **FAQ mode** (default): keyword knowledge match.
   - **OpenAI mode** (only if `OPENAI_API_KEY` + `OPENAI_CHAT_ENABLED=true`): Responses API with verified knowledge in `instructions`; FAQ links attached; FAQ fallback on provider failure.
3. Commercial / unsafe questions stay on FAQ path (no LLM fabrication of prices).
4. No inquiry DB / transcript storage; no SMTP/ERP/DNS/schema changes.
5. Env template documented in `.env.example`.

### Enable OpenAI (requires your approval)

Add to **local** `.env` (never commit):

```env
OPENAI_API_KEY=sk-...
OPENAI_CHAT_ENABLED=true
# optional:
# OPENAI_CHAT_MODEL=gpt-4o-mini
```

Then confirm billing + monthly spend cap in OpenAI Platform.

---

## Files changed / added

| Path | Role |
|------|------|
| `src/lib/chatbot/openai.ts` | Responses API + gating |
| `src/app/api/chat/route.ts` | OpenAI with FAQ fallback |
| `src/lib/chatbot/knowledge.ts` | Disclaimer / AI Support copy |
| `src/components/chatbot/AdeptAssistant.tsx` | AI identification labels |
| `.env.example` | OpenAI env docs |
| `tests/unit/chatbot.test.ts` | FAQ + gating tests |
| `package.json` / lock | `openai` dependency |
| `ADEPT_AI_CHATBOT_OPENAI_RESULT.md` | This report |
| Screenshots | `visual-review/chatbot-openai/` |

---

## Test results

| Check | Result |
|-------|--------|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` | **56 passed**, 2 skipped |
| `npx next build` | Pass |
| Live `POST /api/chat` | `mode: faq`, `provider: faq-knowledge` (OpenAI gated off) |
| Generative live call | **Not run** — no key + enable flag |
| Screenshots | `visual-review/chatbot-openai/` |

---

## Remaining approvals

1. Add a real `OPENAI_API_KEY` to `.env` (or confirm the intended file/path).
2. Confirm OpenAI Platform **billing** and **spend limits**.
3. Set `OPENAI_CHAT_ENABLED=true` to authorize paid API calls.
4. Optional: Preview deploy (push still forbidden until you say so).
5. Optional: chat transcript retention policy (currently none stored).

---

## STOP

No push, merge, Production deploy, DNS, SMTP, or ERP changes. Generative OpenAI remains **disabled** until you approve spend and supply a working key.
