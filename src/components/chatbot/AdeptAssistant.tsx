"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ASSISTANT_DISCLAIMER,
  ASSISTANT_NAME,
  CONTACT_EMAIL,
  quickActions,
  type ChatLink,
} from "@/lib/chatbot/knowledge";
import { CHAT_MESSAGE_MAX } from "@/lib/validation/chat";

type PanelState = "closed" | "open" | "minimized";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: ChatLink[];
};

type ApiOk = {
  ok: true;
  reply: string;
  links?: ChatLink[];
  mode?: string;
  provider?: string;
};

type ApiErr = {
  ok: false;
  error?: string;
  links?: ChatLink[];
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: `${ASSISTANT_DISCLAIMER}\n\nAsk about fragrance, packaging, manufacturing, private label, Technology & Growth services, quotations, or contact. Or use a quick action below.`,
  links: [
    { label: "Request a Quote", href: "/request-quote" },
    { label: "Technology quotation", href: "/technology/request-quote" },
    { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
  ],
};

export function AdeptAssistant() {
  const [panel, setPanel] = useState<PanelState>("closed");
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerLabel, setProviderLabel] = useState("Automated assistant");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (panel === "open" && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, panel, pending]);

  useEffect(() => {
    if (panel === "open") {
      inputRef.current?.focus();
    }
  }, [panel]);

  useEffect(() => {
    if (panel !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel("minimized");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  const sendMessage = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || pending) return;

    setError(null);
    setPending(true);
    setMessages((prev) => [...prev, { id: uid(), role: "user", text }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          website: honeypotRef.current?.value ?? "",
        }),
      });

      const data = (await res.json()) as ApiOk | ApiErr;

      if (!res.ok || !data.ok) {
        const err = data as ApiErr;
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            text:
              err.error ||
              "Something went wrong. Please email info@adeptfragrances.com or use a quotation form.",
            links: err.links,
          },
        ]);
        if (res.status === 429) {
          setError(err.error || "Rate limit reached.");
        }
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          text: data.reply,
          links: data.links,
        },
      ]);
      if (data.provider === "openai" || data.mode === "openai") {
        setProviderLabel("AI-assisted · grounded answers");
      } else {
        setProviderLabel("Knowledge-based FAQ answers");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          text: "The assistant could not reach the server. Please try again, email info@adeptfragrances.com, or use a quotation form.",
          links: [
            { label: "Request a Quote", href: "/request-quote" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ]);
    } finally {
      setPending(false);
    }
  }, [pending]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const onQuickAction = (action: (typeof quickActions)[number]) => {
    void sendMessage(action.prompt);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-3 sm:inset-x-auto sm:bottom-2 sm:right-2 sm:p-5 md:p-5">
      {/* Launcher — compact on mobile, clears bottom CTA band */}
      {panel !== "open" && (
        <div className="pointer-events-auto mb-[max(0.25rem,env(safe-area-inset-bottom))] flex justify-end pb-2 sm:pb-0">
          <button
            type="button"
            className="group flex max-w-[11.5rem] items-center gap-2 rounded-sm border border-charcoal/15 bg-charcoal px-3 py-2.5 text-ivory shadow-sm transition-colors duration-soft hover:bg-charcoal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:max-w-none sm:gap-2.5 sm:px-4 sm:py-3"
            aria-expanded={false}
            aria-controls={panelId}
            onClick={() => setPanel("open")}
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-champagne text-charcoal sm:h-8 sm:w-8"
              aria-hidden
            >
              <ChatIcon />
            </span>
            <span className="min-w-0 text-left">
              <span className="block truncate text-xs font-medium tracking-wide">
                {ASSISTANT_NAME}
              </span>
              <span className="block truncate text-[0.65rem] text-ivory/70">
                Automated · ask about services
              </span>
            </span>
          </button>
        </div>
      )}

      {panel === "open" && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="pointer-events-auto mb-[max(4.75rem,calc(env(safe-area-inset-bottom)+3.5rem))] flex w-[min(100vw-1.5rem,22.5rem)] flex-col overflow-hidden rounded-sm border border-charcoal/15 bg-ivory-soft shadow-lg sm:mb-[max(0.25rem,env(safe-area-inset-bottom))] sm:w-[22.5rem]"
          style={{ maxHeight: "min(26rem, calc(100dvh - 9.5rem))" }}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-charcoal/10 bg-charcoal px-4 py-3 text-ivory">
            <div className="min-w-0">
              <h2 id={titleId} className="text-sm font-medium tracking-wide">
                {ASSISTANT_NAME}
              </h2>
              <p className="mt-0.5 text-[0.65rem] leading-snug text-ivory/70">
                Automated AI assistant · not a live human agent
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center text-ivory/80 transition-colors hover:bg-white/10 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                aria-label="Minimise assistant"
                onClick={() => setPanel("minimized")}
              >
                <MinimizeIcon />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center text-ivory/80 transition-colors hover:bg-white/10 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                aria-label="Close assistant"
                onClick={() => setPanel("closed")}
              >
                <CloseIcon />
              </button>
            </div>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-sm px-3 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-champagne/25 text-charcoal"
                      : "border border-charcoal/10 bg-white text-charcoal"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <ul className="mt-2 space-y-1 border-t border-charcoal/10 pt-2">
                      {m.links.map((link) => (
                        <li key={`${m.id}-${link.href}-${link.label}`}>
                          <Link
                            href={link.href}
                            className="text-xs font-medium text-champagne-deep underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            {pending && (
              <p className="text-xs text-charcoal-muted" aria-busy="true">
                Looking up ADEPT information…
              </p>
            )}
          </div>

          <div className="shrink-0 border-t border-charcoal/10 bg-white px-3 py-2.5">
            <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-charcoal/50">
              Quick actions
            </p>
            <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={pending}
                  onClick={() => onQuickAction(action)}
                  className="shrink-0 whitespace-nowrap rounded-sm border border-charcoal/15 bg-ivory px-2.5 py-1.5 text-[0.7rem] text-charcoal-muted transition-colors hover:border-champagne hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <label htmlFor={`${panelId}-input`} className="sr-only">
                Message to ADEPT Assistant
              </label>
              {/* Honeypot */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              <textarea
                id={`${panelId}-input`}
                ref={inputRef}
                rows={2}
                maxLength={CHAT_MESSAGE_MAX}
                value={input}
                disabled={pending}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ask about services or quotations…"
                className="w-full resize-none rounded-sm border border-charcoal/15 bg-ivory-soft px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne disabled:opacity-60"
              />
              {error && (
                <p className="text-xs text-red-700" role="alert">
                  {error}
                </p>
              )}
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.65rem] text-charcoal-muted">
                  {providerLabel} ·{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="shrink-0 rounded-sm bg-champagne px-3 py-2 text-xs font-medium tracking-wide text-charcoal transition-colors hover:bg-champagne-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 12h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
