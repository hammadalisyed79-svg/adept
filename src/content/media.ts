/**
 * Central media registry for ADEPT visuals.
 * Prefer photorealistic PNG under /public/images/adept/.
 * SVG files remain only as fallbacks if a PNG is missing.
 */

export type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  decorative?: boolean;
  placeholderNote?: string;
};

const base = "/images/adept";

export const media = {
  heroFragranceSolutions: {
    id: "hero-fragrance-solutions",
    src: `${base}/hero-fragrance-solutions.png`,
    alt: "Studio composition of perfume bottle, premium cap, spray pump, amber fragrance concentrate, label and rigid box on an ivory background",
  },
  fragranceTrading: {
    id: "fragrance-trading",
    src: `${base}/fragrance-trading.png`,
    alt: "Amber fragrance concentrate bottles with evaluation blotters in a professional sampling setting",
  },
  packagingComponents: {
    id: "packaging-components",
    src: `${base}/packaging-components.png`,
    alt: "Perfume bottle with caps and spray pump components on an ivory studio surface",
  },
  tollManufacturing: {
    id: "toll-manufacturing",
    src: `${base}/toll-manufacturing.png`,
    alt: "Illustrative stainless-steel fragrance processing environment — not a verified ADEPT facility photograph",
    placeholderNote:
      "Illustrative manufacturing imagery until verified ADEPT facility photography is available.",
  },
  privateLabel: {
    id: "private-label",
    src: `${base}/private-label.png`,
    alt: "Finished perfume bottle with coordinated ivory presentation box",
  },
  perfumeBottles: {
    id: "perfume-bottles",
    src: `${base}/perfume-bottles.png`,
    alt: "Assortment of clear glass perfume bottles",
  },
  caps: {
    id: "caps",
    src: `${base}/caps.png`,
    alt: "Assortment of perfume caps and closures",
  },
  pumpsCollars: {
    id: "pumps-collars",
    src: `${base}/pumps-collars.png`,
    alt: "Perfume spray pumps and collar components",
  },
  labelsStickers: {
    id: "labels-stickers",
    src: `${base}/labels-stickers.png`,
    alt: "Label and sticker material samples for fragrance packaging",
  },
  foldingCartons: {
    id: "folding-cartons",
    src: `${base}/folding-cartons.png`,
    alt: "Folding carton packaging for fragrance products",
  },
  rigidBoxes: {
    id: "rigid-boxes",
    src: `${base}/rigid-boxes.png`,
    alt: "Rigid presentation boxes for perfume packaging",
  },
  accessories: {
    id: "accessories",
    src: `${base}/accessories.png`,
    alt: "Illustrative packaging styling photography — replace with ADEPT fragrance packaging accessories when product photography is available",
    placeholderNote:
      "Interim lifestyle styling image. Replace with genuine ADEPT fragrance packaging accessories photography (collars, rings, ribbons, finishing parts) before photography sign-off.",
  },
  completePackagingSet: {
    id: "complete-packaging-set",
    src: `${base}/complete-packaging-set.png`,
    alt: "Coordinated complete packaging set with bottle, pump, cap, label and box",
  },
  fragranceOils: {
    id: "fragrance-oils",
    src: `${base}/fragrance-oils.png`,
    alt: "Amber fragrance concentrate bottles and laboratory glassware",
  },
  manufacturingFilling: {
    id: "manufacturing-filling",
    src: `${base}/manufacturing-filling.png`,
    alt: "Illustrative filling operation — not a verified ADEPT facility photograph",
    placeholderNote:
      "Illustrative manufacturing imagery until verified ADEPT facility photography is available.",
  },
  manufacturingMixing: {
    id: "manufacturing-mixing",
    src: `${base}/manufacturing-mixing.png`,
    alt: "Illustrative mixing vessel — not a verified ADEPT facility photograph",
    placeholderNote:
      "Illustrative manufacturing imagery until verified ADEPT facility photography is available.",
  },
  qualityControl: {
    id: "quality-control",
    src: `${base}/quality-control.png`,
    alt: "Illustrative quality inspection — not a verified ADEPT facility photograph",
    placeholderNote:
      "Illustrative manufacturing imagery until verified ADEPT facility photography is available.",
  },
  completeBrandSolution: {
    id: "complete-brand-solution",
    src: `${base}/complete-brand-solution.png`,
    alt: "Fragrance concentrate with bottle, pump, cap, label and box as one coordinated project",
  },
  industryFineFragrance: {
    id: "industry-fine-fragrance",
    src: `${base}/industry-fine-fragrance.png`,
    alt: "Fine fragrance perfume bottle on a studio surface",
  },
  industryPersonalCare: {
    id: "industry-personal-care",
    src: `${base}/industry-personal-care.png`,
    alt: "Personal care fragrance packaging on a studio surface",
  },
  industryHomeCare: {
    id: "industry-home-care",
    src: `${base}/industry-home-care.png`,
    alt: "Home care fragrance product packaging",
  },
  industryCandles: {
    id: "industry-candles",
    src: `${base}/industry-candles.png`,
    alt: "Candle and home fragrance vessels",
  },
  technologyGrowth: {
    id: "technology-growth",
    src: `${base}/technology-growth.svg`,
    alt: "Technology & Growth interface preview — superseded by CSS TechnologyVisual on pages",
    decorative: true,
    placeholderNote:
      "No approved photography yet. Pages use TechnologyVisual CSS interface previews. SVG retained for registry fallback only.",
  },
  technologyErp: {
    id: "technology-erp",
    src: `${base}/technology-erp.svg`,
    alt: "ERP interface preview — superseded by CSS TechnologyVisual on pages",
    decorative: true,
    placeholderNote:
      "No approved photography yet. Pages use TechnologyVisual CSS interface previews.",
  },
  technologyWebsite: {
    id: "technology-website",
    src: `${base}/technology-website.svg`,
    alt: "Website interface preview — superseded by CSS TechnologyVisual on pages",
    decorative: true,
    placeholderNote:
      "No approved photography yet. Pages use TechnologyVisual CSS interface previews.",
  },
  technologyMarketing: {
    id: "technology-marketing",
    src: `${base}/technology-marketing.svg`,
    alt: "Marketing interface preview — superseded by CSS TechnologyVisual on pages",
    decorative: true,
    placeholderNote:
      "No approved photography yet. Pages use TechnologyVisual CSS interface previews.",
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

export function getMedia(key: MediaKey): MediaAsset {
  return media[key];
}

export const packagingMediaBySlug: Record<string, MediaKey> = {
  "perfume-bottles": "perfumeBottles",
  caps: "caps",
  "pumps-and-collars": "pumpsCollars",
  "labels-and-stickers": "labelsStickers",
  "folding-cartons": "foldingCartons",
  "rigid-boxes": "rigidBoxes",
  accessories: "accessories",
  "complete-packaging-sets": "completePackagingSet",
};

export const divisionMediaByHref: Record<string, MediaKey> = {
  "/services/fragrance-trading": "fragranceTrading",
  "/packaging": "packagingComponents",
  "/services/toll-manufacturing": "tollManufacturing",
  "/services/private-label": "privateLabel",
};

export const industryMediaBySlug: Record<string, MediaKey> = {
  "fine-fragrance": "industryFineFragrance",
  "personal-care": "industryPersonalCare",
  "home-care-detergents": "industryHomeCare",
  "candles-home-fragrance": "industryCandles",
};
