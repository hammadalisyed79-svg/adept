/**
 * Centralized company configuration.
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
    process.env.COMPANY_LEGAL_NAME?.trim() ||
    "Adept Fragrance Industries (Private) Limited",
  legalNameVerified: process.env.COMPANY_LEGAL_NAME_VERIFIED === "true",
  tagline: "Precision in Fragrance. Excellence in Manufacturing.",
  heroHeadline: "Everything You Need to Create a Fragrance Brand.",
  heroSupporting:
    "From fragrance concentrates and packaging components to complete manufacturing solutions, ADEPT supports your business from concept to finished product.",
  positioning:
    "A complete B2B supplier of fragrance concentrates, perfume packaging components, accessories, private-label services, and manufacturing solutions.",
  email: process.env.COMPANY_EMAIL?.trim() || "info@adeptfragrances.com",
  /**
   * Notification recipient — retained for mail-code compatibility.
   * Official policy: single mailbox info@adeptfragrances.com for all business mail.
   */
  salesEmail:
    process.env.SALES_EMAIL?.trim() ||
    process.env.COMPANY_EMAIL?.trim() ||
    "info@adeptfragrances.com",
  telephone: process.env.COMPANY_TELEPHONE?.trim() || "+00 000 000 0000",
  whatsapp: process.env.COMPANY_WHATSAPP?.trim() || "+000000000000",
  address: process.env.COMPANY_ADDRESS?.trim() || "",
  addressVerified: process.env.COMPANY_ADDRESS_VERIFIED === "true",
  domain:
    process.env.COMPANY_DOMAIN?.trim() || "https://www.adeptfragrances.com",
  domainVerified: process.env.COMPANY_DOMAIN_VERIFIED === "true",
  social: {
    linkedin: process.env.SOCIAL_LINKEDIN?.trim() || "",
    instagram: process.env.SOCIAL_INSTAGRAM?.trim() || "",
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
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromPublic) return fromPublic;
  return company.domain.replace(/\/$/, "");
}

export function isTelephonePlaceholder(): boolean {
  return (
    !process.env.COMPANY_TELEPHONE ||
    company.telephone === "+00 000 000 0000"
  );
}

export function isWhatsAppPlaceholder(): boolean {
  return (
    !process.env.COMPANY_WHATSAPP || company.whatsapp === "+000000000000"
  );
}
