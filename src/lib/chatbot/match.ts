import {
  COMMERCIAL_REDIRECT_PATTERN,
  FALLBACK_ANSWER,
  FALLBACK_LINKS,
  knowledgeBase,
  type ChatLink,
  type KnowledgeEntry,
  UNSAFE_REQUEST_PATTERN,
} from "@/lib/chatbot/knowledge";

export type ChatMatchResult = {
  mode: "faq";
  reply: string;
  links: ChatLink[];
  matchedTopic: string | null;
  entryId: string | null;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s&/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreEntry(message: string, entry: KnowledgeEntry): number {
  let score = 0;
  for (const keyword of entry.keywords) {
    const k = keyword.toLowerCase();
    if (k.length <= 2) continue;
    if (message.includes(k)) {
      // Longer phrases weigh more
      score += Math.min(k.split(/\s+/).length + 1, 4);
    }
  }
  return score;
}

export function matchKnowledge(rawMessage: string): ChatMatchResult {
  const message = normalize(rawMessage);

  if (!message) {
    return {
      mode: "faq",
      reply:
        "Please share a short question about our services, packaging, technology, process, or contact — or tap a topic below.",
      links: [...FALLBACK_LINKS],
      matchedTopic: null,
      entryId: null,
    };
  }

  if (UNSAFE_REQUEST_PATTERN.test(rawMessage)) {
    return {
      mode: "faq",
      reply:
        "I cannot collect passwords, payment details, or confidential identity documents here. For commercial discussions, please use our quotation forms or email info@adeptfragrances.com — and never send credentials through this chat.",
      links: [
        { label: "Request a Quote", href: "/request-quote" },
        { label: "Email ADEPT", href: "mailto:info@adeptfragrances.com" },
      ],
      matchedTopic: null,
      entryId: null,
    };
  }

  // Prefer the dedicated quotation topic when the user is clearly asking commercial terms
  if (COMMERCIAL_REDIRECT_PATTERN.test(rawMessage)) {
    const quoteEntry = knowledgeBase.find((e) => e.id === "quote");
    if (quoteEntry) {
      return {
        mode: "faq",
        reply: quoteEntry.answer,
        links: [...(quoteEntry.links ?? [])],
        matchedTopic: quoteEntry.topic,
        entryId: quoteEntry.id,
      };
    }
  }

  let best: { entry: KnowledgeEntry; score: number } | null = null;
  for (const entry of knowledgeBase) {
    const score = scoreEntry(message, entry);
    if (!best || score > best.score) {
      best = { entry, score };
    }
  }

  // Threshold: require a meaningful keyword hit
  if (!best || best.score < 2) {
    return {
      mode: "faq",
      reply: FALLBACK_ANSWER,
      links: [...FALLBACK_LINKS],
      matchedTopic: null,
      entryId: null,
    };
  }

  return {
    mode: "faq",
    reply: best.entry.answer,
    links: [...(best.entry.links ?? [])],
    matchedTopic: best.entry.topic,
    entryId: best.entry.id,
  };
}
