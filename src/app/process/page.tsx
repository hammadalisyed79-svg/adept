import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { ProcessTimeline } from "@/components/media/ProcessTimeline";
import { Container, PageHero, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How ADEPT Fragrances moves from client brief to sampling, approval, production, quality, packing, and dispatch.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How we work with business clients"
        description="A composed pathway from brief to dispatch — designed for procurement clarity and commercial confidence."
      />
      <Section>
        <Container>
          <ProcessTimeline />
          <p className="mt-12 max-w-prose text-sm text-charcoal-muted">
            Manufacturing and supply commitments begin only after written commercial agreement.
            Sampling availability, lead times, and partner-dependent steps are confirmed during
            requirement assessment.
          </p>
          <p className="mt-4 max-w-prose text-sm text-charcoal-muted">
            Fragrance, packaging, manufacturing, and private-label work follow this eight-step path.
            Technology & Growth engagements use a discovery-to-delivery sequence described on each{" "}
            <Link href="/technology" className="font-medium text-charcoal underline-offset-2 hover:underline">
              Technology & Growth
            </Link>{" "}
            service page.
          </p>
        </Container>
      </Section>
      <QuoteCta title="Begin with a project inquiry" />
    </>
  );
}
