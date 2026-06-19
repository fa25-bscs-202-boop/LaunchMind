import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pitch Deck Detail | LaunchMind AI",
  description:
    "View and export a LaunchMind AI pitch deck generated from a saved startup analysis.",
  path: "/dashboard/pitch",
  noIndex: true,
});

export default function PitchDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
