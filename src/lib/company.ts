/**
 * Centralized company configuration.
 * Update these values as business details are verified.
 * Legal name is proposed and unverified — do not present as incorporated until confirmed.
 * Domain adeptfragrances.com is the proposed public website — ownership not assumed.
 */

export const company = {
  /** Public brand name shown in titles, SEO, and copy. */
  name: "ADEPT Fragrances",
  /** Compact mark for logo primary line. */
  logoPrimary: "ADEPT",
  /** Logo secondary line. */
  logoSecondary: "Fragrances",
  /** @deprecated Prefer `name`; retained for gradual template clarity. */
  displayDescriptor: "Fragrances",
  /** Proposed legal name — not registered or verified. */
  legalName:
    process.env.COMPANY_LEGAL_NAME ??
    "Adept Fragrance Industries (Private) Limited",
  legalNameVerified: process.env.COMPANY_LEGAL_NAME_VERIFIED === "true",
  tagline: "Precision in Fragrance. Excellence in Manufacturing.",
  positioning:
    "Integrated fragrance sourcing and manufacturing solutions for ambitious brands.",
  /**
   * Contact defaults are placeholders until mailboxes are confirmed.
   * Override via env for staging/production.
   */
  email: process.env.COMPANY_EMAIL ?? "inquiries@adeptfragrances.com",
  salesEmail: process.env.SALES_EMAIL ?? "sales@adeptfragrances.com",
  telephone: process.env.COMPANY_TELEPHONE ?? "+00 000 000 0000",
  whatsapp: process.env.COMPANY_WHATSAPP ?? "+000000000000",
  /** Leave empty until a verified address is confirmed. */
  address: process.env.COMPANY_ADDRESS ?? "",
  addressVerified: process.env.COMPANY_ADDRESS_VERIFIED === "true",
  /** Proposed public domain — do not treat as confirmed DNS ownership. */
  domain: process.env.COMPANY_DOMAIN ?? "https://www.adeptfragrances.com",
  domainVerified: process.env.COMPANY_DOMAIN_VERIFIED === "true",
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

/** True when telephone still uses the unset placeholder. */
export function isTelephonePlaceholder(): boolean {
  return (
    !process.env.COMPANY_TELEPHONE ||
    company.telephone === "+00 000 000 0000"
  );
}

/** True when WhatsApp still uses the unset placeholder. */
export function isWhatsAppPlaceholder(): boolean {
  return (
    !process.env.COMPANY_WHATSAPP || company.whatsapp === "+000000000000"
  );
}
