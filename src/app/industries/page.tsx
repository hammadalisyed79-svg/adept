import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Fragrance solutions for fine fragrance, personal care, home care and detergents, and candles and home fragrance.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Categories we support"
        description="Each industry has different evaluation criteria, dosage realities, and packaging constraints. Explore the category that matches your product."
      />
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group border border-charcoal/10 bg-white p-8 transition hover:border-champagne/50"
              >
                <h2 className="font-display text-3xl text-charcoal group-hover:text-champagne-deep">
                  {ind.title}
                </h2>
                <p className="mt-4 text-charcoal-muted leading-relaxed">{ind.summary}</p>
                <span className="mt-6 inline-block text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                  View industry →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <QuoteCta />
    </>
  );
}
