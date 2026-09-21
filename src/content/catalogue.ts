/**
 * Quotation-based B2B catalogue.
 * Only products with verified: true and required fields are published.
 * Do not invent SKUs, MOQ, prices, stock, lead times, or photographs.
 */

export type CatalogueProduct = {
  slug: string;
  name: string;
  sku: string;
  categorySlug: string;
  description: string;
  material?: string;
  capacityOrDimensions?: string;
  finishes?: string[];
  customizationNotes?: string;
  /** Only publish when commercially confirmed */
  moq?: string;
  imageSrc?: string;
  imageAlt?: string;
  specificationUrl?: string;
  availabilityStatus: "unpublished" | "available_to_quote" | "limited" | "discontinued";
  /** Must be true and status !== unpublished to appear publicly */
  verified: boolean;
};

/**
 * Maintain confirmed products here.
 * Leave empty until SKUs, specs, and imagery are verified.
 */
export const catalogueProducts: CatalogueProduct[] = [];

export function getPublishedProducts(categorySlug?: string): CatalogueProduct[] {
  return catalogueProducts.filter(
    (p) =>
      p.verified &&
      p.availabilityStatus !== "unpublished" &&
      (!categorySlug || p.categorySlug === categorySlug),
  );
}

export function getPublishedProduct(slug: string): CatalogueProduct | undefined {
  return getPublishedProducts().find((p) => p.slug === slug);
}
