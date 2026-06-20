import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";
import AnalyzePageClient from "./AnalyzePageClient";

export const metadata: Metadata = createMetadata({
  title: "Analyze Idea | LaunchMind AI",
  description: "Create and save a startup idea analysis inside LaunchMind.",
  path: "/analyze",
  noIndex: true,
});

export default function AnalyzePage() {
  return <AnalyzePageClient />;
}
