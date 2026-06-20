import type { Metadata } from "next";

export const siteConfig = {
  name: "LaunchMind AI",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://launchmind.app").replace(/\/$/, ""),
  description:
    "LaunchMind AI helps founders, students, and early teams turn rough startup ideas into structured plans, reports, pitch decks, SWOT analysis, competitor research, and MVP roadmaps.",
  ogImage: "/launchmind-og.jpg",
  locale: "en_US",
  keywords: [
    "LaunchMind AI",
    "startup idea generator",
    "startup planning tools",
    "feasibility report generator",
    "pitch deck generator",
    "SWOT analysis tool",
    "MVP planner",
  ],
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
    applicationName: siteConfig.name,
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    creator: "LaunchMind AI",
    publisher: "LaunchMind AI",
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
    category: "technology",
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
  title: "LaunchMind AI | Startup Planning, Reports, Pitch Decks and MVP Tools",
  description: siteConfig.description,
  path: "/",
  keywords: ["AI tools", "business name generator", "startup planning software"],
});
