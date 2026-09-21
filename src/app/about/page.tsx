import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description: `About ${company.name} — fragrance sourcing and manufacturing solutions for businesses.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About ADEPT"
        title="A B2B partner for fragrance sourcing and manufacturing"
        description="ADEPT supports ambitious brands and manufacturers with integrated fragrance trading, development support, and production pathways — without retail perfume positioning."
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Introduction"
            title="Built for commercial fragrance decisions"
            description="We work with brand owners, formulators, and procurement teams who need clear sampling, supply, and manufacturing conversations."
          />
          <div className="space-y-5 text-base leading-relaxed text-charcoal-muted">
            <p>
              ADEPT Fragrance Industries is organized around business buyers. Our focus is helping
              companies move from fragrance concept to commercial supply or finished-product
              manufacturing with disciplined communication and transparent scope.
            </p>
            <p>
              We do not present unverified company history, capacity claims, certifications, or
              awards. As operational details are confirmed, they will be published through
              controlled configuration — not marketing invention.
            </p>
            {!company.legalNameVerified && (
              <p className="border border-champagne/30 bg-ivory px-4 py-3 text-sm text-charcoal">
                Proposed legal name ({company.legalName}) is pending verification and is not
                presented as a confirmed incorporated entity.
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Mission</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              To provide integrated fragrance sourcing and manufacturing solutions that help
              brands bring scent-led products to market with commercial clarity.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-charcoal">Vision</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              To be a trusted B2B counterpart for fragrance trading and production partnerships —
              precise in process, restrained in claims, and reliable in follow-through.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Philosophy" title="Business philosophy" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Application first",
                d: "Fine fragrance and industrial fragrance require different evaluation criteria. We brief and sample accordingly.",
              },
              {
                t: "Scope honesty",
                d: "Capabilities performed in-house are distinguished from services that may involve approved external partners.",
              },
              {
                t: "Evidence over ornament",
                d: "We publish only confirmed facts. Unverified metrics stay off the public site.",
              },
            ].map((item) => (
              <div key={item.t} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{item.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{item.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-ivory-soft">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Operational approach</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              Engagements follow a structured path: inquiry, requirement assessment, sampling where
              relevant, quotation, planning, production checks, and dispatch. Each stage is
              documented enough for procurement and brand teams to align.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-charcoal">Sourcing and manufacturing</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              Fragrance trading covers concentrate sourcing and commercial supply. Toll
              manufacturing and private-label projects may include blending, processing, filling,
              and packaging coordination depending on agreed scope and available partners.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Quality"
            title="Quality commitment"
            description="Quality means matching materials and processes to an approved brief, confirming dosages and packaging assumptions before production, and communicating constraints early."
          />
        </Container>
      </Section>

      <QuoteCta title="Partner with ADEPT on your next fragrance project" />
    </>
  );
}
