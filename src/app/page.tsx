import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { EditorialImageCard } from "@/components/media/EditorialImageCard";
import { MediaImage } from "@/components/media/MediaImage";
import { PackagingVisualGrid } from "@/components/media/PackagingVisualGrid";
import { ProcessTimeline } from "@/components/media/ProcessTimeline";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { industries } from "@/content/industries";
import { divisionMediaByHref, industryMediaBySlug } from "@/content/media";
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
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-charcoal/10 bg-ivory">
        <Container className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-14">
          <div className="order-1">
            <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
              {company.name}
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] text-charcoal md:text-5xl lg:text-6xl">
              {company.heroHeadline}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal-muted">
              {company.heroSupporting}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/packaging">Explore Our Solutions</Button>
              <Button href="/request-quote" variant="secondary">
                Request a Quote
              </Button>
            </div>
          </div>
          <div className="order-2">
            <MediaImage
              mediaKey="heroFragranceSolutions"
              priority
              hoverScale={false}
              aspectClassName="aspect-[4/3] md:aspect-[5/4]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border border-charcoal/10"
              imgClassName="object-cover object-center"
            />
          </div>
        </Container>
      </section>

      {/* Four divisions */}
      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Business divisions"
            title="Four core business divisions"
            description="Fragrance concentrates, packaging, manufacturing and private label — coordinated for B2B brand builders."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {divisions.map((d, i) => (
              <EditorialImageCard
                key={d.href}
                href={d.href}
                mediaKey={divisionMediaByHref[d.href] ?? "packagingComponents"}
                index={`0${i + 1}`}
                label={d.mode}
                title={d.title}
                description={d.summary}
                aspectClassName="aspect-[16/10]"
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Packaging visual grid */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Packaging & Components"
            title="Build Every Detail of the Pack."
            description="Source individual components or coordinate a complete packaging system through ADEPT."
          />
          <PackagingVisualGrid className="mt-12" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/request-quote?type=PACKAGING_COMPONENTS">Request a Quote</Button>
            <Button href="/packaging" variant="secondary">
              All packaging
            </Button>
          </div>
        </Container>
      </Section>

      {/* Complete solution */}
      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MediaImage
            mediaKey="completeBrandSolution"
            hoverScale={false}
            aspectClassName="aspect-[4/3]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-charcoal/10"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
              Complete solutions
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
              One Project. Every Component.
            </h2>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-charcoal-muted md:text-lg">
              Source individual components or coordinate fragrance, packaging and production as
              one project.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-charcoal-muted">
              {[
                "Fragrance concentrate",
                "Bottle · Pump · Collar · Cap",
                "Label · Rigid / folding box",
              ].map((item) => (
                <li key={item} className="flex gap-3 border-l-2 border-champagne pl-4">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Button href="/request-quote">Discuss Your Project</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Manufacturing feature */}
      <Section className="bg-charcoal text-ivory">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-medium uppercase tracking-wideish text-champagne-soft">
              Toll manufacturing
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ivory md:text-4xl">
              From Compound to Finished Product.
            </h2>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-ivory/75">
              Blending, processing, filling and packaging support — scoped project by project.
              Imagery is illustrative and does not depict verified ADEPT facilities.
            </p>
            <div className="mt-9">
              <Button
                href="/services/toll-manufacturing"
                variant="champagne"
                className="border-0"
              >
                Explore Toll Manufacturing
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MediaImage
              mediaKey="manufacturingMixing"
              hoverScale={false}
              aspectClassName="aspect-square"
              sizes="25vw"
              className="border border-ivory/10"
            />
            <MediaImage
              mediaKey="manufacturingFilling"
              hoverScale={false}
              aspectClassName="aspect-square"
              sizes="25vw"
              className="border border-ivory/10"
            />
            <MediaImage
              mediaKey="qualityControl"
              hoverScale={false}
              aspectClassName="aspect-[2/1] col-span-2"
              sizes="50vw"
              className="border border-ivory/10"
            />
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="bg-ivory-soft">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="A clear commercial process"
            description="From first inquiry to dispatch — each stage reduces ambiguity for brand and procurement teams."
          />
          <ProcessTimeline compact className="mt-12" />
          <div className="mt-10">
            <Button href="/process" variant="secondary">
              See the full process
            </Button>
          </div>
        </Container>
      </Section>

      {/* Industries */}
      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Industries we serve"
            title="Built for categories that depend on scent"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex flex-col border border-charcoal/10 bg-ivory transition duration-soft hover:border-champagne/50"
              >
                <MediaImage
                  mediaKey={industryMediaBySlug[ind.slug] ?? "fragranceOils"}
                  aspectClassName="aspect-[4/3]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-charcoal group-hover:text-champagne-deep">
                    {ind.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal-muted">
                    {ind.summary}
                  </p>
                </div>
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

      <QuoteCta
        title="Request a quotation"
        description="Brief fragrance, packaging, or manufacturing requirements in one inquiry."
      />

      <Section>
        <Container className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Speak with our commercial team"
              description="Email is the primary channel for commercial inquiries."
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
