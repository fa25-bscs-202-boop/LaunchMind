import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Saved Startup Analyses | LaunchMind AI",
  description:
    "Review saved LaunchMind AI startup idea analyses and continue into reports, SWOT, competitor research, and MVP plans.",
  path: "/dashboard/analyses",
  noIndex: true,
});

export default function AnalysesLayout({ children }: { children: ReactNode }) {
  return children;
}
