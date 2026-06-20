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
  { path: "/privacy", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.35 },
];

export const blogArticles = [
  {
    title: "How to write a startup feasibility report that feels realistic",
    description:
      "A practical walkthrough for turning a rough startup concept into a report that sounds credible, useful, and presentation-ready.",
    category: "Planning guide",
    readTime: "4 min read",
  },
  {
    title: "Startup SWOT analysis: what to include and what to skip",
    description:
      "A clear guide to building a SWOT analysis that actually helps with next-step decisions instead of repeating generic advice.",
    category: "Strategy",
    readTime: "5 min read",
  },
  {
    title: "MVP planning for beginners: start smaller than you think",
    description:
      "Why the first version of a startup idea should focus on the smallest useful workflow and how to define it well.",
    category: "Product planning",
    readTime: "4 min read",
  },
];

export async function getDynamicSitemapRoutes(): Promise<IndexedRoute[]> {
  return [];
}
