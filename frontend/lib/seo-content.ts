export type SitemapFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type IndexedRoute = {
  path: string;
  lastModified?: Date;
  changeFrequency: SitemapFrequency;
  priority: number;
};

export const publicSitemapRoutes: IndexedRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.85 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.65 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.55 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.35 },
];

export const blogArticles = [
  {
    title: "Why LaunchMind now uses a simpler public experience",
    description:
      "A short note on reducing navigation clutter and focusing the site on essential public pages.",
    category: "Product update",
    readTime: "4 min read",
  },
  {
    title: "What belongs on a clear software pricing page",
    description:
      "How to keep pricing pages useful when your product direction is evolving and feature scope is changing.",
    category: "Product strategy",
    readTime: "5 min read",
  },
  {
    title: "How to structure an FAQ page that actually helps users",
    description:
      "A practical guide to writing FAQs that reduce confusion instead of repeating marketing copy.",
    category: "Content design",
    readTime: "4 min read",
  },
];

export async function getDynamicSitemapRoutes(): Promise<IndexedRoute[]> {
  return [];
}
