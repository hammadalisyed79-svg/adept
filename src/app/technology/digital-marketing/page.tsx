import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { marketingOfferings, techMailto } from "@/content/technology";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Digital Marketing",
  description:
    "Brand strategy, social media, creative content, SEO, digital advertising, and campaign management — without guaranteed rankings or ROI.",
  alternates: { canonical: "/technology/digital-marketing" },
};

export default function TechnologyDigitalMarketingPage() {
  return (
    <>
      <PageHero
        eyebrow="Digital Marketing"
        title="Practical marketing support for brand growth"
        description="Brand strategy, content, social, SEO, advertising, and campaign management — framed as services, not promised sales or ranking outcomes."
        mediaKey="technologyMarketing"
      />

      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Approach"
              title="Channels with clear expectations"
              description="We do not display fictional campaign results. Performance depends on market, budget, creative, and competitive conditions."
            />
          </div>
          <MediaImage
            mediaKey="technologyMarketing"
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
            title="Verified offering areas"
            description="Each engagement defines channels, cadence, and reporting — without guaranteed ROI."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {marketingOfferings.map((o) => (
              <div key={o.title} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{o.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border border-charcoal/10 bg-ivory p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h3 className="font-display text-2xl text-charcoal">Discuss marketing support</h3>
              <p className="mt-2 max-w-prose text-sm text-charcoal-muted">
                Email {company.email} with priority channels and business goals. No ranking or sales
                guarantees are offered on this page.
              </p>
            </div>
            <Button
              href={techMailto("Digital Marketing inquiry")}
              className="mt-6 shrink-0 md:mt-0"
            >
              Email {company.email}
            </Button>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Start a marketing conversation"
        description="Share brand stage, audiences, and channels of interest. We respond by email at info@adeptfragrances.com."
        primaryHref={techMailto("Digital Marketing inquiry")}
        primaryLabel={`Email ${company.email}`}
        showEmail
      />
    </>
  );
}
