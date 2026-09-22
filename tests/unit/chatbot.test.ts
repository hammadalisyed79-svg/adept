import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { matchKnowledge } from "@/lib/chatbot/match";
import {
  hasOpenAIApiKey,
  isOpenAIChatEnabled,
  getOpenAIModel,
  DEFAULT_OPENAI_MODEL,
} from "@/lib/chatbot/openai";
import { chatMessageSchema } from "@/lib/validation/chat";

describe("matchKnowledge FAQ assistant", () => {
  it("answers fragrance trading from verified copy", () => {
    const result = matchKnowledge("Do you supply fragrance concentrates and sampling?");
    expect(result.mode).toBe("faq");
    expect(result.entryId).toBe("fragrance-trading");
    expect(result.reply).toMatch(/fragrance trading/i);
    expect(result.links.some((l) => l.href.includes("FRAGRANCE_TRADING"))).toBe(true);
  });

  it("routes packaging questions to packaging quote deep link", () => {
    const result = matchKnowledge("What packaging bottles and caps do you offer?");
    expect(result.entryId).toBe("packaging");
    expect(result.links.some((l) => l.href.includes("PACKAGING_COMPONENTS"))).toBe(
      true,
    );
  });

  it("routes ERP to technology quotation", () => {
    const result = matchKnowledge("Tell me about ERP inventory and purchasing");
    expect(result.entryId).toBe("erp");
    expect(result.links.some((l) => l.href.includes("/technology/request-quote"))).toBe(
      true,
    );
  });

  it("does not invent prices — redirects commercial questions to quote forms", () => {
    const result = matchKnowledge("What is your price and MOQ for concentrates?");
    expect(result.entryId).toBe("quote");
    expect(result.reply).toMatch(/cannot provide prices/i);
    expect(result.reply).not.toMatch(/\$\d|\d+\s*kg/i);
  });

  it("refuses unsafe credential requests", () => {
    const result = matchKnowledge("Here is my password and credit card for payment");
    expect(result.reply).toMatch(/cannot collect passwords/i);
  });

  it("admits when information is unavailable", () => {
    const result = matchKnowledge("What is the weather in Karachi tomorrow?");
    expect(result.entryId).toBeNull();
    expect(result.reply).toMatch(/do not have verified/i);
  });

  it("identifies contact email without claiming live human chat", () => {
    const result = matchKnowledge("How can I contact ADEPT and speak to someone?");
    expect(result.reply).toMatch(/info@adeptfragrances\.com/);
    expect(result.reply).toMatch(/does not mean a staffed live agent/i);
  });
});

describe("chatMessageSchema", () => {
  it("accepts normal messages", () => {
    const parsed = chatMessageSchema.safeParse({
      message: "Tell me about toll manufacturing",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects oversized messages", () => {
    const parsed = chatMessageSchema.safeParse({ message: "x".repeat(501) });
    expect(parsed.success).toBe(false);
  });

  it("rejects honeypot fills", () => {
    const parsed = chatMessageSchema.safeParse({
      message: "Hello",
      website: "http://spam.example",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("OpenAI gating", () => {
  const prevKey = process.env.OPENAI_API_KEY;
  const prevEnabled = process.env.OPENAI_CHAT_ENABLED;
  const prevModel = process.env.OPENAI_CHAT_MODEL;

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_CHAT_ENABLED;
    delete process.env.OPENAI_CHAT_MODEL;
  });

  afterEach(() => {
    if (prevKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = prevKey;
    if (prevEnabled === undefined) delete process.env.OPENAI_CHAT_ENABLED;
    else process.env.OPENAI_CHAT_ENABLED = prevEnabled;
    if (prevModel === undefined) delete process.env.OPENAI_CHAT_MODEL;
    else process.env.OPENAI_CHAT_MODEL = prevModel;
  });

  it("stays disabled without API key", () => {
    process.env.OPENAI_CHAT_ENABLED = "true";
    expect(hasOpenAIApiKey()).toBe(false);
    expect(isOpenAIChatEnabled()).toBe(false);
  });

  it("requires explicit OPENAI_CHAT_ENABLED=true even with a key", () => {
    process.env.OPENAI_API_KEY = "sk-test-key-not-real-abcdefghijklmnop";
    expect(hasOpenAIApiKey()).toBe(true);
    expect(isOpenAIChatEnabled()).toBe(false);
    process.env.OPENAI_CHAT_ENABLED = "true";
    expect(isOpenAIChatEnabled()).toBe(true);
  });

  it("defaults model to gpt-4o-mini", () => {
    expect(getOpenAIModel()).toBe(DEFAULT_OPENAI_MODEL);
  });
});
