export type NavChild = { href: string; label: string };

export type NavItem = {
  href: string;
  label: string;
  children?: readonly NavChild[];
  /** Path prefix(es) used to highlight the parent when a child is active */
  matchPrefix?: string | readonly string[];
};

export const navigation: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/services/fragrance-trading",
    label: "Solutions",
    matchPrefix: ["/services", "/technology"],
    children: [
      { href: "/services/fragrance-trading", label: "Fragrance Trading" },
      { href: "/services/toll-manufacturing", label: "Toll Manufacturing" },
      { href: "/services/private-label", label: "Private Label" },
      { href: "/technology", label: "Technology & Growth" },
      { href: "/technology/erp", label: "ERP Solutions" },
      { href: "/technology/website-development", label: "Website Development" },
      { href: "/technology/digital-marketing", label: "Digital Marketing" },
      { href: "/technology/ai-support", label: "AI Support & Chatbots" },
    ],
  },
  {
    href: "/packaging",
    label: "Packaging",
    matchPrefix: "/packaging",
    children: [
      { href: "/packaging", label: "All Packaging" },
      { href: "/packaging/perfume-bottles", label: "Perfume Bottles" },
      { href: "/packaging/caps", label: "Caps" },
      { href: "/packaging/pumps-and-collars", label: "Pumps & Collars" },
      { href: "/packaging/labels-and-stickers", label: "Labels & Stickers" },
      { href: "/packaging/folding-cartons", label: "Folding Cartons" },
      { href: "/packaging/rigid-boxes", label: "Rigid Boxes" },
      { href: "/packaging/accessories", label: "Accessories" },
      { href: "/packaging/complete-packaging-sets", label: "Complete Packaging Sets" },
    ],
  },
  { href: "/industries", label: "Industries" },
  { href: "/process", label: "Process" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

export const divisions = [
  {
    title: "Fragrance Trading",
    href: "/services/fragrance-trading",
    summary:
      "Sourcing and commercial supply of fine and industrial fragrance concentrates for brand and manufacturing applications.",
    mode: "Trading & sourcing",
  },
  {
    title: "Packaging & Components",
    href: "/packaging",
    summary:
      "Perfume bottles, closures, pumps, labels, cartons, rigid boxes, accessories, and complete packaging sets for fragrance brands.",
    mode: "Trading & sourcing",
  },
  {
    title: "Toll Manufacturing",
    href: "/services/toll-manufacturing",
    summary:
      "Blending, processing, filling and packaging support for brands that need reliable production partners.",
    mode: "Manufacturing support",
  },
  {
    title: "Private Label",
    href: "/services/private-label",
    summary:
      "Coordinated pathways from fragrance direction and sampling through packaging alignment and finished-product delivery.",
    mode: "Integrated services",
  },
] as const;
