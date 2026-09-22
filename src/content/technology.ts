/**
 * Technology & Growth Solutions — public service copy.
 * Claims are limited to offered services; no client results or product certifications.
 */

import type { MediaKey } from "@/content/media";
import { company } from "@/lib/company";

export const technologyEmail = company.email;

export function techMailto(subject: string): string {
  return `mailto:${technologyEmail}?subject=${encodeURIComponent(subject)}`;
}

export const technologyServices = [
  {
    title: "ERP Solutions",
    href: "/technology/erp",
    summary:
      "Custom ERP development and implementation support for inventory, sales, purchasing, production, and reporting — scoped to your operations.",
    mediaKey: "technologyErp" as MediaKey,
    label: "Software & operations",
  },
  {
    title: "Website Development",
    href: "/technology/website-development",
    summary:
      "Corporate, B2B, catalogue, and quotation-oriented websites — with optional integration to operational systems where supported.",
    mediaKey: "technologyWebsite" as MediaKey,
    label: "Digital presence",
  },
  {
    title: "Digital Marketing",
    href: "/technology/digital-marketing",
    summary:
      "Brand strategy, content, social, SEO, and paid campaigns managed as practical growth support — without guaranteed rankings or ROI.",
    mediaKey: "technologyMarketing" as MediaKey,
    label: "Brand & channels",
  },
] as const;

export const erpOfferings = [
  {
    title: "ERP development and implementation",
    text: "Design and build of custom operational software, or structured implementation of third-party ERP platforms where that approach fits the brief. Scope is defined project by project.",
  },
  {
    title: "Inventory management",
    text: "Stock visibility, movements, and warehouse-oriented workflows tailored to how your team buys, stores, and issues materials.",
  },
  {
    title: "Sales and purchasing",
    text: "Order capture, supplier purchasing, and commercial follow-up flows that keep buying and selling aligned with inventory.",
  },
  {
    title: "Production workflows",
    text: "Process steps, batch or job tracking, and shop-floor handoffs for fragrance and related manufacturing environments.",
  },
  {
    title: "Manufacturing operations support",
    text: "Operational screens and controls that help teams run day-to-day production work — not a claim of a packaged proprietary ERP product.",
  },
  {
    title: "Finance and reporting",
    text: "Operational reporting and finance-facing summaries where included in the agreed scope. Not a substitute for a full accounting practice.",
  },
  {
    title: "System integrations",
    text: "Connecting websites, quotation tools, and operational systems when APIs and commercial agreements support it. Existing ADEPT website ERP sync remains optional and separate.",
  },
] as const;

export const erpClarifications = [
  "Custom development means software built to your requirements.",
  "Third-party implementation means configuring and adopting an existing vendor platform.",
  "ADEPT does not present a named proprietary ERP product brand on this site.",
  "No certifications, deployed customer portfolios, or completed client case studies are claimed here.",
] as const;

export const websiteOfferings = [
  {
    title: "Corporate websites",
    text: "Clear company sites that present brand, capabilities, and contact paths for B2B audiences.",
  },
  {
    title: "B2B websites",
    text: "Structure and content oriented to commercial buyers — services, process, and inquiry pathways.",
  },
  {
    title: "Ecommerce websites",
    text: "Online selling experiences where product range and commercial model support digital checkout or order flow.",
  },
  {
    title: "Product catalogues",
    text: "Browsable product presentation for components, finished goods, or related ranges.",
  },
  {
    title: "Quotation websites",
    text: "Inquiry and quotation-oriented sites that collect structured project briefs for sales follow-up.",
  },
  {
    title: "ERP and website integration",
    text: "Where APIs and scope allow, connecting public sites to operational systems so inquiries or catalogues stay aligned. Integration is scoped per project — not assumed live for every engagement.",
  },
] as const;

export const marketingOfferings = [
  {
    title: "Brand strategy",
    text: "Positioning, messaging, and brand direction for fragrance and related businesses preparing to grow digitally.",
  },
  {
    title: "Social media",
    text: "Channel planning and ongoing presence support across agreed platforms.",
  },
  {
    title: "Creative content",
    text: "Visual and written content for campaigns, product stories, and brand communication.",
  },
  {
    title: "Search engine optimization",
    text: "Technical and content SEO practices aimed at discoverability. Rankings are not guaranteed.",
  },
  {
    title: "Digital advertising",
    text: "Paid media setup and management on agreed channels, within defined budgets.",
  },
  {
    title: "Campaign management",
    text: "Planning, coordination, and reporting for digital campaigns — without promised sales or ROI outcomes.",
  },
] as const;
