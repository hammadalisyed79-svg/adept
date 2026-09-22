import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { getPublishedProducts } from "@/content/catalogue";
import { packagingCategories } from "@/content/packaging";

export const metadata: Metadata = {
  title: "B2B Catalogue",
  description:
    "Quotation-based catalogue of fragrance packaging components. Products appear only when specifications are verified.",
  alternates: { canonical: "/catalogue" },
};

export default function CataloguePage() {
  const products = getPublishedProducts();

  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="Quotation-based product catalogue"
        description="A curated selection of packaging components for quotation. Each listing reflects confirmed names, references, and specifications."
      />
      <Section>
        <Container>
          {products.length === 0 ? (
            <div className="border border-dashed border-charcoal/20 bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl text-charcoal">Catalogue in preparation</p>
              <p className="mx-auto mt-3 max-w-xl text-charcoal-muted">
                Product references will appear here as they are released for quotation. In the
                meantime, request packaging or fragrance support through our commercial forms.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/request-quote?type=PACKAGING_COMPONENTS">Request a Quote</Button>
                <Button href="/packaging" variant="secondary">
                  View packaging categories
                </Button>
                <Button href="/services/fragrance-trading" variant="ghost">
                  Fragrance trading
                </Button>
              </div>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const category = packagingCategories.find((c) => c.slug === p.categorySlug);
                return (
                  <li key={p.slug} className="border border-charcoal/10 bg-white p-6">
                    <p className="text-xs uppercase tracking-wideish text-champagne-deep">
                      {category?.title ?? p.categorySlug}
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-charcoal">
                      <Link href={`/catalogue/${p.slug}`} className="hover:text-champagne-deep">
                        {p.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-charcoal-muted">Ref: {p.sku}</p>
                    <p className="mt-3 text-sm text-charcoal-muted">{p.description}</p>
                    <p className="mt-4 text-xs text-charcoal-muted">Status: {p.availabilityStatus}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </Section>
      {products.length > 0 && (
        <QuoteCta primaryHref="/request-quote?type=PACKAGING_COMPONENTS" primaryLabel="Request a Quote" />
      )}
    </>
  );
}
