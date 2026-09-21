export type PackagingCategory = {
  slug: string;
  title: string;
  href: string;
  metaDescription: string;
  summary: string;
  points: string[];
  inquiryLabel: string;
};

export const packagingCategories: PackagingCategory[] = [
  {
    slug: "perfume-bottles",
    title: "Perfume Bottles",
    href: "/packaging/perfume-bottles",
    metaDescription:
      "Glass perfume bottles, stock and custom designs, sizes, finishes, and decoration options for fragrance brands.",
    summary:
      "Glass perfume bottles spanning stock designs and custom development conversations — including sizes, finishes, and decoration options where available.",
    points: [
      "Glass perfume bottles",
      "Stock designs",
      "Custom design discussions",
      "Available sizes and finishes",
      "Decoration options where offered",
    ],
    inquiryLabel: "Perfume bottles",
  },
  {
    slug: "caps",
    title: "Caps",
    href: "/packaging/caps",
    metaDescription:
      "Plastic, metal, wooden, magnetic, and decorative caps for perfume packaging.",
    summary:
      "Closure options including plastic, metal, wooden, magnetic, and decorative caps selected against bottle and brand requirements.",
    points: [
      "Plastic caps",
      "Metal caps",
      "Wooden caps",
      "Magnetic caps",
      "Decorative caps",
    ],
    inquiryLabel: "Caps",
  },
  {
    slug: "pumps-and-collars",
    title: "Pumps & Collars",
    href: "/packaging/pumps-and-collars",
    metaDescription:
      "Atomizers, spray pumps, crimp and screw pumps, collars, and decorative neck components.",
    summary:
      "Dispensing and neck components including atomizers, spray pumps, crimp and screw systems, collars, and decorative neck parts.",
    points: [
      "Atomizers and spray pumps",
      "Crimp and screw pumps",
      "Collars",
      "Decorative neck components",
    ],
    inquiryLabel: "Pumps & collars",
  },
  {
    slug: "labels-and-stickers",
    title: "Labels & Stickers",
    href: "/packaging/labels-and-stickers",
    metaDescription:
      "Paper, transparent, metallic, textured, printed, embossed, and specialty labels for fragrance packaging.",
    summary:
      "Label and sticker formats covering paper, transparent, metallic, textured, printed, embossed, and specialty finishes.",
    points: [
      "Paper labels",
      "Transparent labels",
      "Metallic and textured options",
      "Printed and embossed finishes",
      "Specialty labels",
    ],
    inquiryLabel: "Labels & stickers",
  },
  {
    slug: "folding-cartons",
    title: "Folding Cartons",
    href: "/packaging/folding-cartons",
    metaDescription:
      "Printed paperboard cartons, folding boxes, custom dimensions, and finishing options.",
    summary:
      "Printed paperboard cartons and folding boxes with custom dimension and finishing discussions as requirements allow.",
    points: [
      "Printed paperboard cartons",
      "Folding boxes",
      "Custom dimensions",
      "Finishing options",
    ],
    inquiryLabel: "Folding cartons",
  },
  {
    slug: "rigid-boxes",
    title: "Rigid Boxes",
    href: "/packaging/rigid-boxes",
    metaDescription:
      "Hard boxes, magnetic boxes, luxury presentation boxes, gift packaging, and inserts.",
    summary:
      "Rigid and presentation packaging including hard boxes, magnetic closures, luxury gift formats, and inserts.",
    points: [
      "Hard boxes",
      "Magnetic boxes",
      "Luxury presentation boxes",
      "Gift packaging",
      "Inserts",
    ],
    inquiryLabel: "Rigid boxes",
  },
  {
    slug: "accessories",
    title: "Accessories",
    href: "/packaging/accessories",
    metaDescription:
      "Metal plates, inserts, sleeves, ribbons, shopping bags, testers, discovery packaging, and related items.",
    summary:
      "Supporting accessories such as metal plates, inserts, sleeves, ribbons, shopping bags, testers, and discovery packaging.",
    points: [
      "Metal plates and inserts",
      "Sleeves and ribbons",
      "Shopping bags",
      "Testers and discovery packaging",
      "Related accessories",
    ],
    inquiryLabel: "Accessories",
  },
  {
    slug: "complete-packaging-sets",
    title: "Complete Packaging Sets",
    href: "/packaging/complete-packaging-sets",
    metaDescription:
      "Coordinated bottle, pump, collar, cap, label, and box packaging sets for fragrance brands.",
    summary:
      "Coordinated packaging combinations — bottle, pump, collar, cap, label, and box — scoped project by project.",
    points: [
      "Bottle + pump + collar + cap",
      "Label coordination",
      "Outer box / carton",
      "Set-level quotation briefs",
    ],
    inquiryLabel: "Complete packaging sets",
  },
];

export function getPackagingCategory(slug: string): PackagingCategory | undefined {
  return packagingCategories.find((c) => c.slug === slug);
}
