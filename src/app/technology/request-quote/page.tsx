import type { Metadata } from "next";
import { TechnologyInquiryForm } from "@/components/forms/TechnologyInquiryForm";
import { TechnologyVisual } from "@/components/media/TechnologyVisual";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";
import { resolveTechnologyTypeParam } from "@/lib/validation/technology-inquiry";

export const metadata: Metadata = {
  title: "Discuss Your Technology Project",
  description:
    "Request a consultation for ERP solutions, website development, digital marketing, or AI support from ADEPT Fragrances Technology & Growth.",
  alternates: { canonical: "/technology/request-quote" },
  robots: { index: true, follow: true },
};

type Props = { searchParams: Promise<{ type?: string }> };

function WhatHappensNextPanel() {
  return (
    <div className="border border-charcoal/10 bg-ivory p-6 md:p-7">
      <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
        Technology inquiry
      </p>
      <h2 className="mt-3 font-display text-2xl text-charcoal">What happens next</h2>
      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-charcoal-muted">
        <li className="border-l-2 border-champagne pl-3">
          We review your brief against ERP, website, marketing, or AI chatbot scope.
        </li>
        <li className="border-l-2 border-champagne pl-3">
          Clarifying questions are sent by email when needed.
        </li>
        <li className="border-l-2 border-champagne pl-3">
          Commercial next steps follow once requirements are clear.
        </li>
      </ul>
      <p className="mt-6 text-sm text-charcoal">
        <span className="text-charcoal-muted">Email: </span>
        <a
          href={`mailto:${company.email}`}
          className="underline underline-offset-2 hover:text-champagne-deep"
        >
          {company.email}
        </a>
      </p>
      <div className="mt-6">
        <Button href="/technology" variant="secondary" className="w-full">
          Back to Technology & Growth
        </Button>
      </div>
    </div>
  );
}

export default async function TechnologyRequestQuotePage({ searchParams }: Props) {
  const params = await searchParams;
  const defaultType = resolveTechnologyTypeParam(params.type);

  return (
    <>
      <PageHero
        eyebrow="Technology & Growth"
        title="Discuss Your Technology Project"
        description="Select ERP, website development, or digital marketing. Optional service details appear after you choose a service."
      />
      <Section className="bg-white">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="order-1 min-w-0">
            <TechnologyInquiryForm
              defaultType={defaultType}
              sourcePage="/technology/request-quote"
            />
          </div>

          <aside className="order-2 space-y-6 lg:sticky lg:top-28">
            <TechnologyVisual
              variant="growth"
              aspectClassName="aspect-[4/3]"
              className="hidden border border-charcoal/10 lg:block"
            />
            <WhatHappensNextPanel />
          </aside>
        </Container>
      </Section>
    </>
  );
}
