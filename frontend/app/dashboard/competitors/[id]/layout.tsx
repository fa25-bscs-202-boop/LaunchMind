import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Competitor Analysis Detail | LaunchMind AI",
  description:
    "View and export a LaunchMind AI competitor analysis generated from a saved startup idea.",
  path: "/dashboard/competitors",
  noIndex: true,
});

export default function CompetitorDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
