import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { PackagingVisualGrid } from "@/components/media/PackagingVisualGrid";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";

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
        title="Build Every Detail of the Pack."
        description="Source individual components or coordinate a complete packaging system. Availability and compatibility are confirmed project by project."
        mediaKey="packagingComponents"
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Categories"
            title="Component families"
            description="Explore each category to understand the range. Specifications and availability are confirmed during quotation."
          />
          <PackagingVisualGrid className="mt-12" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/request-quote?type=PACKAGING_COMPONENTS">
              Request packaging quotation
            </Button>
            <Button href="/catalogue" variant="secondary">
              Catalogue
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl text-charcoal">Trading, sourcing, and manufacturing</h2>
          <p className="mt-4 max-w-prose leading-relaxed text-charcoal-muted">
            Packaging components are typically supplied through trading and sourcing relationships.
            Manufacturing and filling services are discussed under Toll Manufacturing and Private
            Label.
          </p>
          <p className="mt-6">
            <Link href="/services/toll-manufacturing" className="text-charcoal underline underline-offset-2">
              Explore toll manufacturing
            </Link>
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
