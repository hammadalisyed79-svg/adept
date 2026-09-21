import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
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
  "Fine fragrance / perfume",
  "Body mists and personal care",
  "Laundry and detergents",
  "Surface cleaners",
  "Candles and diffusers",
  "Other scent-led formats (by brief)",
];

export default function FragranceTradingPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Fragrance Trading"
        description="Sourcing and commercial supply of fine and industrial fragrance concentrates for brands, formulators, and manufacturers."
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What trading support covers"
            description="We help you move from brief to sample to supply with application-aware recommendations."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Relevant applications</h2>
            <ul className="mt-6 space-y-3">
              {applications.map((a) => (
                <li key={a} className="flex gap-3 text-charcoal-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-champagne" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-charcoal/10 bg-ivory p-8">
            <h3 className="font-display text-2xl text-charcoal">Request a fragrance sample</h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
              Share your application, dosage expectations, and direction notes. We will advise on
              next steps for sampling and commercial discussion.
            </p>
            <div className="mt-6">
              <Button href="/request-quote?type=FRAGRANCE_TRADING">
                Request a Fragrance Sample
              </Button>
            </div>
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
