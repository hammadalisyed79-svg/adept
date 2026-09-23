import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { ProcessTimeline } from "@/components/media/ProcessTimeline";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Process",
  description:
    "The ADEPT Fragrances commercial pathway: brief, selection, sampling, approval, production, quality, packing, and dispatch — confirmed in writing.",
  path: "/process",
});

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
          <h2 className="font-display text-2xl text-charcoal md:text-3xl">
            Commercial pathway
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-muted md:text-base">
            Eight measured stages from first brief through dispatch for fragrance, packaging,
            manufacturing, and private-label engagements.
          </p>
          <div className="mt-10 md:mt-12">
            <ProcessTimeline />
          </div>
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
