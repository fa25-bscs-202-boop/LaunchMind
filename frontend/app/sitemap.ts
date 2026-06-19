import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/seo";
import { getDynamicSitemapRoutes, publicSitemapRoutes } from "../lib/seo-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const dynamicRoutes = await getDynamicSitemapRoutes();

  return [...publicSitemapRoutes, ...dynamicRoutes].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified || now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
