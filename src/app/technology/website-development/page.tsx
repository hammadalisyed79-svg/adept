import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { techMailto, websiteOfferings } from "@/content/technology";
import { company } from "@/lib/company";

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
        description="Corporate and B2B websites, catalogues, quotation experiences, and ecommerce where the commercial model fits — with integration to operational systems when APIs allow."
        mediaKey="technologyWebsite"
      />

      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Delivery"
              title="Built for fragrance and industrial brands"
              description="Sites are scoped to your audience and inquiry process. This page does not list fictional case studies or client testimonials."
            />
          </div>
          <MediaImage
            mediaKey="technologyWebsite"
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
            title="What website projects can include"
            description="Offerings are capabilities — not a claim that every project includes every item."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {websiteOfferings.map((o) => (
              <div key={o.title} className="border border-charcoal/10 bg-white p-6">
                <h3 className="font-display text-xl text-charcoal">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{o.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border border-charcoal/10 bg-ivory p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h3 className="font-display text-2xl text-charcoal">Plan a website project</h3>
              <p className="mt-2 max-w-prose text-sm text-charcoal-muted">
                Email {company.email} with goals, content readiness, and any systems to connect.
              </p>
            </div>
            <Button
              href={techMailto("Website Development inquiry")}
              className="mt-6 shrink-0 md:mt-0"
            >
              Email {company.email}
            </Button>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Discuss website development"
        description="Corporate, B2B, catalogue, quotation, or ecommerce — describe what you need. We reply by email."
        primaryHref={techMailto("Website Development inquiry")}
        primaryLabel={`Email ${company.email}`}
        showEmail
      />
    </>
  );
}
