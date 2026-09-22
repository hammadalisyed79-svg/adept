import type { Metadata } from "next";
import { QuoteCta } from "@/components/QuoteCta";
import { EditorialImageCard } from "@/components/media/EditorialImageCard";
import { MediaImage } from "@/components/media/MediaImage";
import { Button } from "@/components/ui/Button";
import { Container, PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { techMailto, technologyServices } from "@/content/technology";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Technology & Growth Solutions",
  description:
    "ERP solutions, website development, and digital marketing for fragrance and related businesses — from ADEPT Fragrances.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyOverviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology & Growth Solutions"
        title="Systems and channels that support commercial growth"
        description="Beyond fragrance manufacturing, ADEPT helps businesses connect products with operational software, digital storefronts, and practical marketing support."
        mediaKey="technologyGrowth"
      />

      <Section className="bg-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Fifth division"
              title="Build capability around the brand"
              description="Fragrance trading, packaging, manufacturing, and private label remain our core. Technology & Growth adds software, web, and marketing services for teams that need digital and operational support."
            />
            <p className="mt-6 text-sm leading-relaxed text-charcoal-muted">
              Discuss a project by email at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-charcoal underline underline-offset-2 hover:text-champagne-deep"
              >
                {company.email}
              </a>
              . Structured fragrance quotation types on the request-quote form are unchanged.
            </p>
          </div>
          <MediaImage
            mediaKey="technologyGrowth"
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
            eyebrow="Services"
            title="Three practical offerings"
            description="Each service is scoped project by project. No unverified client portfolios or performance guarantees are presented here."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-5 lg:grid-cols-3">
            {technologyServices.map((s, i) => (
              <EditorialImageCard
                key={s.href}
                href={s.href}
                mediaKey={s.mediaKey}
                index={`0${i + 1}`}
                label={s.label}
                title={s.title}
                description={s.summary}
                aspectClassName="aspect-[16/10]"
              />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={techMailto("Technology & Growth inquiry")}>Email {company.email}</Button>
            <Button href="/contact" variant="secondary">
              Contact page
            </Button>
          </div>
        </Container>
      </Section>

      <QuoteCta
        title="Talk about Technology & Growth"
        description="Tell us whether you need ERP, website, or marketing support. Email is the primary contact path for these services until dedicated inquiry types are authorized."
        primaryHref={techMailto("Technology & Growth inquiry")}
        primaryLabel={`Email ${company.email}`}
        showEmail
      />
    </>
  );
}
