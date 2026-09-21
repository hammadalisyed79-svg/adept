import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { ProcessTimeline } from "@/components/media/ProcessTimeline";
import { Container, PageHero, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How ADEPT moves from client brief to sampling, approval, production, quality check, packing, and dispatch.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How we work with business clients"
        description="A structured path designed for procurement clarity. Services are confirmed against each project brief — we only guarantee what has been agreed."
      />
      <Section>
        <Container>
          <ProcessTimeline />
          <p className="mt-12 max-w-prose text-sm text-charcoal-muted">
            Manufacturing and supply commitments begin only after written commercial agreement.
            Sampling availability, lead times, and partner-dependent steps are confirmed during
            requirement assessment.
          </p>
        </Container>
      </Section>
      <QuoteCta title="Begin with a project inquiry" />
    </>
  );
}
