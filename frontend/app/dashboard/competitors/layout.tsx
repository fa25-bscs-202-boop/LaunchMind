import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Competitor Analysis Generator | LaunchMind AI Dashboard",
  description:
    "Generate and manage LaunchMind AI competitor analyses for saved startup ideas.",
  path: "/dashboard/competitors",
  noIndex: true,
});

export default function CompetitorsLayout({ children }: { children: ReactNode }) {
  return children;
}
