import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { getPublishedProducts } from "@/content/catalogue";
import { getMedia, packagingMediaBySlug, type MediaKey } from "@/content/media";
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
  const mediaKey = (packagingMediaBySlug[category.slug] ?? "packagingComponents") as MediaKey;
  const interimNote = getMedia(mediaKey).placeholderNote;

  return (
    <>
      <PageHero
        eyebrow="Packaging & Components"
        title={category.title}
        description={
          interimNote
            ? `${category.summary} Imagery is interim until approved ADEPT product photography is available.`
            : category.summary
        }
        mediaKey={mediaKey}
      />

      <Section className="bg-white">
        <Container>
          <h2 className="font-display text-3xl text-charcoal">Capabilities & options</h2>
          <p className="mt-3 max-w-prose text-sm text-charcoal-muted">
            Discussion areas for this category. Exact availability is confirmed during commercial
            review — we do not invent stock lists.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.points.map((p) => (
              <li
                key={p}
                className="border border-charcoal/10 bg-ivory px-5 py-4 text-sm text-charcoal"
              >
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="border border-charcoal/10 bg-white p-8">
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
                    <Link
                      href={`/catalogue/${p.slug}`}
                      className="text-charcoal underline-offset-2 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/packaging" variant="secondary">
                All packaging
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center border border-charcoal/10 bg-ivory p-8 md:p-10">
            <h3 className="font-display text-3xl text-charcoal">
              Tell Us What You&apos;re Looking For
            </h3>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-charcoal-muted">
              Share sizes, finishes, volumes and matching notes. We will confirm commercial options
              against your brief.
            </p>
            <div className="mt-8">
              <Button href="/request-quote?type=PACKAGING_COMPONENTS">Request a Quote</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
