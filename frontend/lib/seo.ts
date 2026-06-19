import type { Metadata } from "next";

export const siteConfig = {
  name: "LaunchMind AI",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://launchmind.ai").replace(/\/$/, ""),
  description:
    "LaunchMind AI helps founders, students, and job seekers turn rough ideas into startup plans, business names, resumes, cover letters, and launch-ready documents.",
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
  title: "LaunchMind AI | Startup Idea Generator and AI Planning Tools",
  description: siteConfig.description,
  path: "/",
  keywords: [
    "LaunchMind AI",
    "startup idea generator",
    "AI tools",
    "business name generator",
    "startup planning software",
  ],
});
