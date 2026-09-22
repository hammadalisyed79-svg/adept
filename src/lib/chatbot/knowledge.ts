/**
 * ADEPT Concierge knowledge — grounded in published website content.
 * Warm, professional first-person voice. No invented commercial claims.
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

/** Public display name in the chat header and launcher. */
export const ASSISTANT_NAME = "ADEPT";

/** Short status line under the name — professional, not technical. */
export const ASSISTANT_STATUS = "Commercial guidance";

/** Opening message for a fresh conversation. */
export const WELCOME_MESSAGE =
  "Hello — welcome to ADEPT Fragrances.\n\nI am here to help with fragrance concentrates, packaging, manufacturing, private label, and Technology & Growth. May I have your name, please?";

export const CONTACT_EMAIL = "info@adeptfragrances.com";

/** Quick-action chips — short labels, easy to tap. */
export const quickActions = [
  {
    id: "fragrance",
    label: "Fragrance",
    href: "/services/fragrance-trading",
    prompt: "Tell me about fragrance concentrates and sampling",
  },
  {
    id: "packaging",
    label: "Packaging",
    href: "/packaging",
    prompt: "What packaging and components do you offer?",
  },
  {
    id: "toll",
    label: "Manufacturing",
    href: "/services/toll-manufacturing",
    prompt: "Tell me about toll manufacturing",
  },
  {
    id: "private-label",
    label: "Private label",
    href: "/services/private-label",
    prompt: "How does private label work?",
  },
  {
    id: "technology",
    label: "Technology",
    href: "/technology",
    prompt: "What Technology and Growth services do you offer?",
  },
  {
    id: "process",
    label: "Our process",
    href: "/process",
    prompt: "How does your commercial process work?",
  },
  {
    id: "quote",
    label: "Request a quote",
    href: "/request-quote",
    prompt: "How do I request a quotation?",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    prompt: "How can I reach your team?",
  },
] as const;

export const knowledgeBase: readonly KnowledgeEntry[] = [
  {
    id: "about-brand",
    topic: "About ADEPT and our positioning",
    keywords: [
      "about",
      "who are you",
      "company",
      "adept",
      "what do you do",
      "b2b",
      "brand",
      "positioning",
      "tagline",
      "hello",
      "hi",
      "hey",
    ],
    answer:
      "ADEPT Fragrances is a B2B partner for fragrance brand builders. Our focus is precision and clarity: fragrance concentrates, packaging components, manufacturing support, and private label — coordinated from concept toward finished product. Alongside that, Technology & Growth covers ERP, websites, digital marketing, and AI chat support for commercial teams. We publish only confirmed facts, and commercial terms are always confirmed by quotation and email.",
    links: [
      { label: "About ADEPT", href: "/about" },
      { label: "Request a quote", href: "/request-quote" },
    ],
  },
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
      "oil",
    ],
    answer:
      "We source and supply fine and industrial fragrance concentrates for brand and manufacturing applications. Typical support includes fragrance selection against your brief, sample evaluation, and commercial supply. Applications we discuss include fine fragrance and perfume, personal care, home care and detergents, and candles or diffusers. Pricing and volumes are confirmed through a fragrance quotation — I am happy to point you there.",
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
      "Under fragrance trading we support both fine fragrance concentrates for prestige scent work and industrial or functional concentrates for applications such as laundry, detergents, personal care, candles, and diffusers. Selection is quotation-led against your brief, so we can match application and commercial constraints carefully.",
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
      "box",
    ],
    answer:
      "We supply packaging and components for fragrance brands — perfume bottles, caps, pumps and collars, labels and stickers, folding cartons, rigid boxes, accessories, and complete packaging sets. You can browse categories on the Packaging pages or the B2B catalogue, then share sizes, finishes, and volumes on a packaging quotation.",
    links: [
      { label: "Packaging overview", href: "/packaging" },
      { label: "B2B Catalogue", href: "/catalogue" },
      {
        label: "Request a packaging quote",
        href: "/request-quote?type=PACKAGING_COMPONENTS",
      },
    ],
  },
  {
    id: "catalogue",
    topic: "B2B catalogue",
    keywords: ["catalogue", "catalog", "sku", "product list", "published products"],
    answer:
      "Our B2B catalogue is quotation-based — not a retail cart. Products appear only when names, references, and specifications are verified. If nothing is published yet, you can still request a packaging or fragrance quotation and we will work from your brief.",
    links: [
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
      "Toll manufacturing is production support when you need blending, processing, filling, and packaging against an agreed brief. We discuss capabilities project by project — including blending, maceration, chilling and filtration, filling, packaging, and batch production. Availability depends on product type, materials, and confirmed arrangements, so a quotation is the right next step.",
    links: [
      { label: "Toll Manufacturing", href: "/services/toll-manufacturing" },
      {
        label: "Discuss manufacturing",
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
      "finished product",
    ],
    answer:
      "Private label is a coordinated path from brief toward finished goods: concept direction, fragrance selection, sampling, packaging and bottle alignment, label practicalities, manufacturing against approved specifications, and delivery per confirmed order instructions. Share your concept notes and timeline on a private-label quotation and we will outline next steps.",
    links: [
      { label: "Private Label", href: "/services/private-label" },
      {
        label: "Start a private label quote",
        href: "/request-quote?type=PRIVATE_LABEL",
      },
    ],
  },
  {
    id: "complete-project",
    topic: "Coordinated fragrance projects",
    keywords: [
      "complete",
      "full project",
      "one project",
      "everything",
      "end to end",
      "from concept",
      "finished product",
      "all in one",
    ],
    answer:
      "Many clients coordinate fragrance, packaging, and production as one project — concentrate, bottle, pump, collar, cap, label, and presentation box aligned together. You can start with a single commercial inquiry and we will help clarify which divisions are needed.",
    links: [
      { label: "Explore our divisions", href: "/#divisions" },
      { label: "Request a quote", href: "/request-quote" },
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
      "beyond manufacturing",
      "beyond product",
    ],
    answer:
      "Technology & Growth sits alongside our fragrance and packaging work. It covers four practical offerings: ERP Solutions, Website Development, Digital Marketing, and AI Support & Chatbots. Each engagement is scoped project by project so the systems and channels match how your business actually works.",
    links: [
      { label: "Technology & Growth", href: "/technology" },
      { label: "Technology quotation", href: "/technology/request-quote" },
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
      "ERP Solutions cover custom and third-party ERP for inventory, sales, purchasing, production workflows, manufacturing operations, finance reporting, and integrations — scoped to your operations. We typically move through discovery, solution design, build or implementation, then testing and handover. Use a Technology quotation for an ERP consultation.",
    links: [
      { label: "ERP Solutions", href: "/technology/erp" },
      {
        label: "ERP quotation",
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
      "Website Development includes corporate and B2B sites, catalogues, quotation experiences, and ecommerce where the commercial model fits — with optional links to operational systems when APIs allow. Delivery follows requirements, design and build, testing, then launch and agreed support.",
    links: [
      { label: "Website Development", href: "/technology/website-development" },
      {
        label: "Website quotation",
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
      "Digital Marketing support covers brand strategy, social media, creative content, SEO, paid campaigns, and campaign management — practical growth work for fragrance and related brands. We plan channels and reporting against your audience and budget through a Technology quotation.",
    links: [
      { label: "Digital Marketing", href: "/technology/digital-marketing" },
      {
        label: "Marketing quotation",
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
      "AI Support & Chatbots help your visitors with common questions, capture project details, and hand serious enquiries to your team. Engagements are grounded in your approved content and commercial rules. If you want this for your own brand site, open an AI Support quotation and share your website and handoff preferences.",
    links: [
      { label: "AI Support & Chatbots", href: "/technology/ai-support" },
      {
        label: "AI Support quotation",
        href: "/technology/request-quote?type=ai",
      },
    ],
  },
  {
    id: "process",
    topic: "Commercial process",
    keywords: [
      "process",
      "how it works",
      "steps",
      "workflow",
      "timeline",
      "brief",
      "approval",
      "dispatch",
      "how do you work",
    ],
    answer:
      "Our published commercial process runs through eight steps: Brief, Fragrance or Component Selection, Sampling, Approval, Production, Quality, Packing, and Dispatch. On the homepage we summarise this as four phases — brief and selection, sampling and approval, production and quality, packing and dispatch. Each stage is documented enough for procurement and brand teams to stay aligned.",
    links: [
      { label: "Full process", href: "/process" },
      { label: "Request a quote", href: "/request-quote" },
    ],
  },
  {
    id: "industries",
    topic: "Industries we serve",
    keywords: [
      "industries",
      "industry",
      "fine fragrance",
      "personal care",
      "home care",
      "detergents",
      "candles",
      "home fragrance",
      "categories",
    ],
    answer:
      "We support categories that depend on scent: Fine Fragrance, Personal Care, Home Care and Detergents, and Candles and Home Fragrance. Each industry page outlines typical applications and relevant services so you can match your product category to the right pathway.",
    links: [
      { label: "Industries", href: "/industries" },
      { label: "Request a quote", href: "/request-quote" },
    ],
  },
  {
    id: "insights",
    topic: "Insights and guidance",
    keywords: ["insights", "articles", "blog", "guidance", "education"],
    answer:
      "Insights are educational notes for commercial teams — fragrance trading, concentration, private-label manufacturing, and industrial applications — without fictional research claims. Browse the Insights section when you want practical background reading.",
    links: [
      { label: "Insights", href: "/insights" },
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
      "I cannot confirm prices, minimum order quantities, stock, or delivery times here — those are reviewed by the commercial team against your brief. The quickest path is a structured quotation: use the fragrance, packaging, manufacturing, or private-label form, or the Technology form for ERP, website, marketing, and AI projects.",
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
      "talk to someone",
      "support",
      "address",
      "location",
    ],
    answer:
      `You can reach us at ${CONTACT_EMAIL}, or use the Contact page and quotation forms so the commercial team receives a clear brief. Location details are shared during commercial discussions once verified. If you prefer, I can guide you to the right form for your project.`,
    links: [
      { label: "Contact page", href: "/contact" },
      { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
      { label: "Request a Quote", href: "/request-quote" },
    ],
  },
];

export const FALLBACK_ANSWER =
  "I want to make sure I guide you correctly. Could you share a little more — for example fragrance, packaging, manufacturing, private label, technology, or whether you need a quotation? You can also email info@adeptfragrances.com and our team will follow up.";

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

/** @deprecated Kept for any residual imports — prefer WELCOME_MESSAGE. */
export const ASSISTANT_DISCLAIMER = WELCOME_MESSAGE;
