import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "SWOT Analysis Generator | LaunchMind AI Dashboard",
  description:
    "Generate and manage LaunchMind AI SWOT analyses for saved startup ideas.",
  path: "/dashboard/swot",
  noIndex: true,
});

export default function SwotLayout({ children }: { children: ReactNode }) {
  return children;
}
