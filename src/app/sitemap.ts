import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { industries } from "@/content/industries";
import { getSiteUrl } from "@/lib/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticRoutes = [
    "",
    "/about",
    "/services/fragrance-trading",
    "/services/toll-manufacturing",
    "/services/private-label",
    "/industries",
    "/process",
    "/insights",
    "/contact",
    "/request-quote",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...industries.map((i) => ({
      url: `${base}/industries/${i.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map((a) => ({
      url: `${base}/insights/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
