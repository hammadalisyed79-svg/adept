export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/services/fragrance-trading",
    label: "Services",
    children: [
      { href: "/services/fragrance-trading", label: "Fragrance Trading" },
      { href: "/services/toll-manufacturing", label: "Toll Manufacturing" },
      { href: "/services/private-label", label: "Private Label" },
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
      "Sourcing and supply of fine and industrial fragrance concentrates tailored to your application.",
  },
  {
    title: "Toll Manufacturing",
    href: "/services/toll-manufacturing",
    summary:
      "Blending, processing, filling and packaging support for brands that need reliable production partners.",
  },
  {
    title: "Private Label",
    href: "/services/private-label",
    summary:
      "End-to-end development from fragrance direction and sampling through finished-product delivery.",
  },
] as const;
