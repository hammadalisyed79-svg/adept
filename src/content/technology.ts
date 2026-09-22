/**
 * Technology & Growth Solutions — public service copy.
 */

import { company } from "@/lib/company";

export const technologyEmail = company.email;

export function techMailto(subject: string): string {
  return `mailto:${technologyEmail}?subject=${encodeURIComponent(subject)}`;
}

export type TechnologyVisualVariant = "growth" | "erp" | "website" | "marketing";

export const technologyServices = [
  {
    title: "ERP Solutions",
    href: "/technology/erp",
    summary:
      "Custom ERP development and implementation support for inventory, sales, purchasing, production, and reporting — scoped to your operations.",
    variant: "erp" as TechnologyVisualVariant,
    label: "Software & operations",
  },
  {
    title: "Website Development",
    href: "/technology/website-development",
    summary:
      "Corporate, B2B, catalogue, and quotation-oriented websites — with optional integration to operational systems where supported.",
    variant: "website" as TechnologyVisualVariant,
    label: "Digital presence",
  },
  {
    title: "Digital Marketing",
    href: "/technology/digital-marketing",
    summary:
      "Brand strategy, content, social, SEO, and paid campaigns managed as practical growth support for your business.",
    variant: "marketing" as TechnologyVisualVariant,
    label: "Brand & channels",
  },
] as const;

export const erpOfferings = [
  {
    title: "ERP development and implementation",
    text: "Design and build of custom operational software, or structured implementation of third-party ERP platforms — chosen to fit your brief.",
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
    title: "Manufacturing operations",
    text: "Operational screens and controls that help teams run day-to-day production work within the agreed project scope.",
  },
  {
    title: "Finance and reporting",
    text: "Operational reporting and finance-facing summaries where included in scope — supporting clearer commercial visibility.",
  },
  {
    title: "System integrations",
    text: "Connecting websites, quotation tools, and operational systems when APIs and commercial agreements support it.",
  },
] as const;

export const erpHowWeWork = [
  {
    title: "Discovery and workflow mapping",
    text: "We review how your teams buy, produce, sell, and report — clarifying priorities before software decisions.",
  },
  {
    title: "Scope and solution design",
    text: "We define modules, integrations, and whether custom development or a third-party platform best fits the brief.",
  },
  {
    title: "Development or implementation",
    text: "Build or configure the agreed solution with staged reviews so commercial and operations stakeholders stay aligned.",
  },
  {
    title: "Testing and handover",
    text: "Validate key workflows, train users as scoped, and hand over documentation for ongoing use.",
  },
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
    text: "Where APIs and scope allow, connecting public sites to operational systems so inquiries or catalogues stay aligned.",
  },
] as const;

export const websiteFromBriefToLaunch = [
  {
    title: "Requirements",
    text: "Clarify audience, pages, content readiness, and any systems the site should connect to.",
  },
  {
    title: "Design and development",
    text: "Shape layout, content structure, and functionality to match your brand and commercial process.",
  },
  {
    title: "Testing",
    text: "Review key journeys across devices — navigation, forms, and content accuracy — before go-live.",
  },
  {
    title: "Launch and support scope",
    text: "Publish the site and define ongoing support according to the agreed engagement.",
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
    text: "Technical and content SEO practices aimed at clearer discoverability over time.",
  },
  {
    title: "Digital advertising",
    text: "Paid media setup and management on agreed channels, within defined budgets.",
  },
  {
    title: "Campaign management",
    text: "Planning, coordination, and reporting for digital campaigns with transparent measurement.",
  },
] as const;

export const marketingApproach = [
  {
    title: "Brand and audience assessment",
    text: "Understand positioning, offer, and the buyers or partners you need to reach.",
  },
  {
    title: "Channel and campaign planning",
    text: "Select practical channels and a campaign plan matched to budget and commercial goals.",
  },
  {
    title: "Creative development",
    text: "Produce messaging and assets suited to each channel — clear, on-brand, and usable.",
  },
  {
    title: "Measurement and reporting",
    text: "Track agreed metrics and report progress so decisions stay grounded in activity data.",
  },
] as const;
