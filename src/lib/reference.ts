import { createHash, randomBytes } from "crypto";

/** Generate unique inquiry reference: ADF-YYYYMMDD-XXXX */
export function generateInquiryReference(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `ADF-${y}${m}${d}-${suffix}`;
}

/** One-way hash for rate-limit / abuse logs — never store raw IPs in inquiry content logs. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "adept-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
