import { describe, expect, it } from "vitest";
import { matchKnowledge } from "@/lib/chatbot/match";
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
    const parsed = chatMessageSchema.safeParse({ message: "Tell me about toll manufacturing" });
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
