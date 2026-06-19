import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "SWOT Analysis Detail | LaunchMind AI",
  description:
    "View and export a LaunchMind AI SWOT analysis generated from a saved startup idea.",
  path: "/dashboard/swot",
  noIndex: true,
});

export default function SwotDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
