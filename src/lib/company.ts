/**
 * Centralized company configuration.
 * Update these values as business details are verified.
 * Legal name is proposed and unverified — do not present as incorporated until confirmed.
 */

export const company = {
  name: "ADEPT",
  displayDescriptor: "Fragrance Industries",
  /** Proposed legal name — not registered or verified. */
  legalName: "Adept Fragrance Industries (Private) Limited",
  legalNameVerified: false,
  tagline: "Precision in Fragrance. Excellence in Manufacturing.",
  positioning:
    "Integrated fragrance sourcing and manufacturing solutions for ambitious brands.",
  email: process.env.COMPANY_EMAIL ?? "inquiries@adeptfragrance.example",
  salesEmail: process.env.SALES_EMAIL ?? "sales@adeptfragrance.example",
  telephone: process.env.COMPANY_TELEPHONE ?? "+00 000 000 0000",
  whatsapp: process.env.COMPANY_WHATSAPP ?? "+000000000000",
  /** Leave empty until a verified address is confirmed. */
  address: process.env.COMPANY_ADDRESS ?? "",
  addressVerified: process.env.COMPANY_ADDRESS_VERIFIED === "true",
  domain: process.env.COMPANY_DOMAIN ?? "https://www.adeptfragrance.example",
  social: {
    linkedin: process.env.SOCIAL_LINKEDIN ?? "",
    instagram: process.env.SOCIAL_INSTAGRAM ?? "",
  },
} as const;

export type CompanyConfig = typeof company;

export function getWhatsAppUrl(message?: string): string {
  const digits = company.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    company.domain.replace(/\/$/, "")
  );
}
