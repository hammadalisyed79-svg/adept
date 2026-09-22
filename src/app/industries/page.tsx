import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { industries } from "@/content/industries";
import { industryMediaBySlug } from "@/content/media";

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
          <div className="grid gap-5 md:grid-cols-2">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex h-full flex-col overflow-hidden border border-charcoal/10 bg-white transition duration-soft hover:border-champagne/50"
              >
                <MediaImage
                  mediaKey={industryMediaBySlug[ind.slug] ?? "fragranceOils"}
                  decorative
                  aspectClassName="aspect-[16/9]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="font-display text-2xl text-charcoal group-hover:text-champagne-deep md:text-3xl">
                    {ind.title}
                  </h2>
                  <p className="mt-3 max-w-prose flex-1 text-sm leading-relaxed text-charcoal-muted md:text-base">
                    {ind.summary}
                  </p>
                  <span className="mt-auto pt-5 inline-block text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                    View industry →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <QuoteCta />
    </>
  );
}
