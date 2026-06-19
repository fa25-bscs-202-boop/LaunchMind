import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "New Startup Idea Analysis | LaunchMind AI",
  description:
    "Analyze a startup idea with LaunchMind AI and generate feasibility, risk, revenue, and roadmap insights.",
  path: "/dashboard/new-analysis",
  noIndex: true,
});

export default function NewAnalysisLayout({ children }: { children: ReactNode }) {
  return children;
}
