import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { company } from "@/lib/company";
import { inquiryTypes } from "@/lib/validation/inquiry";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Submit a B2B quotation inquiry for fragrance trading, packaging components, toll manufacturing, or private label.",
  alternates: { canonical: "/request-quote" },
  robots: { index: true, follow: true },
};

type Props = { searchParams: Promise<{ type?: string }> };

function WhatHappensNextPanel() {
  return (
    <div className="border border-charcoal/10 bg-ivory p-6 md:p-7">
      <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
        Commercial inquiry
      </p>
      <h2 className="mt-3 font-display text-2xl text-charcoal">What happens next</h2>
      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-charcoal-muted">
        <li className="border-l-2 border-champagne pl-3">
          We review your brief against trading, packaging, or manufacturing scope.
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
        <Button href="/contact" variant="secondary" className="w-full">
          Contact page
        </Button>
      </div>
    </div>
  );
}

export default async function RequestQuotePage({ searchParams }: Props) {
  const params = await searchParams;
  const typeParam = params.type?.toUpperCase();
  const defaultType = inquiryTypes.includes(typeParam as (typeof inquiryTypes)[number])
    ? (typeParam as (typeof inquiryTypes)[number])
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="Quotations"
        title="Request a quote"
        description="Share the essentials. Optional fields deepen the brief without blocking submission."
      />
      <Section className="bg-white">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Form first on mobile; desktop keeps form | sidebar */}
          <div className="min-w-0 order-1">
            <InquiryForm defaultType={defaultType} sourcePage="/request-quote" />
            {/* Mobile only: panel below form */}
            <div className="mt-8 lg:hidden">
              <WhatHappensNextPanel />
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="order-2 hidden space-y-6 lg:sticky lg:top-28 lg:block">
            <MediaImage
              mediaKey="completeBrandSolution"
              hoverScale={false}
              aspectClassName="aspect-[4/3]"
              sizes="22rem"
              className="border border-charcoal/10"
            />
            <WhatHappensNextPanel />
          </aside>
        </Container>
      </Section>
    </>
  );
}
