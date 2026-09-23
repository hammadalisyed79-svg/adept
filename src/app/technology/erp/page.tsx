import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { erpHowWeWork, erpOfferings } from "@/content/technology";

export const metadata: Metadata = pageMetadata({
  title: "ERP Solutions",
  description:
    "Custom ERP development and third-party implementation for inventory, sales, purchasing, production, and reporting.",
  path: "/technology/erp",
  image: "/images/adept/technology-erp.png",
});

export default function TechnologyErpPage() {
  return (
    <>
      <PageHero
        eyebrow="ERP Solutions"
        title="Operational software scoped to how you work"
        description="Custom ERP development and third-party platform implementation — inventory, sales, purchasing, production, reporting, and integrations within an agreed scope."
        visual={
          <MediaImage
            mediaKey="technologyErp"
            aspectClassName="aspect-[4/3] lg:aspect-[5/4]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-charcoal/10"
            hoverScale={false}
            priority
          />
        }
      />

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What we can deliver"
            description="Modules are included only when they form part of your signed project scope."
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

      <Section>
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How We Work"
              title="A clear path from brief to handover"
              description="Every engagement starts with your workflows — then moves through design, build or implementation, and structured handover."
            />
            <ol className="mt-10 space-y-5">
              {erpHowWeWork.map((step, i) => (
                <li key={step.title} className="border-l-2 border-champagne pl-5">
                  <p className="text-xs uppercase tracking-wideish text-champagne-deep">
                    Step 0{i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <MediaImage
              mediaKey="qualityControl"
              aspectClassName="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border border-charcoal/10"
              hoverScale={false}
            />
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Start an ERP conversation"
        description="Share operational priorities — inventory, production, sales, or integrations. We will respond with a clear next step."
        primaryHref="/technology/request-quote?type=erp"
        primaryLabel="Request an ERP Consultation"
        showEmail
      />
    </>
  );
}
