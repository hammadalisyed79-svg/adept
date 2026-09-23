import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { marketingApproach, marketingOfferings } from "@/content/technology";

export const metadata: Metadata = pageMetadata({
  title: "Digital Marketing",
  description:
    "Brand strategy, content, social, SEO, advertising, and campaign support for fragrance and related brands.",
  path: "/technology/digital-marketing",
  image: "/images/adept/technology-marketing.png",
});

export default function TechnologyDigitalMarketingPage() {
  return (
    <>
      <PageHero
        eyebrow="Digital Marketing"
        title="Practical marketing support for brand growth"
        description="Brand strategy, content, social, SEO, advertising, and campaign management — planned around your audience, channels, and budget."
        visual={
          <MediaImage
            mediaKey="technologyMarketing"
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
            title="How we support growth"
            description="Each engagement defines channels, cadence, and reporting so marketing work stays commercially useful."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {marketingOfferings.map((o) => (
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
              eyebrow="Our Approach"
              title="From assessment to reporting"
              description="A clear working model for brand, channels, creative, and measurement."
            />
            <ol className="mt-10 space-y-5">
              {marketingApproach.map((step, i) => (
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
              mediaKey="industryFineFragrance"
              aspectClassName="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border border-charcoal/10"
              hoverScale={false}
            />
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Start a marketing conversation"
        description="Share brand stage, audiences, and channels of interest. We will respond with a practical starting point."
        primaryHref="/technology/request-quote?type=marketing"
        primaryLabel="Discuss Marketing Requirements"
        showEmail
      />
    </>
  );
}
