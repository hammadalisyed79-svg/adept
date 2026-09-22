import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { erpClarifications, erpOfferings, techMailto } from "@/content/technology";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "ERP Solutions",
  description:
    "Custom ERP development and third-party ERP implementation for inventory, sales, purchasing, production, finance reporting, and integrations.",
  alternates: { canonical: "/technology/erp" },
};

export default function TechnologyErpPage() {
  return (
    <>
      <PageHero
        eyebrow="ERP Solutions"
        title="Operational software scoped to how you work"
        description="ADEPT supports custom ERP development and implementation of third-party platforms — inventory, sales, purchasing, production, reporting, and integrations where agreed."
        mediaKey="technologyErp"
      />

      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How we engage"
              title="Custom development · Third-party implementation"
              description="We distinguish building software to your requirements from implementing an existing vendor system. The approach is chosen with you — not presented as a single proprietary ADEPT ERP product."
            />
          </div>
          <MediaImage
            mediaKey="technologyErp"
            hoverScale={false}
            aspectClassName="aspect-[4/3]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-charcoal/10"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Services we offer"
            description="Described as service capabilities. Modules are delivered only when included in a signed project scope."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {erpOfferings.map((o) => (
              <div key={o.title} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Clarity"
            title="What this page does not claim"
            description="Internal website ERP adapter status is separate from services offered to customers."
          />
          <ul className="mt-8 space-y-3">
            {erpClarifications.map((line) => (
              <li
                key={line}
                className="border-l-2 border-champagne bg-ivory px-5 py-3 text-sm leading-relaxed text-charcoal-muted"
              >
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-10 border border-charcoal/10 bg-ivory p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h3 className="font-display text-2xl text-charcoal">Discuss an ERP project</h3>
              <p className="mt-2 max-w-prose text-sm text-charcoal-muted">
                Email {company.email} with your current systems, processes, and goals. Dedicated
                digital inquiry types on the quotation form require separate schema authorization.
              </p>
            </div>
            <Button href={techMailto("ERP Solutions inquiry")} className="mt-6 shrink-0 md:mt-0">
              Email {company.email}
            </Button>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Start an ERP conversation"
        description="Share operational priorities — inventory, production, sales, or integrations. We respond by email."
        primaryHref={techMailto("ERP Solutions inquiry")}
        primaryLabel={`Email ${company.email}`}
        showEmail
      />
    </>
  );
}
