import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCta } from "@/components/QuoteCta";
import { Container, PageHero, Section } from "@/components/ui/Section";
import { articles } from "@/content/articles";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Educational articles on fragrance trading, concentration, private-label manufacturing, and industrial applications.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Practical guidance for fragrance buyers"
        description="Educational notes for commercial teams. No fictional research citations or unverifiable claims."
      />
      <Section>
        <Container>
          {articles.length === 0 ? (
            <div className="border border-dashed border-charcoal/20 bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl text-charcoal">Insights coming soon</p>
              <p className="mt-3 text-charcoal-muted">
                New articles will appear here as they are published.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <li key={article.slug} className="h-full">
                  <Link
                    href={`/insights/${article.slug}`}
                    className="group flex h-full flex-col border border-charcoal/10 bg-white p-7 transition hover:border-champagne/50"
                  >
                    <p className="text-xs uppercase tracking-wideish text-champagne-deep">
                      {article.publishedAt} · {article.readingMinutes} min
                    </p>
                    <h2 className="mt-3 font-display text-2xl text-charcoal">{article.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-muted">
                      {article.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-charcoal/10 px-2 py-0.5 text-xs text-charcoal-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-auto pt-5 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
                      Read →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <QuoteCta
        title="Have a fragrance project in mind?"
        description="Share your brief by email. We respond with next steps for sampling, packaging, or manufacturing."
      />
    </>
  );
}
