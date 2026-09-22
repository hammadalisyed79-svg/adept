import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { TechnologyVisual } from "@/components/media/TechnologyVisual";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { technologyServices } from "@/content/technology";

export const metadata: Metadata = {
  title: "Technology & Growth Solutions",
  description:
    "ERP, website development, digital marketing, and AI chatbots for fragrance and related businesses — from ADEPT Fragrances.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyOverviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology & Growth Solutions"
        title="Systems and channels that support commercial growth"
        description="One of five ADEPT business divisions — ERP, websites, digital marketing, and AI chatbots that help fragrance and related businesses connect products with systems and channels."
        visual={
          <TechnologyVisual
            variant="growth"
            aspectClassName="aspect-[4/3] lg:aspect-[5/4]"
          />
        }
      />

      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="A complete commercial partner"
              title="Build capability around the brand"
              description="Technology & Growth sits alongside fragrance trading, packaging, manufacturing, and private label. This division focuses on software, web, marketing, and AI chatbot services for teams that need digital and operational support."
            />
            <p className="mt-5 text-xs leading-relaxed text-charcoal-muted">
              Interface previews on this site stand in until approved ADEPT technology photography
              is available.
            </p>
          </div>
          <MediaImage
            mediaKey="completeBrandSolution"
            aspectClassName="aspect-[4/3]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-charcoal/10"
            hoverScale={false}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Four practical offerings"
            description="Scoped project by project — so software, websites, marketing, and AI support match how your business actually works."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {technologyServices.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex h-full flex-col border border-charcoal/10 bg-white transition duration-soft hover:border-champagne/50"
              >
                <TechnologyVisual
                  variant={s.variant}
                  decorative
                  aspectClassName="aspect-[16/10]"
                  className="border-0 border-b border-charcoal/10"
                />
                <div className="flex flex-1 flex-col p-5 md:p-7">
                  <div className="mb-2 flex items-center gap-3 text-xs uppercase tracking-wideish md:mb-3">
                    <span className="text-champagne-deep">0{i + 1}</span>
                    <span className="text-charcoal-muted">{s.label}</span>
                  </div>
                  <h3 className="font-display text-xl text-charcoal group-hover:text-champagne-deep md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted md:mt-3">
                    {s.summary}
                  </p>
                  <span className="mt-auto pt-5 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline md:pt-6">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Discuss Technology & Growth"
        description="Tell us about an ERP, website, marketing, or AI chatbot project. We respond by email."
        primaryHref="/technology/request-quote"
        primaryLabel="Discuss Your Project"
        showEmail
      />
    </>
  );
}
