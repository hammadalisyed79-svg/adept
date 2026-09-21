import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { industries } from "@/content/industries";
import { processSteps } from "@/content/process";
import { company, getWhatsAppUrl } from "@/lib/company";
import { divisions } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Fragrance Solutions, From Concept to Creation",
  description: company.positioning,
  alternates: { canonical: "/" },
};

const reasons = [
  {
    title: "Integrated pathway",
    text: "Trading, development support, and manufacturing conversations in one coordinated B2B relationship.",
  },
  {
    title: "Application clarity",
    text: "Fine fragrance and industrial fragrance requirements are treated as distinct technical briefs.",
  },
  {
    title: "Transparent scope",
    text: "We distinguish in-house capabilities from steps that may require approved external partners.",
  },
  {
    title: "Commercial discipline",
    text: "Sampling, quotation, and production planning follow a structured process built for business buyers.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-charcoal/10">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,154,115,0.18),_transparent_55%),linear-gradient(160deg,#F4F1EB_0%,#FAF8F4_45%,#ECE7DE_100%)]"
          aria-hidden
        />
        <div
          className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-champagne/20"
          aria-hidden
        />
        <div
          className="absolute bottom-10 right-[18%] h-40 w-40 border border-charcoal/5"
          aria-hidden
        />
        <Container className="relative grid gap-12 py-20 md:grid-cols-[1.35fr_0.9fr] md:items-end md:py-28">
          <div>
            <p className="animate-fade-up text-xs font-medium uppercase tracking-wideish text-champagne-deep">
              {company.name} · {company.displayDescriptor}
            </p>
            <h1 className="animate-fade-up-delay mt-4 max-w-xl font-display text-4xl leading-[1.1] text-charcoal md:text-6xl">
              Fragrance Solutions, From Concept to Creation.
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-charcoal-muted">
              From fragrance sourcing and development support to blending, filling and
              finished-product manufacturing, we help businesses bring their fragrance concepts
              to market.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/services/fragrance-trading">Explore Our Solutions</Button>
              <Button href="/request-quote" variant="secondary">
                Request a Quote
              </Button>
            </div>
          </div>
          <aside className="border border-charcoal/10 bg-white/70 p-8 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wideish text-champagne-deep">Positioning</p>
            <p className="mt-4 font-display text-2xl leading-snug text-charcoal">
              {company.positioning}
            </p>
            <p className="mt-5 text-sm text-charcoal-muted">{company.tagline}</p>
            <div className="mt-8 border-t border-charcoal/10 pt-6 text-sm text-charcoal-muted">
              <p>Serving brand owners, formulators, and manufacturers — not retail perfume shoppers.</p>
            </div>
          </aside>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Business divisions"
            title="Three pathways for fragrance businesses"
            description="Whether you need concentrates, production support, or a private-label build, we structure the engagement around your commercial brief."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {divisions.map((d, i) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex flex-col border border-charcoal/10 bg-white p-7 transition duration-soft hover:border-champagne/50"
              >
                <span className="text-xs tracking-wideish text-champagne-deep">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-2xl text-charcoal group-hover:text-champagne-deep">
                  {d.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-muted">
                  {d.summary}
                </p>
                <span className="mt-6 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                  Learn more
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Industries served"
            title="Built for product categories that depend on scent"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="border border-charcoal/10 bg-ivory p-6 transition hover:border-champagne/40"
              >
                <h3 className="font-display text-xl text-charcoal">{ind.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted line-clamp-3">
                  {ind.summary}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/industries" variant="ghost" className="px-0">
              View all industries →
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="How we work"
              title="A clear commercial process"
              description="From first inquiry to dispatch, each stage is designed to reduce ambiguity for brand and procurement teams."
            />
            <ol className="space-y-5">
              {processSteps.slice(0, 4).map((step) => (
                <li key={step.number} className="flex gap-4 border-b border-charcoal/10 pb-5">
                  <span className="font-display text-xl text-champagne-deep">{step.number}</span>
                  <div>
                    <h3 className="font-medium text-charcoal">{step.title}</h3>
                    <p className="mt-1 text-sm text-charcoal-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-8">
            <Button href="/process" variant="secondary">
              See the full process
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-charcoal text-ivory">
        <Container>
          <SectionHeading
            eyebrow="Quality approach"
            title="Process discipline over unverifiable claims"
          />
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <p className="text-base leading-relaxed text-ivory/75">
              Quality for ADEPT means aligning fragrance selection, sampling, quotation, and
              production planning to an agreed brief. We do not publish unverified certifications,
              capacity figures, or awards. Capabilities are confirmed project by project.
            </p>
            <p className="text-base leading-relaxed text-ivory/75">
              Where manufacturing steps require specialized partners, we say so. That transparency
              helps you plan timelines, approvals, and supply responsibilities with fewer surprises.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Why ADEPT" title="Reasons to work with us" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="border-l-2 border-champagne pl-5">
                <h3 className="font-display text-xl text-charcoal">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <QuoteCta />

      <Section className="bg-white">
        <Container className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Speak with our commercial team"
              description="Email, telephone, or WhatsApp — use the channel that suits your procurement process."
            />
          </div>
          <div className="space-y-3 text-sm text-charcoal-muted">
            <p>
              <span className="text-charcoal">Email:</span>{" "}
              <a className="underline underline-offset-2" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
            <p>
              <span className="text-charcoal">Telephone:</span>{" "}
              <a className="underline underline-offset-2" href={`tel:${company.telephone.replace(/\s/g, "")}`}>
                {company.telephone}
              </a>
            </p>
            <p>
              <Button
                href={getWhatsAppUrl("Hello ADEPT — I would like to discuss a fragrance project.")}
                variant="champagne"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </Button>
            </p>
            <p className="pt-2">
              <Link href="/contact" className="text-charcoal underline underline-offset-2">
                Open the contact page
              </Link>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
