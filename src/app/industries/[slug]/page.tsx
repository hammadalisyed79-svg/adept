import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { getIndustry, industries } from "@/content/industries";
import { getMedia, industryMediaBySlug } from "@/content/media";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  const mediaKey = industryMediaBySlug[industry.slug] ?? "fragranceOils";
  const media = getMedia(mediaKey);
  return pageMetadata({
    title: industry.title,
    description: industry.metaDescription,
    path: `/industries/${industry.slug}`,
    image: media.src,
    imageAlt: media.alt,
  });
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
