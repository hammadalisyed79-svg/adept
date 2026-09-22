import { NextResponse } from "next/server";
import { matchKnowledge } from "@/lib/chatbot/match";
import { CHAT_REPLY_MAX } from "@/lib/validation/chat";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashIp } from "@/lib/reference";
import { chatMessageSchema } from "@/lib/validation/chat";

export const runtime = "nodejs";

/** Chat is FAQ-only; no LLM provider is called. */
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

  try {
    const result = matchKnowledge(parsed.data.message);
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      reply: truncate(result.reply, CHAT_REPLY_MAX),
      links: result.links,
      matchedTopic: result.matchedTopic,
      // Explicit: this endpoint never calls a generative AI provider
      provider: "faq-knowledge",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The assistant is temporarily unavailable. Please email info@adeptfragrances.com or use a quotation form.",
        links: [
          { label: "Request a Quote", href: "/request-quote" },
          { label: "Contact", href: "/contact" },
        ],
      },
      { status: 500 },
    );
  }
}
