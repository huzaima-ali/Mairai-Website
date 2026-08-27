import type { Metadata } from "next";
import { SITE } from "@/lib/content";

/** Canonical public origin used for SEO, sitemap, and structured data. */
export const CANONICAL_ORIGIN = "https://miraistudios.co";

export const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/miraistudios1/",
  "https://www.instagram.com/mirai_studios_/",
] as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_ORIGIN}${normalized === "/" ? "" : normalized}`;
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** When false, omit from indexing. Defaults to true. */
  index?: boolean;
  follow?: boolean;
  ogImage?: string;
  type?: "website" | "article";
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image";
};

/**
 * Reusable page metadata for title, description, canonical, robots, Open Graph and Twitter.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
  follow = true,
  ogImage,
  type = "website",
  canonicalUrl,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCard = "summary_large_image",
}: BuildMetadataInput): Metadata {
  const url = canonicalUrl || absoluteUrl(path);
  const image = ogImage ? absoluteUrl(ogImage) : absoluteUrl("/opengraph-image");
  const displayTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const ogDisplayTitle = ogTitle
    ? ogTitle.includes(SITE.name)
      ? ogTitle
      : `${ogTitle} | ${SITE.name}`
    : displayTitle;
  const twImage = twitterImage ? absoluteUrl(twitterImage) : image;

  return {
    title: {
      absolute: displayTitle,
    },
    description,
    alternates: { canonical: url },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title: ogDisplayTitle,
      description: ogDescription || description,
      images: [{ url: image, alt: ogDisplayTitle }],
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle || ogDisplayTitle,
      description: twitterDescription || ogDescription || description,
      images: [twImage],
    },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Array<Record<string, unknown>>) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mirai Studios LLC",
    alternateName: "Mirai Studios",
    url: CANONICAL_ORIGIN,
    logo: absoluteUrl("/icon"),
    description:
      "Mirai Studios is an AI product development and technology engineering company that designs, builds and scales AI products, AI agents, enterprise platforms, intelligent automation, digital twins and immersive experiences for businesses across the United States, United Kingdom and Middle East.",
    email: SITE.email,
    sameAs: [...SOCIAL_PROFILES],
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Place", name: "Middle East" },
    ],
    knowsAbout: [
      "AI product development",
      "AI agents",
      "Intelligent automation",
      "Custom software development",
      "Digital twins",
      "Immersive experiences",
      "Product design",
      "Enterprise engineering",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: CANONICAL_ORIGIN,
    description: SITE.description,
    publisher: {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      url: CANONICAL_ORIGIN,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webpageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  areaServed?: string | null;
}) {
  const page: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: CANONICAL_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      url: CANONICAL_ORIGIN,
    },
  };
  if (input.areaServed) {
    page.about = {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      areaServed: input.areaServed,
    };
    page.spatialCoverage = input.areaServed;
  }
  return page;
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  areaServed?: string | string[] | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      url: CANONICAL_ORIGIN,
    },
    areaServed: input.areaServed || ["United States", "United Kingdom", "Middle East"],
  };
}

export function creativeWorkJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : undefined,
    creator: {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      url: CANONICAL_ORIGIN,
    },
  };
}
