export type Industry = {
  slug: string;
  title: string;
  metaDescription: string;
  summary: string;
  applications: string[];
  relevantServices: { title: string; href: string }[];
};

export const industries: Industry[] = [
  {
    slug: "fine-fragrance",
    title: "Fine Fragrance",
    metaDescription:
      "Fragrance concentrates and manufacturing support for fine fragrance and perfume brands.",
    summary:
      "Support for perfume houses and emerging fragrance brands seeking concentrates, sampling, and finished-product manufacturing pathways.",
    applications: [
      "Eau de parfum and eau de toilette concepts",
      "Niche and commercial fragrance lines",
      "Sample and evaluation sets",
      "Bottle filling and packaging coordination",
    ],
    relevantServices: [
      { title: "Fragrance Trading", href: "/services/fragrance-trading" },
      { title: "Private Label", href: "/services/private-label" },
      { title: "Toll Manufacturing", href: "/services/toll-manufacturing" },
    ],
  },
  {
    slug: "personal-care",
    title: "Personal Care",
    metaDescription:
      "Fragrance solutions for personal care products including body care and toiletries.",
    summary:
      "Application-focused fragrance selection and supply for personal care formulations where scent performance and stability matter.",
    applications: [
      "Body mists and sprays",
      "Lotions and creams",
      "Hair care fragrance",
      "Bath and shower products",
    ],
    relevantServices: [
      { title: "Fragrance Trading", href: "/services/fragrance-trading" },
      { title: "Toll Manufacturing", href: "/services/toll-manufacturing" },
    ],
  },
  {
    slug: "home-care-detergents",
    title: "Home Care and Detergents",
    metaDescription:
      "Industrial fragrance concentrates for detergents, cleaners, and home care products.",
    summary:
      "Industrial fragrance options developed for functional products where cost, performance, and application fit are critical.",
    applications: [
      "Laundry detergents",
      "Fabric softeners",
      "Surface cleaners",
      "Dishwashing products",
    ],
    relevantServices: [
      { title: "Fragrance Trading", href: "/services/fragrance-trading" },
      { title: "Toll Manufacturing", href: "/services/toll-manufacturing" },
    ],
  },
  {
    slug: "candles-home-fragrance",
    title: "Candles and Home Fragrance",
    metaDescription:
      "Fragrance solutions for candles, diffusers, and home fragrance products.",
    summary:
      "Fragrance selection and supply for candle makers and home fragrance brands seeking distinctive scent profiles.",
    applications: [
      "Scented candles",
      "Reed and liquid diffusers",
      "Room sprays",
      "Wax melts and related formats",
    ],
    relevantServices: [
      { title: "Fragrance Trading", href: "/services/fragrance-trading" },
      { title: "Private Label", href: "/services/private-label" },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
