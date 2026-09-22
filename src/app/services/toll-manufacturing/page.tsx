import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Toll Manufacturing",
  description:
    "Fragrance blending, processing, filling and packaging support for brand manufacturing requirements.",
  alternates: { canonical: "/services/toll-manufacturing" },
};

const core = [
  {
    title: "Blending",
    text: "Batch blending according to agreed formulas and process instructions.",
    mediaKey: "manufacturingMixing" as const,
  },
  {
    title: "Maceration",
    text: "Controlled resting stages where the product brief requires them.",
    mediaKey: "fragranceOils" as const,
  },
  {
    title: "Chilling & filtration",
    text: "Clarity-oriented process steps when specified for the product type.",
    mediaKey: "qualityControl" as const,
  },
  {
    title: "Filling",
    text: "Filling into approved bottles or containers per agreed fill volumes.",
    mediaKey: "manufacturingFilling" as const,
  },
  {
    title: "Packaging",
    text: "Primary and secondary packaging coordination within the confirmed scope.",
    mediaKey: "completePackagingSet" as const,
  },
  {
    title: "Batch production",
    text: "Scheduled production against approved specifications and order quantities.",
    mediaKey: "tollManufacturing" as const,
  },
];

export default function TollManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Toll Manufacturing"
        title="From Compound to Finished Product."
        description="Production support for brands that need blending, processing, filling, and packaging executed against an agreed manufacturing brief."
        mediaKey="tollManufacturing"
      />

      <Section className="bg-charcoal text-ivory">
        <Container>
          <p className="max-w-prose text-sm text-ivory/60">
            Process imagery is illustrative. Photographs do not depict verified ADEPT facilities
            unless separately confirmed.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MediaImage
              mediaKey="manufacturingMixing"
              hoverScale={false}
              aspectClassName="aspect-[4/3]"
              sizes="33vw"
              className="border border-ivory/10"
            />
            <MediaImage
              mediaKey="manufacturingFilling"
              hoverScale={false}
              aspectClassName="aspect-[4/3]"
              sizes="33vw"
              className="border border-ivory/10"
            />
            <MediaImage
              mediaKey="qualityControl"
              hoverScale={false}
              aspectClassName="aspect-[4/3]"
              sizes="33vw"
              className="border border-ivory/10"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Manufacturing scope"
            title="Capabilities discussed project by project"
            description="Typical toll-manufacturing conversations. Final availability depends on product type, materials, and confirmed production arrangements."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {core.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden border border-charcoal/10 bg-white"
              >
                <MediaImage
                  mediaKey={item.mediaKey}
                  aspectClassName="aspect-[16/10]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  hoverScale={false}
                />
                <div className="p-6">
                  <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="border border-champagne/40 bg-ivory p-8">
            <h2 className="font-display text-2xl text-charcoal">Client-supplied materials</h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-charcoal-muted">
              Where approved, manufacturing can proceed with client-supplied fragrance compounds,
              packaging components, or both. Material specifications and responsibilities are
              documented before production planning.
            </p>
          </div>
          <div className="border border-charcoal/10 p-8">
            <h2 className="font-display text-2xl text-charcoal">Partner-dependent steps</h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-charcoal-muted">
              Certain specialized processes may require approved external partners. We distinguish
              these clearly during requirement assessment so timelines stay accurate.
            </p>
          </div>
        </Container>
      </Section>

      <QuoteCta
        primaryHref="/request-quote?type=TOLL_MANUFACTURING"
        primaryLabel="Discuss Manufacturing Requirements"
      />
    </>
  );
}
