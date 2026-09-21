/**
 * Central media registry for ADEPT visuals.
 * Replace `src` with approved photography under /public/images/adept/
 * without editing page layouts.
 */

export type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  /** When true, image is decorative and should use empty alt in UI if preferred */
  decorative?: boolean;
  placeholderNote?: string;
};

const base = "/images/adept";

export const media = {
  heroFragranceSolutions: {
    id: "hero-fragrance-solutions",
    src: `${base}/hero-fragrance-solutions.svg`,
    alt: "Editorial composition suggesting perfume bottle, closure, concentrate and packaging elements for a complete fragrance brand solution",
    placeholderNote: "Replace with approved ADEPT product photography",
  },
  fragranceTrading: {
    id: "fragrance-trading",
    src: `${base}/fragrance-trading.svg`,
    alt: "Professional fragrance concentrate evaluation setting",
  },
  packagingComponents: {
    id: "packaging-components",
    src: `${base}/packaging-components.svg`,
    alt: "Perfume packaging components including bottle, cap and pump forms",
  },
  tollManufacturing: {
    id: "toll-manufacturing",
    src: `${base}/toll-manufacturing.svg`,
    alt: "Abstract representation of fragrance processing and filling environment — illustrative placeholder, not a verified ADEPT facility photograph",
  },
  privateLabel: {
    id: "private-label",
    src: `${base}/private-label.svg`,
    alt: "Finished fragrance presentation with coordinated outer packaging",
  },
  perfumeBottles: {
    id: "perfume-bottles",
    src: `${base}/perfume-bottles.svg`,
    alt: "Glass perfume bottle silhouettes",
  },
  caps: { id: "caps", src: `${base}/caps.svg`, alt: "Perfume cap and closure forms" },
  pumpsCollars: {
    id: "pumps-collars",
    src: `${base}/pumps-collars.svg`,
    alt: "Spray pump and collar components",
  },
  labelsStickers: {
    id: "labels-stickers",
    src: `${base}/labels-stickers.svg`,
    alt: "Label and sticker material treatments",
  },
  foldingCartons: {
    id: "folding-cartons",
    src: `${base}/folding-cartons.svg`,
    alt: "Folding carton packaging forms",
  },
  rigidBoxes: {
    id: "rigid-boxes",
    src: `${base}/rigid-boxes.svg`,
    alt: "Rigid presentation box forms",
  },
  accessories: {
    id: "accessories",
    src: `${base}/accessories.svg`,
    alt: "Fragrance packaging accessories",
  },
  completePackagingSet: {
    id: "complete-packaging-set",
    src: `${base}/complete-packaging-set.svg`,
    alt: "Coordinated complete packaging set composition",
  },
  fragranceOils: {
    id: "fragrance-oils",
    src: `${base}/fragrance-oils.svg`,
    alt: "Fragrance concentrate and laboratory glassware",
  },
  manufacturingFilling: {
    id: "manufacturing-filling",
    src: `${base}/manufacturing-filling.svg`,
    alt: "Illustrative filling process visual — placeholder, not a verified ADEPT facility photograph",
  },
  manufacturingMixing: {
    id: "manufacturing-mixing",
    src: `${base}/manufacturing-mixing.svg`,
    alt: "Illustrative mixing process visual — placeholder, not a verified ADEPT facility photograph",
  },
  qualityControl: {
    id: "quality-control",
    src: `${base}/quality-control.svg`,
    alt: "Illustrative quality inspection visual — placeholder",
  },
  completeBrandSolution: {
    id: "complete-brand-solution",
    src: `${base}/complete-brand-solution.svg`,
    alt: "Fragrance concentrate with bottle, pump, cap, label and box as one coordinated project",
  },
  industryFineFragrance: {
    id: "industry-fine-fragrance",
    src: `${base}/industry-fine-fragrance.svg`,
    alt: "Fine fragrance category visual",
  },
  industryPersonalCare: {
    id: "industry-personal-care",
    src: `${base}/industry-personal-care.svg`,
    alt: "Personal care fragrance category visual",
  },
  industryHomeCare: {
    id: "industry-home-care",
    src: `${base}/industry-home-care.svg`,
    alt: "Home care and detergents fragrance category visual",
  },
  industryCandles: {
    id: "industry-candles",
    src: `${base}/industry-candles.svg`,
    alt: "Candles and home fragrance category visual",
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

export function getMedia(key: MediaKey): MediaAsset {
  return media[key];
}

/** Map packaging category slug → media key */
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
