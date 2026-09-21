import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { articles, getArticle } from "@/content/articles";
import { getSiteUrl } from "@/lib/company";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `${getSiteUrl()}/insights/${article.slug}`,
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={article.title}
        description={`${article.publishedAt} · ${article.readingMinutes} min read`}
      />
      <Section>
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-charcoal/10 px-2 py-0.5 text-xs text-charcoal-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-5 text-base leading-relaxed text-charcoal-muted">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-12">
              <Link href="/insights" className="text-sm text-charcoal underline underline-offset-2">
                ← Back to insights
              </Link>
            </p>
          </article>
        </Container>
      </Section>
    </>
  );
}
