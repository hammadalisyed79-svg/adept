import type { Metadata } from "next";
import { company, getSiteUrl, isTelephonePlaceholder } from "@/lib/company";

const siteUrl = () => getSiteUrl();

export const DEFAULT_OG_IMAGE = {
  url: "/images/adept/og-default.png",
  width: 1200,
  height: 675,
  alt: `${company.name} — B2B fragrance, packaging, manufacturing, and Technology & Growth`,
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute title (home) — skips template */
  absoluteTitle?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

/**
 * Consistent title, description, canonical, Open Graph, and Twitter metadata.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  image = DEFAULT_OG_IMAGE.url,
  imageAlt = DEFAULT_OG_IMAGE.alt,
  type = "website",
  publishedTime,
  noIndex = false,
}: PageMetaInput): Metadata {
  const base = siteUrl();
  const url = path === "/" ? base : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const ogTitle = absoluteTitle ?? `${title} | ${company.name}`;
  const images = [
    {
      url: image,
      width: 1200,
      height: 675,
      alt: imageAlt,
    },
  ];

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path === "/" ? base : path },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: company.name,
      title: ogTitle,
      description,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

export function organizationJsonLd() {
  const base = siteUrl();
  const sameAs = [company.social.linkedin, company.social.instagram].filter(
    Boolean,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: base,
    email: company.email,
    description: company.positioning,
    logo: `${base}/images/adept/og-default.png`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(!isTelephonePlaceholder() ? { telephone: company.telephone } : {}),
    ...(company.addressVerified && company.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: company.address,
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: base,
    description: company.positioning,
    publisher: {
      "@type": "Organization",
      name: company.name,
      url: base,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? base : `${base}${item.path}`,
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
}) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    author: {
      "@type": "Organization",
      name: company.name,
    },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: {
        "@type": "ImageObject",
        url: `${base}/images/adept/og-default.png`,
      },
    },
    mainEntityOfPage: `${base}${input.path}`,
  };
}
