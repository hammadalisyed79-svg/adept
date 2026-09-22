/**
 * Verified ADEPT knowledge for the on-site assistant (FAQ mode).
 * Sourced from public website service pages — no invented commercial claims.
 */

export type ChatLink = {
  label: string;
  href: string;
};

export type KnowledgeEntry = {
  id: string;
  topic: string;
  /** Keywords / phrases used for FAQ matching (lowercase). */
  keywords: readonly string[];
  answer: string;
  links?: readonly ChatLink[];
};

export const ASSISTANT_NAME = "ADEPT Assistant";

export const ASSISTANT_DISCLAIMER =
  "I am an automated assistant on the ADEPT Fragrances website — not a human representative. I can guide you to services and quotation forms using published information.";

export const CONTACT_EMAIL = "info@adeptfragrances.com";

/** Quick-action chips shown in the panel (navigation / guided prompts). */
export const quickActions = [
  {
    id: "fragrance",
    label: "Explore Fragrance Solutions",
    href: "/services/fragrance-trading",
    prompt: "Tell me about fragrance concentrates and sampling",
  },
  {
    id: "packaging",
    label: "Packaging Requirements",
    href: "/packaging",
    prompt: "What packaging and components do you offer?",
  },
  {
    id: "toll",
    label: "Toll Manufacturing",
    href: "/services/toll-manufacturing",
    prompt: "Tell me about toll manufacturing",
  },
  {
    id: "private-label",
    label: "Private Label",
    href: "/services/private-label",
    prompt: "How does private label work?",
  },
  {
    id: "erp",
    label: "ERP Consultation",
    href: "/technology/erp",
    prompt: "Tell me about ERP Solutions",
  },
  {
    id: "website",
    label: "Website Development",
    href: "/technology/website-development",
    prompt: "Tell me about website development",
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    href: "/technology/digital-marketing",
    prompt: "Tell me about digital marketing services",
  },
  {
    id: "quote",
    label: "Request a Quote",
    href: "/request-quote",
    prompt: "How do I request a quotation?",
  },
  {
    id: "contact",
    label: "Contact ADEPT",
    href: "/contact",
    prompt: "How can I contact ADEPT?",
  },
] as const;

export const knowledgeBase: readonly KnowledgeEntry[] = [
  {
    id: "fragrance-trading",
    topic: "Fragrance concentrates and sampling",
    keywords: [
      "fragrance",
      "concentrate",
      "concentrates",
      "sampling",
      "sample",
      "fine fragrance",
      "industrial fragrance",
      "perfume oil",
      "sourcing",
      "trading",
      "scent",
    ],
    answer:
      "ADEPT offers fragrance trading: sourcing and commercial supply of fine and industrial fragrance concentrates. Support typically covers fragrance sourcing, sample evaluation, commercial supply, and application-specific selection (for example fine fragrance/perfume, personal care, home care, candles and diffusers). Commercial details such as pricing and volumes are handled through a quotation.",
    links: [
      { label: "Fragrance Trading", href: "/services/fragrance-trading" },
      {
        label: "Request a fragrance quote",
        href: "/request-quote?type=FRAGRANCE_TRADING",
      },
    ],
  },
  {
    id: "fine-industrial",
    topic: "Fine and industrial fragrances",
    keywords: [
      "fine fragrance",
      "industrial",
      "functional fragrance",
      "prestige",
      "laundry",
      "detergent",
      "body mist",
      "candle",
      "diffuser",
    ],
    answer:
      "Under fragrance trading, ADEPT supports both fine fragrance concentrates (prestige scent work) and industrial / functional fragrance concentrates. Applications discussed on the site include fine fragrance and perfume, body mists and personal care, laundry and detergents, and candles and diffusers. Selection is quotation-led against your brief.",
    links: [
      { label: "Fragrance Trading", href: "/services/fragrance-trading" },
      {
        label: "Request a fragrance quote",
        href: "/request-quote?type=FRAGRANCE_TRADING",
      },
    ],
  },
  {
    id: "packaging",
    topic: "Packaging and components",
    keywords: [
      "packaging",
      "bottle",
      "bottles",
      "cap",
      "caps",
      "pump",
      "collar",
      "label",
      "carton",
      "rigid box",
      "accessory",
      "components",
      "closure",
    ],
    answer:
      "ADEPT supplies packaging and components for fragrance brands, including perfume bottles, caps, pumps and collars, labels and stickers, folding cartons, rigid boxes, accessories, and complete packaging sets. Browse the packaging section or catalogue, then submit a packaging quotation with your requirements.",
    links: [
      { label: "Packaging overview", href: "/packaging" },
      { label: "Catalogue", href: "/catalogue" },
      {
        label: "Request a packaging quote",
        href: "/request-quote?type=PACKAGING_COMPONENTS",
      },
    ],
  },
  {
    id: "toll",
    topic: "Toll manufacturing",
    keywords: [
      "toll",
      "manufacturing",
      "blending",
      "maceration",
      "filling",
      "filtration",
      "batch",
      "production",
      "chilling",
    ],
    answer:
      "Toll manufacturing is production support for brands that need blending, processing, filling, and packaging executed against an agreed manufacturing brief. Capabilities discussed project by project include blending, maceration, chilling and filtration, filling, packaging, and batch production. Final availability depends on product type, materials, and confirmed arrangements — please use the quotation form rather than assuming capacity.",
    links: [
      { label: "Toll Manufacturing", href: "/services/toll-manufacturing" },
      {
        label: "Request a toll manufacturing quote",
        href: "/request-quote?type=TOLL_MANUFACTURING",
      },
    ],
  },
  {
    id: "private-label",
    topic: "Private label",
    keywords: [
      "private label",
      "own brand",
      "finished goods",
      "brief to shelf",
      "white label",
      "brand line",
    ],
    answer:
      "Private label is a coordinated path from brief toward finished product: concept development, fragrance selection, sampling and evaluation, packaging and bottle coordination, label and artwork practicalities, manufacturing against approved specifications, and finished-product delivery per confirmed order instructions. Start with a private-label quotation so the commercial team can scope your project.",
    links: [
      { label: "Private Label", href: "/services/private-label" },
      {
        label: "Request a private label quote",
        href: "/request-quote?type=PRIVATE_LABEL",
      },
    ],
  },
  {
    id: "erp",
    topic: "ERP Solutions",
    keywords: [
      "erp",
      "inventory",
      "software",
      "operations system",
      "purchasing",
      "production workflow",
      "finance reporting",
      "integration",
    ],
    answer:
      "ERP Solutions cover custom and third-party ERP for inventory, sales, purchasing, production workflows, manufacturing operations, finance and reporting, and system integrations — scoped to your operations. Engagements typically move through discovery, scope and solution design, development or implementation, then testing and handover. Use the Technology quotation form for an ERP consultation.",
    links: [
      { label: "ERP Solutions", href: "/technology/erp" },
      {
        label: "Technology quotation (ERP)",
        href: "/technology/request-quote?type=erp",
      },
    ],
  },
  {
    id: "website",
    topic: "Website Development",
    keywords: [
      "website",
      "web development",
      "ecommerce",
      "catalogue site",
      "corporate site",
      "b2b site",
      "quotation website",
    ],
    answer:
      "Website Development includes corporate, B2B, ecommerce, product catalogue, and quotation-oriented websites, with optional ERP or operational integrations where APIs and scope allow. Delivery follows requirements, design and development, testing, then launch and agreed support scope.",
    links: [
      { label: "Website Development", href: "/technology/website-development" },
      {
        label: "Technology quotation (Website)",
        href: "/technology/request-quote?type=website",
      },
    ],
  },
  {
    id: "marketing",
    topic: "Digital Marketing",
    keywords: [
      "marketing",
      "digital marketing",
      "seo",
      "social media",
      "advertising",
      "campaign",
      "brand strategy",
      "content",
    ],
    answer:
      "Digital Marketing support covers brand strategy, social media, creative content, search engine optimization, digital advertising, and campaign management — as practical growth support for fragrance and related brands. Planning is matched to audience, channels, and agreed budgets via a Technology quotation.",
    links: [
      { label: "Digital Marketing", href: "/technology/digital-marketing" },
      {
        label: "Technology quotation (Marketing)",
        href: "/technology/request-quote?type=marketing",
      },
    ],
  },
  {
    id: "ai-support",
    topic: "AI Support & Chatbots",
    keywords: [
      "ai support",
      "chatbot",
      "chatbots",
      "ai chatbot",
      "lead capture",
      "automation",
      "ai service",
    ],
    answer:
      "ADEPT offers AI Support & Chatbots as a Technology & Growth service: website chatbots, AI customer support grounded in approved content, lead capture and qualification, knowledge grounding, human handoff paths, and website or CRM-friendly integration where systems allow. This on-site ADEPT Assistant is a knowledge-based FAQ guide for visitors to adeptfragrances.com. To discuss a chatbot project for your own brand, email info@adeptfragrances.com or use the Technology overview.",
    links: [
      { label: "AI Support & Chatbots", href: "/technology/ai-support" },
      { label: "Technology & Growth", href: "/technology" },
      {
        label: "Email ADEPT",
        href: "mailto:info@adeptfragrances.com?subject=AI%20Support%20%26%20Chatbots",
      },
    ],
  },
  {
    id: "quote",
    topic: "Requesting quotations",
    keywords: [
      "quote",
      "quotation",
      "pricing",
      "price",
      "cost",
      "moq",
      "minimum order",
      "how much",
      "request a quote",
      "inquiry",
      "enquiry",
    ],
    answer:
      "I cannot provide prices, minimum order quantities, stock availability, or delivery commitments. ADEPT handles commercial terms through structured quotation forms reviewed by the team. Use the fragrance / packaging / manufacturing quote form for those services, or the Technology quote form for ERP, websites, and digital marketing.",
    links: [
      { label: "Fragrance & manufacturing quote", href: "/request-quote" },
      {
        label: "Technology quote",
        href: "/technology/request-quote",
      },
    ],
  },
  {
    id: "contact",
    topic: "Contact information",
    keywords: [
      "contact",
      "email",
      "phone",
      "reach",
      "speak to",
      "human",
      "talk to someone",
      "support",
      "hello",
    ],
    answer:
      "The official business email is info@adeptfragrances.com. You can also use the Contact page or submit a quotation form so the commercial team receives structured project details. This assistant is automated — it does not mean a staffed live agent is online.",
    links: [
      { label: "Contact page", href: "/contact" },
      { label: "Email info@adeptfragrances.com", href: "mailto:info@adeptfragrances.com" },
      { label: "Request a Quote", href: "/request-quote" },
    ],
  },
  {
    id: "technology-overview",
    topic: "Technology & Growth overview",
    keywords: [
      "technology",
      "growth",
      "software services",
      "digital services",
      "tech services",
    ],
    answer:
      "Technology & Growth covers ERP Solutions, Website Development, Digital Marketing, and AI Support & Chatbots — services that support commercial growth alongside fragrance, packaging, and manufacturing. Browse the Technology overview or open a Technology quotation for the relevant service.",
    links: [
      { label: "Technology & Growth", href: "/technology" },
      { label: "Technology quotation", href: "/technology/request-quote" },
    ],
  },
  {
    id: "about-process",
    topic: "About ADEPT and process",
    keywords: [
      "about",
      "who are you",
      "company",
      "process",
      "how it works",
      "industries",
      "b2b",
    ],
    answer:
      "ADEPT Fragrances is a B2B partner for fragrance concentrates, packaging, manufacturing, and private label, with technology, marketing, and AI chatbot services to support commercial growth. You can learn more on the About, Process, and Industries pages. Specific commercial commitments are confirmed only through quotation and correspondence.",
    links: [
      { label: "About", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Industries", href: "/industries" },
    ],
  },
];

export const FALLBACK_ANSWER =
  "I do not have verified public information for that specific question. ADEPT publishes service descriptions on this website, and commercial details are handled by the team via quotation or email — not by this automated assistant. Please use a quotation form or email info@adeptfragrances.com.";

export const FALLBACK_LINKS: readonly ChatLink[] = [
  { label: "Request a Quote", href: "/request-quote" },
  { label: "Technology quotation", href: "/technology/request-quote" },
  { label: "Contact", href: "/contact" },
  { label: "Email info@adeptfragrances.com", href: "mailto:info@adeptfragrances.com" },
];

/** Phrases that must never be answered with fabricated commercial commitments. */
export const COMMERCIAL_REDIRECT_PATTERN =
  /\b(price|pricing|cost|quote|quotation|moq|minimum\s*order|how\s*much|discount|lead\s*time|delivery\s*time|stock|availability|in\s*stock)\b/i;

export const UNSAFE_REQUEST_PATTERN =
  /\b(password|credit\s*card|cvv|bank\s*account|wire\s*transfer|payment\s*details|upload\s*(passport|id|document)|ssn|social\s*security)\b/i;
