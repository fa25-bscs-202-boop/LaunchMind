import type { Metadata } from "next";

export const siteConfig = {
  name: "LaunchMind",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://launchmind.app").replace(/\/$/, ""),
  description: "AI-powered content platform for GEO, SEO and AI search.",
  ogImage: "/launchmind-og.svg",
  locale: "en_US",
};

export type SeoPage = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function createMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: SeoPage): Metadata {
  const imageUrl = absoluteUrl(siteConfig.ogImage);

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "LaunchMind AI startup planning workspace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export const defaultMetadata = createMetadata({
  title: "LaunchMind - AI Content Platform for GEO, SEO & AI Search",
  description: siteConfig.description,
  path: "/",
  keywords: [
    "LaunchMind",
    "GEO content",
    "SEO content",
    "AI search",
    "content platform",
  ],
});
