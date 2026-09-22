import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { company } from "@/lib/company";
import { divisions } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "About",
  description: `About ${company.name} — fragrance concentrates, packaging, manufacturing, private label, and Technology & Growth for B2B buyers.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${company.logoPrimary}`}
        title="A B2B partner for fragrance, packaging, manufacturing, and growth systems"
        description={company.heroSupporting}
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Introduction"
            title="A complete B2B fragrance partner"
            description="We work with brand owners, formulators, and procurement teams across concentrates, packaging, manufacturing, private label, and Technology & Growth."
          />
          <div className="space-y-5 text-base leading-relaxed text-charcoal-muted">
            <p>
              {company.name} is organized around business buyers. Our positioning covers fragrance
              concentrates, perfume packaging components and accessories, private-label services,
              manufacturing solutions, and Technology & Growth — without retail perfume storefront
              positioning.
            </p>
            <p>
              We do not claim that every product is manufactured in-house. Trading, sourcing, and
              manufacturing are distinguished in commercial conversations so expectations stay accurate.
            </p>
            <p>
              We do not present unverified company history, capacity claims, certifications, or
              awards. As operational details are confirmed, they will be published through controlled
              configuration — not marketing invention.
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
        <Container>
          <SectionHeading
            eyebrow="Divisions"
            title="Five business divisions"
            description="Each division supports a distinct commercial pathway — including Technology & Growth for ERP, websites, marketing, and AI support."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex h-full flex-col border border-charcoal/10 bg-ivory p-6 transition hover:border-champagne/40"
              >
                <p className="text-xs uppercase tracking-wideish text-champagne-deep">{d.mode}</p>
                <h3 className="mt-2 font-display text-2xl text-charcoal group-hover:text-champagne-deep">
                  {d.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-muted">{d.summary}</p>
                <span className="mt-auto pt-5 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Mission</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              To provide integrated fragrance, packaging, manufacturing, and Technology & Growth
              solutions that help brands move from concept to finished product — and the systems that
              support commercial clarity.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-charcoal">Vision</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              To be a trusted B2B counterpart for fragrance brand builders — precise in process,
              restrained in claims, and reliable in follow-through across trading, sourcing,
              manufacturing, and growth systems.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Philosophy" title="Business philosophy" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Scope honesty",
                d: "Manufacturing, trading, and sourcing are labelled clearly. We do not imply in-house production for traded or sourced components.",
              },
              {
                t: "Verified catalogue only",
                d: "Packaging products appear publicly only when references, specs, and imagery are confirmed. Categories describe intended range.",
              },
              {
                t: "Evidence over ornament",
                d: "We publish only confirmed facts. Unverified metrics, stock claims, and competitor imagery stay off the site.",
              },
            ].map((item) => (
              <div key={item.t} className="border border-charcoal/10 bg-ivory p-6">
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
              Commercial engagements follow the published process: brief and selection, sampling and
              approval, production and quality, then packing and dispatch. See the Process page for
              the full eight-step path. Technology & Growth projects follow their own discovery-to-
              handover sequence on each service page.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-charcoal">Trading, sourcing, manufacturing</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              Fragrance trading and packaging components are typically commercial supply and sourcing
              relationships. Toll manufacturing and private-label projects may include blending,
              processing, filling, and packaging coordination depending on agreed scope and available
              partners.
            </p>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title={`Partner with ${company.name} on your next project`}
        description="Tell us about fragrance, packaging, manufacturing, private-label, or Technology & Growth requirements. Our team will respond with next steps."
        primaryHref="/request-quote"
        primaryLabel="Request a Quote"
        secondaryHref="/technology/request-quote"
        secondaryLabel="Technology quotation"
      />
    </>
  );
}
