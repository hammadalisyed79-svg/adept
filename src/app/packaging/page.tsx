import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { packagingCategories } from "@/content/packaging";

export const metadata: Metadata = {
  title: "Packaging & Components",
  description:
    "Perfume bottles, caps, pumps, labels, cartons, rigid boxes, accessories, and complete packaging sets for fragrance brands.",
  alternates: { canonical: "/packaging" },
};

export default function PackagingIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Packaging & Components"
        title="Perfume packaging components for ambitious brands"
        description="ADEPT sources and supplies packaging components and coordinated sets for fragrance businesses. Availability, specifications, and compatibility are confirmed project by project — we do not claim every item is manufactured in-house or held in stock."
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Categories"
            title="Intended packaging range"
            description="These categories describe the product families we support commercially. Individual catalogue items appear only when verified data is available."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {packagingCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group border border-charcoal/10 bg-white p-7 transition hover:border-champagne/50"
              >
                <h2 className="font-display text-2xl text-charcoal group-hover:text-champagne-deep">
                  {cat.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{cat.summary}</p>
                <span className="mt-5 inline-block text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                  View category →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/catalogue">Browse catalogue</Button>
            <Button href="/request-quote?type=PACKAGING_COMPONENTS" variant="secondary">
              Request packaging quotation
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl text-charcoal">Trading, sourcing, and manufacturing</h2>
          <p className="mt-4 leading-relaxed text-charcoal-muted">
            Packaging components are typically supplied through trading and sourcing relationships.
            Manufacturing and filling services are discussed under Toll Manufacturing and Private
            Label. We clearly separate what is sourced from what is manufactured so commercial
            expectations stay accurate.
          </p>
        </Container>
      </Section>

      <QuoteCta
        title="Need bottles, closures, or complete packaging sets?"
        primaryHref="/request-quote?type=PACKAGING_COMPONENTS"
        primaryLabel="Request a Packaging Quote"
      />
    </>
  );
}
