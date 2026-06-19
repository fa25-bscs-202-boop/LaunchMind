import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Startup Analysis Detail | LaunchMind AI",
  description:
    "View a saved LaunchMind AI startup analysis and generate connected planning documents.",
  path: "/dashboard/analyses",
  noIndex: true,
});

export default function AnalysisDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
