import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { getPublishedProduct } from "@/content/catalogue";
import { getPackagingCategory } from "@/content/packaging";
import { getSiteUrl } from "@/lib/company";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/catalogue/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${getSiteUrl()}/catalogue/${product.slug}`,
    },
  };
}

export default async function CatalogueProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) notFound();

  const category = getPackagingCategory(product.categorySlug);

  return (
    <>
      <PageHero
        eyebrow={category?.title ?? "Catalogue"}
        title={product.name}
        description={`Reference ${product.sku} · ${product.availabilityStatus.replaceAll("_", " ")}`}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            {product.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageSrc}
                alt={product.imageAlt ?? product.name}
                className="w-full border border-charcoal/10 bg-white object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center border border-dashed border-charcoal/20 bg-ivory text-sm text-charcoal-muted">
                Approved product photography pending
              </div>
            )}
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-charcoal-muted">
            <p>{product.description}</p>
            {product.material && (
              <p>
                <span className="text-charcoal">Material:</span> {product.material}
              </p>
            )}
            {product.capacityOrDimensions && (
              <p>
                <span className="text-charcoal">Capacity / dimensions:</span>{" "}
                {product.capacityOrDimensions}
              </p>
            )}
            {product.finishes && product.finishes.length > 0 && (
              <p>
                <span className="text-charcoal">Finishes:</span> {product.finishes.join(", ")}
              </p>
            )}
            {product.customizationNotes && (
              <p>
                <span className="text-charcoal">Customization:</span> {product.customizationNotes}
              </p>
            )}
            {product.moq && (
              <p>
                <span className="text-charcoal">MOQ:</span> {product.moq}
              </p>
            )}
            {product.specificationUrl && (
              <p>
                <a href={product.specificationUrl} className="underline underline-offset-2">
                  Specification document
                </a>
              </p>
            )}
            <p className="text-xs">
              Prices and stock are provided on quotation. Component compatibility is confirmed only
              after technical review.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href={`/request-quote?type=PACKAGING_COMPONENTS`}>Request a Quote</Button>
              <Button href="/catalogue" variant="secondary">
                Back to catalogue
              </Button>
            </div>
            {category && (
              <p>
                <Link href={category.href} className="underline underline-offset-2">
                  ← {category.title}
                </Link>
              </p>
            )}
          </div>
        </Container>
      </Section>
      <QuoteCta primaryHref="/request-quote?type=PACKAGING_COMPONENTS" />
    </>
  );
}
