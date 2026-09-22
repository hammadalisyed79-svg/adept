import { z } from "zod";

/** Max user message length accepted by the chat API. */
export const CHAT_MESSAGE_MAX = 500;

/** Max reply length returned to clients (defense in depth). */
export const CHAT_REPLY_MAX = 2000;

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(CHAT_MESSAGE_MAX, `Keep messages under ${CHAT_MESSAGE_MAX} characters`),
  /** Honeypot — must remain empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
