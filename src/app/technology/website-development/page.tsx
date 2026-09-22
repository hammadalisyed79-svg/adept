import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { websiteFromBriefToLaunch, websiteOfferings } from "@/content/technology";

export const metadata: Metadata = {
  title: "Website Development",
  description:
    "Corporate, B2B, ecommerce, catalogue, and quotation websites — with optional ERP and website integration where supported.",
  alternates: { canonical: "/technology/website-development" },
};

export default function TechnologyWebsitePage() {
  return (
    <>
      <PageHero
        eyebrow="Website Development"
        title="Digital storefronts and commercial sites"
        description="Corporate and B2B websites, catalogues, quotation experiences, and ecommerce where the commercial model fits — with system integration when APIs allow."
        visual={
          <MediaImage
            mediaKey="technologyWebsite"
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
            title="What website projects can include"
            description="Each engagement selects the capabilities that match your audience and commercial process."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {websiteOfferings.map((o) => (
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
              eyebrow="From Brief to Launch"
              title="How a website engagement progresses"
              description="A practical sequence from requirements through design, testing, and launch support."
            />
            <ol className="mt-10 space-y-5">
              {websiteFromBriefToLaunch.map((step, i) => (
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
              mediaKey="privateLabel"
              aspectClassName="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border border-charcoal/10"
              hoverScale={false}
            />
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Discuss website development"
        description="Corporate, B2B, catalogue, quotation, or ecommerce — describe what you need and we will advise on scope."
        primaryHref="/technology/request-quote?type=website"
        primaryLabel="Discuss a Website Project"
        showEmail
      />
    </>
  );
}
