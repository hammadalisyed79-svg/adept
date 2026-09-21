import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { inquiryTypes } from "@/lib/validation/inquiry";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Submit a B2B quotation inquiry for fragrance trading, packaging components, toll manufacturing, or private label.",
  alternates: { canonical: "/request-quote" },
  robots: { index: true, follow: true },
};

type Props = { searchParams: Promise<{ type?: string }> };

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
        description="Tell us what you need. Required fields capture the essentials; optional fields deepen the brief without blocking submission."
      />
      <Section className="bg-white">
        <Container className="mx-auto max-w-4xl">
          <InquiryForm defaultType={defaultType} sourcePage="/request-quote" />
        </Container>
      </Section>
    </>
  );
}
