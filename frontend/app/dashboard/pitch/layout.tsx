import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pitch Deck Generator | LaunchMind AI Dashboard",
  description:
    "Generate and manage LaunchMind AI pitch deck content for saved startup analyses.",
  path: "/dashboard/pitch",
  noIndex: true,
});

export default function PitchLayout({ children }: { children: ReactNode }) {
  return children;
}
