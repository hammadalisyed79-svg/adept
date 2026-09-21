import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Toll Manufacturing",
  description:
    "Fragrance blending, processing, filling and packaging support for brand manufacturing requirements.",
  alternates: { canonical: "/services/toll-manufacturing" },
};

const core = [
  { title: "Fragrance blending", text: "Batch blending according to agreed formulas and process instructions." },
  { title: "Maceration", text: "Controlled resting stages where the product brief requires them." },
  { title: "Chilling and filtration", text: "Clarity-oriented process steps when specified for the product type." },
  { title: "Filling", text: "Filling into approved bottles or containers per agreed fill volumes." },
  { title: "Packaging", text: "Primary and secondary packaging coordination within the confirmed scope." },
  { title: "Batch production", text: "Scheduled production against approved specifications and order quantities." },
];

export default function TollManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Toll Manufacturing"
        description="Production support for brands that need blending, processing, filling, and packaging executed against an agreed manufacturing brief."
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Manufacturing scope"
            title="Capabilities discussed project by project"
            description="The following areas describe typical toll-manufacturing conversations. Final availability depends on product type, materials, and confirmed production arrangements."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {core.map((item) => (
              <div key={item.title} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="border border-champagne/40 bg-ivory p-8">
            <h2 className="font-display text-2xl text-charcoal">Client-supplied materials</h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
              Where approved, manufacturing can proceed with client-supplied fragrance compounds,
              packaging components, or both. Material specifications, incoming checks, and
              responsibilities are documented before production planning.
            </p>
          </div>
          <div className="border border-charcoal/10 p-8">
            <h2 className="font-display text-2xl text-charcoal">Partner-dependent steps</h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
              Certain specialized processes or packaging formats may require approved external
              partners. We distinguish these clearly during requirement assessment so timelines and
              commercial scope remain accurate. We do not present partner capabilities as exclusive
              in-house credentials.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Discuss manufacturing requirements</h2>
            <p className="mt-2 max-w-xl text-charcoal-muted">
              Share formula status, volumes, packaging readiness, and which materials you will supply.
            </p>
          </div>
          <Button href="/request-quote?type=TOLL_MANUFACTURING">
            Discuss Manufacturing Requirements
          </Button>
        </Container>
      </Section>

      <QuoteCta
        primaryHref="/request-quote?type=TOLL_MANUFACTURING"
        primaryLabel="Discuss Manufacturing Requirements"
      />
    </>
  );
}
