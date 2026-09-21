import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Fragrance Trading",
  description:
    "Fine and industrial fragrance concentrates, sourcing, sampling, and commercial supply for B2B buyers.",
  alternates: { canonical: "/services/fragrance-trading" },
};

const offerings = [
  {
    title: "Fine fragrance concentrates",
    text: "Options for perfume and related alcoholic fragrance concepts, selected against character and application briefs.",
  },
  {
    title: "Industrial fragrance concentrates",
    text: "Materials oriented to functional products such as detergents, cleaners, and other home or personal care formats.",
  },
  {
    title: "Fragrance sourcing",
    text: "Structured sourcing against category, dosage expectations, and commercial constraints you define.",
  },
  {
    title: "Sample evaluation",
    text: "Sample arrangements to support olfactory and in-product evaluation before commercial commitment.",
  },
  {
    title: "Commercial supply",
    text: "Supply discussions for approved materials once specifications, volumes, and terms are aligned.",
  },
  {
    title: "Application-specific selection",
    text: "Shortlisting guided by end use — fine fragrance, personal care, home care, or candles and home fragrance.",
  },
];

const applications = [
  { title: "Fine fragrance / perfume", mediaKey: "industryFineFragrance" as const },
  { title: "Body mists and personal care", mediaKey: "industryPersonalCare" as const },
  { title: "Laundry and detergents", mediaKey: "industryHomeCare" as const },
  { title: "Candles and diffusers", mediaKey: "industryCandles" as const },
];

export default function FragranceTradingPage() {
  return (
    <>
      <PageHero
        eyebrow="Fragrance Trading"
        title="Fragrance concentrates for serious brands"
        description="Sourcing and commercial supply of fine and industrial fragrance concentrates — technical, application-aware, and quotation-led."
        mediaKey="fragranceOils"
      />

      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Two tracks"
              title="Fine Fragrance · Industrial Fragrance"
              description="Separate evaluation paths for prestige scent work and functional product fragrance — both supported under trading."
            />
          </div>
          <MediaImage
            mediaKey="fragranceTrading"
            hoverScale={false}
            aspectClassName="aspect-[4/3]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-charcoal/10"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What trading support covers"
            description="From brief to sample to supply with application-aware recommendations."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <div key={o.title} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Applications" title="Where concentrates are applied" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {applications.map((a) => (
              <div
                key={a.title}
                className="group border border-charcoal/10 bg-ivory overflow-hidden"
              >
                <MediaImage
                  mediaKey={a.mediaKey}
                  aspectClassName="aspect-[4/3]"
                  sizes="25vw"
                  hoverScale={false}
                />
                <p className="p-4 text-sm font-medium text-charcoal">{a.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border border-charcoal/10 bg-ivory p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h3 className="font-display text-2xl text-charcoal">Request a fragrance sample</h3>
              <p className="mt-2 max-w-prose text-sm text-charcoal-muted">
                Share application, dosage expectations, and direction notes.
              </p>
            </div>
            <Button href="/request-quote?type=FRAGRANCE_TRADING" className="mt-6 md:mt-0 shrink-0">
              Request a Fragrance Sample
            </Button>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Need fragrance concentrates for your line?"
        primaryHref="/request-quote?type=FRAGRANCE_TRADING"
        primaryLabel="Request a Fragrance Sample"
      />
    </>
  );
}
