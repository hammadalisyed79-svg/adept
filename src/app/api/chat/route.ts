import { NextResponse } from "next/server";
import { matchKnowledge } from "@/lib/chatbot/match";
import {
  generateOpenAIReply,
  isOpenAIChatEnabled,
} from "@/lib/chatbot/openai";
import { FALLBACK_LINKS } from "@/lib/chatbot/knowledge";
import { CHAT_REPLY_MAX } from "@/lib/validation/chat";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashIp } from "@/lib/reference";
import { chatMessageSchema } from "@/lib/validation/chat";

export const runtime = "nodejs";

const CHAT_RATE_LIMIT = 30;
const CHAT_WINDOW_MS = 15 * 60 * 1000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function faqPayload(message: string) {
  const result = matchKnowledge(message);
  return {
    ok: true as const,
    mode: result.mode,
    reply: truncate(result.reply, CHAT_REPLY_MAX),
    links: result.links,
    matchedTopic: result.matchedTopic,
    provider: "faq-knowledge" as const,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: false, error: "Rejected." }, { status: 400 });
  }

  const ip = clientIp(request);
  const rate = await checkRateLimit(
    `chat:${hashIp(ip)}`,
    CHAT_RATE_LIMIT,
    CHAT_WINDOW_MS,
  );

  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many messages. Please wait a few minutes, or email info@adeptfragrances.com.",
      },
      {
        status: 429,
        headers: rate.retryAfterSeconds
          ? { "Retry-After": String(rate.retryAfterSeconds) }
          : undefined,
      },
    );
  }

  const faq = faqPayload(parsed.data.message);

  // Safe paths that should not call OpenAI (commercial redirect / unsafe / empty)
  const skipOpenAI =
    faq.matchedTopic === null ||
    faq.matchedTopic === "Requesting quotations" ||
    /cannot collect passwords/i.test(faq.reply);

  if (!isOpenAIChatEnabled() || skipOpenAI) {
    return NextResponse.json(faq);
  }

  try {
    const ai = await generateOpenAIReply(parsed.data.message, faq.links);
    return NextResponse.json({
      ok: true,
      mode: ai.mode,
      reply: ai.reply,
      links: ai.links.length > 0 ? ai.links : faq.links,
      matchedTopic: faq.matchedTopic,
      provider: ai.provider,
      model: ai.model,
    });
  } catch {
    // Provider failure → FAQ fallback (no private data leaked)
    return NextResponse.json({
      ...faq,
      fallback: true,
      reply: truncate(
        `${faq.reply}\n\n(AI drafting was unavailable; this answer uses ADEPT’s published FAQ knowledge.)`,
        CHAT_REPLY_MAX,
      ),
      links: faq.links.length ? faq.links : [...FALLBACK_LINKS],
    });
  }
}
