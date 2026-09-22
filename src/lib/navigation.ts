export type NavChild = {
  href: string;
  label: string;
  /** Optional secondary line under the label */
  hint?: string;
};

/** Non-link group heading with indented children (e.g. Technology & Growth). */
export type NavGroup = {
  type: "group";
  label: string;
  children: readonly NavChild[];
};

export type NavDivider = { type: "divider" };

export type NavMenuEntry = NavChild | NavGroup | NavDivider;

export function isNavGroup(entry: NavMenuEntry): entry is NavGroup {
  return "type" in entry && entry.type === "group";
}

export function isNavDivider(entry: NavMenuEntry): entry is NavDivider {
  return "type" in entry && entry.type === "divider";
}

export function isNavChild(entry: NavMenuEntry): entry is NavChild {
  return !("type" in entry);
}

export type NavItem = {
  href: string;
  label: string;
  children?: readonly NavMenuEntry[];
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
      {
        href: "/services/fragrance-trading",
        label: "Fragrance Trading",
        hint: "Concentrates & sampling",
      },
      {
        href: "/services/toll-manufacturing",
        label: "Toll Manufacturing",
        hint: "Blending to filling",
      },
      {
        href: "/services/private-label",
        label: "Private Label",
        hint: "Brief to finished goods",
      },
      { type: "divider" },
      {
        type: "group",
        label: "Technology & Growth",
        children: [
          { href: "/technology", label: "Overview" },
          { href: "/technology/erp", label: "ERP Solutions", hint: "Custom & third-party ERP" },
          {
            href: "/technology/website-development",
            label: "Website Development",
            hint: "Sites & catalogues",
          },
          {
            href: "/technology/digital-marketing",
            label: "Digital Marketing",
            hint: "Brand & campaigns",
          },
          {
            href: "/technology/ai-support",
            label: "AI Support & Chatbots",
            hint: "Chatbots & AI support",
          },
        ],
      },
    ],
  },
  {
    href: "/packaging",
    label: "Packaging",
    matchPrefix: "/packaging",
    children: [
      { href: "/packaging", label: "All Packaging", hint: "Full component range" },
      { href: "/packaging/perfume-bottles", label: "Perfume Bottles", hint: "Glass & stock formats" },
      { href: "/packaging/caps", label: "Caps", hint: "Closures & finishes" },
      {
        href: "/packaging/pumps-and-collars",
        label: "Pumps & Collars",
        hint: "Dispensing systems",
      },
      {
        href: "/packaging/labels-and-stickers",
        label: "Labels & Stickers",
        hint: "Print & materials",
      },
      { href: "/packaging/folding-cartons", label: "Folding Cartons", hint: "Secondary cartons" },
      {
        href: "/packaging/rigid-boxes",
        label: "Rigid Boxes",
        hint: "Presentation packaging",
      },
      { href: "/packaging/accessories", label: "Accessories", hint: "Finishing details" },
      {
        href: "/packaging/complete-packaging-sets",
        label: "Complete Packaging Sets",
        hint: "Coordinated systems",
      },
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
