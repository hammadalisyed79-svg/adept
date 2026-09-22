/**
 * Lightweight conversation helpers for a human-feeling ADEPT chat.
 * Name is kept only in the browser session — not stored server-side.
 */

import { CONTACT_EMAIL, type ChatLink } from "@/lib/chatbot/knowledge";

export type ChatPhase = "greeting" | "awaiting_name" | "helping";

const GREETING_PATTERN =
  /^(hi|hii+|hello|hey|hey there|hi there|good\s*(morning|afternoon|evening)|howdy|hola|salaam|salam|are you there|you there|anyone there|how are you|how're you|how r you|how's it going|how is it going|what's up|whats up)([\s,.!-]+(how are you|how're you|are you there)?)?[\s!.?]*$/i;

const GREETING_CONTAINS =
  /^(hi|hello|hey)\b|are you (there|online|available)|anyone (there|here)|how are you|how's it going|how is it going/i;

const NAME_PREFIX =
  /^(my name is|i am|i'm|this is|call me|it'?s)\s+/i;

const SERVICE_HINT_PATTERN =
  /\b(fragrance|packaging|bottle|pump|manufactur|private\s*label|toll|erp|website|marketing|chatbot|quote|quotation|price|process|industr|contact|email|catalogue|catalog|technology)\b/i;

export function isGreeting(message: string): boolean {
  const t = message.trim();
  if (!t || t.length > 80) return false;
  if (GREETING_PATTERN.test(t)) return true;
  if (GREETING_CONTAINS.test(t) && !SERVICE_HINT_PATTERN.test(t)) return true;
  return false;
}

export function looksLikeServiceQuestion(message: string): boolean {
  return SERVICE_HINT_PATTERN.test(message);
}

/** Extract a plausible first name from a short reply. */
export function extractVisitorName(message: string): string | null {
  let raw = message.trim();
  if (!raw || raw.length > 60) return null;
  if (isGreeting(raw)) return null;
  if (looksLikeServiceQuestion(raw)) return null;

  raw = raw.replace(NAME_PREFIX, "").trim();
  raw = raw.replace(/[.!?]+$/g, "").trim();

  // Reject obvious non-names
  if (!raw || /\d/.test(raw)) return null;
  if (/^(yes|no|ok|okay|sure|thanks|thank you|please|help)$/i.test(raw)) return null;

  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length === 0 || parts.length > 3) return null;

  const cleaned = parts
    .map((p) => p.replace(/[^a-zA-Z'-]/g, ""))
    .filter(Boolean);
  if (cleaned.length === 0) return null;

  return cleaned.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

export function greetingReply(message?: string): { text: string; links?: ChatLink[] } {
  const asksHow =
    !!message && /how are you|how's it going|how is it going|what's up|whats up/i.test(message);

  if (asksHow) {
    return {
      text: `I am well, thank you for asking — and yes, I am here.\n\nWelcome to ADEPT Fragrances. May I have your name, please?`,
    };
  }

  return {
    text: `Hello — yes, I am here.\n\nWelcome to ADEPT Fragrances. May I have your name, please?`,
  };
}

export function askNameAgain(): { text: string } {
  return {
    text: `Of course. What name should I use for you?`,
  };
}

export function afterNameReply(name: string): { text: string; links: ChatLink[] } {
  return {
    text: `Thank you, ${name}. It is a pleasure to assist you.\n\nHow may I help you today — fragrance concentrates, packaging, manufacturing, private label, Technology & Growth, or a quotation?`,
    links: [
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Technology quotation", href: "/technology/request-quote" },
      { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
    ],
  };
}

export function politeFallback(name?: string | null): { text: string; links: ChatLink[] } {
  const address = name ? `${name}, I` : "I";
  return {
    text: `${address} want to make sure I guide you correctly. Could you share a little more — for example fragrance, packaging, manufacturing, private label, technology, or whether you need a quotation?\n\nYou can also email ${CONTACT_EMAIL} anytime.`,
    links: [
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Contact", href: "/contact" },
      { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
    ],
  };
}
