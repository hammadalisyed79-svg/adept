import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { getPublishedProducts } from "@/content/catalogue";
import { getPackagingCategory, packagingCategories } from "@/content/packaging";
import { getSiteUrl } from "@/lib/company";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return packagingCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getPackagingCategory(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.metaDescription,
    alternates: { canonical: category.href },
    openGraph: {
      title: category.title,
      description: category.metaDescription,
      url: `${getSiteUrl()}${category.href}`,
    },
  };
}

export default async function PackagingCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getPackagingCategory(slug);
  if (!category) notFound();

  const products = getPublishedProducts(category.slug);

  return (
    <>
      <PageHero eyebrow="Packaging & Components" title={category.title} description={category.summary} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Range focus</h2>
            <ul className="mt-6 space-y-3">
              {category.points.map((p) => (
                <li key={p} className="flex gap-3 text-charcoal-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-champagne" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-charcoal-muted">
              Specs, MOQ, finishes, and stock status are published only after confirmation. Request a
              quotation for current commercial options.
            </p>
          </div>
          <div className="border border-charcoal/10 bg-ivory p-8">
            <h3 className="font-display text-2xl text-charcoal">Catalogue</h3>
            {products.length === 0 ? (
              <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
                No verified {category.title.toLowerCase()} items are published yet. Use the quotation
                form to brief your requirements.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/catalogue/${p.slug}`} className="text-charcoal underline-offset-2 hover:underline">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`/request-quote?type=PACKAGING_COMPONENTS`}>Request a Quote</Button>
              <Button href="/packaging" variant="secondary">
                All packaging
              </Button>
            </div>
          </div>
        </Container>
      </Section>
      <QuoteCta
        title={`Discuss ${category.title.toLowerCase()}`}
        primaryHref="/request-quote?type=PACKAGING_COMPONENTS"
        primaryLabel="Request a Packaging Quote"
      />
    </>
  );
}
