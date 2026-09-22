import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { ProcessTimeline } from "@/components/media/ProcessTimeline";
import { Container, PageHero, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "The ADEPT Fragrances commercial pathway — from brief and selection through sampling, production, quality, packing, and dispatch.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From brief to dispatch"
        description="An eight-step commercial pathway — composed for clarity, paced for confidence, and confirmed in writing before production begins."
      />
      <Section>
        <Container>
          <ProcessTimeline />
          <div className="mt-14 max-w-2xl space-y-4 border-t border-charcoal/10 pt-10">
            <p className="text-sm leading-relaxed text-charcoal-muted">
              Manufacturing and supply proceed only after written commercial agreement. Sampling,
              lead times, and any partner-dependent stages are confirmed during requirement
              assessment.
            </p>
            <p className="text-sm leading-relaxed text-charcoal-muted">
              Fragrance trading, packaging, manufacturing, and private label follow this pathway.
              Technology & Growth engagements follow a discovery-to-delivery sequence on each{" "}
              <Link
                href="/technology"
                className="font-medium text-charcoal underline-offset-2 hover:underline"
              >
                Technology & Growth
              </Link>{" "}
              service page.
            </p>
          </div>
        </Container>
      </Section>
      <QuoteCta
        title="Begin a commercial conversation"
        description="Share your brief for fragrance, packaging, manufacturing, or private label. Technology & Growth consultations are welcome through a dedicated quotation form."
        primaryHref="/request-quote"
        primaryLabel="Request a Quote"
        secondaryHref="/technology/request-quote"
        secondaryLabel="Technology quotation"
      />
    </>
  );
}
