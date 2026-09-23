import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { company } from "@/lib/company";
import { divisions } from "@/lib/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About ADEPT Fragrances",
  description:
    "Discover how ADEPT Fragrances partners with brand owners on fragrance concentrates, packaging, manufacturing, private label, and Technology & Growth.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${company.logoPrimary}`}
        title="Crafted for brands that build with fragrance"
        description="ADEPT Fragrances brings concentrates, packaging, manufacturing, private label, and Technology & Growth together for business buyers who value clarity and composure."
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Introduction"
            title="A considered B2B partner"
            description="We work with brand owners, formulators, and procurement teams — from first brief through commercial supply and the systems that support growth."
          />
          <div className="space-y-5 text-base leading-relaxed text-charcoal-muted">
            <p>
              {company.name} is organised for business buyers. We offer fragrance concentrates,
              perfume packaging and accessories, private-label pathways, manufacturing support, and
              Technology & Growth — presented as commercial services, not a retail perfume
              storefront.
            </p>
            <p>
              Trading, sourcing, and manufacturing are distinguished with care, so each engagement
              begins with a clear understanding of scope. What is confirmed in conversation and
              contract is what we undertake to deliver.
            </p>
            <p>
              Our five divisions work as a coordinated pathway: concentrates and components for the
              brand, manufacturing and private label for finished goods, and Technology & Growth for
              the systems and channels that help commercial teams scale.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Divisions"
            title="Five business divisions"
            description="Each division offers a distinct commercial pathway — with Technology & Growth providing ERP, websites, marketing, and AI support."
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
              To help fragrance brands move from concept to finished product — and to equip them
              with the operational and digital capabilities that sustain commercial growth.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-charcoal">Vision</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              To be a trusted counterpart for fragrance brand builders: composed in presentation,
              precise in process, and reliable from first inquiry through long-term supply.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Principles" title="How we work with clients" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Clarity of scope",
                d: "Trading, sourcing, and manufacturing are described plainly, so every engagement begins with shared expectations.",
              },
              {
                t: "Catalogue with care",
                d: "Packaging references appear when specifications and imagery are ready for commercial discussion — quality over haste.",
              },
              {
                t: "Substance first",
                d: "We favour measured claims and confirmed detail. Commercial terms are always set in writing.",
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
              Fragrance, packaging, manufacturing, and private-label work follow our published
              process — from brief and sampling through production, quality, packing, and dispatch.
              Technology & Growth projects follow a discovery-to-delivery path on each service page.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-charcoal">Trading, sourcing, manufacturing</h2>
            <p className="mt-4 leading-relaxed text-charcoal-muted">
              Fragrance trading and packaging components are typically commercial supply
              relationships. Toll manufacturing and private-label programmes may include blending,
              processing, filling, and packaging coordination according to the agreed brief and
              available partners.
            </p>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title={`Partner with ${company.name}`}
        description="Share a fragrance, packaging, manufacturing, private-label, or Technology & Growth brief. Our team will respond with considered next steps."
        primaryHref="/request-quote"
        primaryLabel="Request a Quote"
        secondaryHref="/technology/request-quote"
        secondaryLabel="Technology quotation"
      />
    </>
  );
}
