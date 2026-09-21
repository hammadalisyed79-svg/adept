import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { packagingCategories } from "@/content/packaging";
import { industries } from "@/content/industries";
import { processSteps } from "@/content/process";
import { company, getWhatsAppUrl, isTelephonePlaceholder, isWhatsAppPlaceholder } from "@/lib/company";
import { divisions } from "@/lib/navigation";

export const metadata: Metadata = {
  title: company.heroHeadline,
  description: company.heroSupporting,
  alternates: { canonical: "/" },
};

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
        <Container className="relative grid gap-12 py-20 md:grid-cols-[1.35fr_0.9fr] md:items-end md:py-28">
          <div>
            <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
              {company.name}
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] text-charcoal md:text-6xl">
              {company.heroHeadline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-muted">
              {company.heroSupporting}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/packaging">Explore Packaging</Button>
              <Button href="/request-quote" variant="secondary">
                Request a Quote
              </Button>
            </div>
          </div>
          <aside className="border border-charcoal/10 bg-white/70 p-8 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wideish text-champagne-deep">Company</p>
            <p className="mt-4 font-display text-2xl leading-snug text-charcoal">
              {company.positioning}
            </p>
            <p className="mt-5 text-sm text-charcoal-muted">{company.tagline}</p>
            <div className="mt-8 border-t border-charcoal/10 pt-6 text-sm text-charcoal-muted">
              <p>
                Fragrance concentrates, packaging components, private-label services, and
                manufacturing solutions — for B2B buyers, not retail perfume shoppers.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Introduction"
            title="A complete B2B fragrance supply partner"
            description="ADEPT Fragrances supports brand builders across concentrates, packaging components, toll manufacturing, and private-label pathways. We distinguish trading and sourcing from manufacturing so commercial scope stays accurate."
          />
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Business divisions"
            title="Four core business divisions"
            description="Each division is equally important to how ADEPT serves fragrance brands — from raw materials and components through production and finished-product coordination."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((d, i) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex flex-col border border-charcoal/10 bg-ivory p-7 transition duration-soft hover:border-champagne/50"
              >
                <span className="text-xs tracking-wideish text-champagne-deep">0{i + 1}</span>
                <p className="mt-2 text-xs uppercase tracking-wideish text-charcoal-muted">{d.mode}</p>
                <h3 className="mt-3 font-display text-2xl text-charcoal group-hover:text-champagne-deep">
                  {d.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-muted">{d.summary}</p>
                <span className="mt-6 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                  Learn more
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Packaging & Components"
            title="Packaging & components collection"
            description="An extensible range of perfume packaging categories. Individual products appear in the catalogue only when specifications are verified — categories describe intended commercial coverage, not automatic stock."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packagingCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="border border-charcoal/10 bg-white p-5 transition hover:border-champagne/40"
              >
                <h3 className="font-display text-lg text-charcoal">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted line-clamp-3">
                  {cat.summary}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/packaging">All packaging</Button>
            <Button href="/catalogue" variant="secondary">
              B2B catalogue
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Industries we serve"
            title="Built for categories that depend on scent"
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
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Complete fragrance brand solutions"
            title="From concept to finished product"
            description="Combine fragrance selection, packaging components, and manufacturing conversations in one B2B relationship — scoped honestly to trading, sourcing, and manufacturing realities."
          />
          <ul className="space-y-4 text-sm leading-relaxed text-charcoal-muted">
            <li className="border-l-2 border-champagne pl-4">
              Fragrance concentrates for fine and industrial applications
            </li>
            <li className="border-l-2 border-champagne pl-4">
              Packaging components and coordinated packaging sets
            </li>
            <li className="border-l-2 border-champagne pl-4">
              Toll manufacturing and private-label production pathways
            </li>
            <li className="border-l-2 border-champagne pl-4">
              Quotation-led commercial process — not retail checkout
            </li>
          </ul>
        </Container>
      </Section>

      <Section className="bg-ivory-soft">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="How we work"
              title="A clear commercial process"
              description="From first inquiry to dispatch, each stage reduces ambiguity for brand and procurement teams."
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
            eyebrow="Quality and sourcing"
            title="Quality and sourcing approach"
          />
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <p className="text-base leading-relaxed text-ivory/75">
              Quality for ADEPT means aligning fragrance selection, packaging components, sampling,
              quotation, and production planning to an agreed brief. We do not publish unverified
              certifications, capacity figures, or awards.
            </p>
            <p className="text-base leading-relaxed text-ivory/75">
              Packaging and concentrates are often supplied through trading and sourcing. Manufacturing
              steps are scoped under toll manufacturing or private label. Where specialized partners
              are required, we say so — so timelines and responsibilities stay clear.
            </p>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Request a quotation"
        description="Brief fragrance, packaging, or manufacturing requirements in one inquiry. Existing fragrance and manufacturing inquiry types remain fully supported."
      />

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
            {!isTelephonePlaceholder() && (
              <p>
                <span className="text-charcoal">Telephone:</span>{" "}
                <a
                  className="underline underline-offset-2"
                  href={`tel:${company.telephone.replace(/\s/g, "")}`}
                >
                  {company.telephone}
                </a>
              </p>
            )}
            {!isWhatsAppPlaceholder() && (
              <p>
                <Button
                  href={getWhatsAppUrl(
                    "Hello ADEPT Fragrances — I would like to discuss a fragrance project.",
                  )}
                  variant="champagne"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message on WhatsApp
                </Button>
              </p>
            )}
            <p className="pt-2">
              <Link href="/contact" className="text-charcoal underline underline-offset-2">
                Open the contact page
              </Link>
              {" · "}
              <Link href="/request-quote" className="text-charcoal underline underline-offset-2">
                Request a quote
              </Link>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
