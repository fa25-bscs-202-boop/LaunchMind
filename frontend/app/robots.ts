import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/analyze",
        "/feasibility",
        "/pitch-deck",
        "/swot",
        "/competitor",
        "/mvp-planner",
        "/login",
        "/register",
        "/verify-email",
        "/forgot-password",
        "/oauth/",
        "/api/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(siteConfig.url).host,
  };
}
