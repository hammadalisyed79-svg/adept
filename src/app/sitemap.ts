import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { industries } from "@/content/industries";
import { packagingCategories } from "@/content/packaging";
import { getPublishedProducts } from "@/content/catalogue";
import { getSiteUrl } from "@/lib/company";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

function entry(
  base: string,
  path: string,
  priority: number,
  changeFrequency: Freq = "monthly",
  lastModified: Date = new Date(),
) {
  return {
    url: path ? `${base}${path}` : base,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const core = [
    entry(base, "", 1, "weekly"),
    entry(base, "/about", 0.8),
    entry(base, "/services/fragrance-trading", 0.9),
    entry(base, "/services/toll-manufacturing", 0.85),
    entry(base, "/services/private-label", 0.85),
    entry(base, "/packaging", 0.9),
    entry(base, "/technology", 0.9),
    entry(base, "/technology/erp", 0.75),
    entry(base, "/technology/website-development", 0.75),
    entry(base, "/technology/digital-marketing", 0.75),
    entry(base, "/technology/ai-support", 0.75),
    entry(base, "/industries", 0.75),
    entry(base, "/process", 0.7),
    entry(base, "/insights", 0.7, "weekly"),
    entry(base, "/catalogue", 0.65),
    entry(base, "/contact", 0.8),
    entry(base, "/request-quote", 0.85),
    entry(base, "/technology/request-quote", 0.8),
    entry(base, "/privacy", 0.3, "yearly"),
    entry(base, "/terms", 0.3, "yearly"),
    entry(base, "/cookies", 0.3, "yearly"),
    entry(base, "/commercial-terms", 0.35, "yearly"),
  ];

  return [
    ...core,
    ...packagingCategories.map((c) => entry(base, c.href, 0.7)),
    ...getPublishedProducts().map((p) => entry(base, `/catalogue/${p.slug}`, 0.55)),
    ...industries.map((i) => entry(base, `/industries/${i.slug}`, 0.65)),
    ...articles.map((a) =>
      entry(base, `/insights/${a.slug}`, 0.55, "yearly", new Date(a.publishedAt)),
    ),
  ];
}
