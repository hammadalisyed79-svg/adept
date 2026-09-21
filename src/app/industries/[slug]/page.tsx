import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/QuoteCta";
import { MediaImage } from "@/components/media/MediaImage";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { getIndustry, industries } from "@/content/industries";
import { industryMediaBySlug } from "@/content/media";
import { getSiteUrl } from "@/lib/company";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.metaDescription,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: industry.title,
      description: industry.metaDescription,
      url: `${getSiteUrl()}/industries/${industry.slug}`,
    },
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const mediaKey = industryMediaBySlug[industry.slug] ?? "fragranceOils";

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={industry.title}
        description={industry.summary}
        mediaKey={mediaKey}
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Typical applications</h2>
            <ul className="mt-6 space-y-3">
              {industry.applications.map((a) => (
                <li key={a} className="flex gap-3 text-charcoal-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-champagne" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <MediaImage
              mediaKey={mediaKey}
              hoverScale={false}
              aspectClassName="aspect-[4/3] mb-8"
              sizes="50vw"
              className="border border-charcoal/10"
            />
            <h2 className="font-display text-3xl text-charcoal">Relevant services</h2>
            <ul className="mt-6 space-y-3">
              {industry.relevantServices.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-charcoal underline-offset-4 hover:underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-charcoal-muted">
              <Link href="/industries" className="underline underline-offset-2">
                ← All industries
              </Link>
            </p>
          </div>
        </Container>
      </Section>
      <QuoteCta title={`Discuss ${industry.title.toLowerCase()} requirements`} />
    </>
  );
}
