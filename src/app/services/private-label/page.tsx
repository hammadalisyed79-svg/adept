import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Private Label",
  description:
    "Private-label fragrance development from concept and sampling through manufacturing and delivery.",
  alternates: { canonical: "/services/private-label" },
};

const story = [
  { label: "Idea", mediaKey: "privateLabel" as const },
  { label: "Fragrance", mediaKey: "fragranceOils" as const },
  { label: "Bottle", mediaKey: "perfumeBottles" as const },
  { label: "Packaging", mediaKey: "completePackagingSet" as const },
  { label: "Finished Product", mediaKey: "completeBrandSolution" as const },
];

const steps = [
  { title: "Concept development", text: "Clarify product positioning, format, and commercial targets." },
  { title: "Fragrance selection", text: "Shortlist directions aligned to category and brief." },
  { title: "Sampling and evaluation", text: "Iterate samples until your team approves a direction." },
  { title: "Packaging sourcing", text: "Coordinate bottles, closures, and secondary packaging options." },
  { title: "Bottle selection", text: "Match bottle formats to fill volume, brand, and production needs." },
  { title: "Label and artwork coordination", text: "Align artwork practicalities with print and compliance needs." },
  { title: "Manufacturing", text: "Produce against approved specifications and agreed process steps." },
  { title: "Finished product delivery", text: "Dispatch finished goods per confirmed order instructions." },
];

export default function PrivateLabelPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Label"
        title="From Brief to Shelf."
        description="A structured path from fragrance concept to finished product for brands that need coordinated development and manufacturing support."
        mediaKey="privateLabel"
      />

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Transformation"
            title="Idea → Fragrance → Bottle → Packaging → Finished Product"
            description="One visual story of how ADEPT coordinates a private-label fragrance project."
          />
          <ol className="mt-12 hidden gap-3 md:grid md:grid-cols-5">
            {story.map((s, i) => (
              <li key={s.label} className="relative">
                {i < story.length - 1 && (
                  <span
                    className="absolute right-0 top-1/3 z-10 hidden translate-x-1/2 text-champagne-deep lg:block"
                    aria-hidden
                  >
                    →
                  </span>
                )}
                <MediaImage
                  mediaKey={s.mediaKey}
                  aspectClassName="aspect-square"
                  sizes="20vw"
                  hoverScale={false}
                  className="border border-charcoal/10"
                />
                <p className="mt-3 text-center text-xs font-medium uppercase tracking-wideish text-charcoal">
                  {s.label}
                </p>
              </li>
            ))}
          </ol>
          <ol className="mt-10 space-y-4 md:hidden">
            {story.map((s) => (
              <li key={s.label} className="flex items-center gap-4">
                <MediaImage
                  mediaKey={s.mediaKey}
                  aspectClassName="aspect-square w-20 shrink-0"
                  sizes="80px"
                  hoverScale={false}
                  className="w-20 border border-charcoal/10"
                />
                <p className="font-display text-lg text-charcoal">{s.label}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Project journey"
            title="From idea to deliverable product"
            description="Private-label work succeeds when creative intent and commercial constraints are documented early."
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4 border border-charcoal/10 bg-white p-6">
                <span className="font-display text-xl text-champagne-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl text-charcoal">{s.title}</h3>
                  <p className="mt-2 text-sm text-charcoal-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Start your project</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-charcoal-muted">
              Bring your concept notes, target bottle size, volume assumptions, and timeline. We will
              outline sampling, packaging, and manufacturing next steps based on confirmed scope.
            </p>
          </div>
          <div className="border border-charcoal/10 bg-ivory p-8">
            <Button href="/request-quote?type=PRIVATE_LABEL" className="w-full">
              Start Your Project
            </Button>
            <p className="mt-4 text-xs text-charcoal-muted">
              Optional fields on the quote form help capture fragrance direction, bottle size, and
              packaging needs without making them mandatory.
            </p>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Ready to build a private-label fragrance line?"
        primaryHref="/request-quote?type=PRIVATE_LABEL"
        primaryLabel="Start Your Project"
      />
    </>
  );
}
