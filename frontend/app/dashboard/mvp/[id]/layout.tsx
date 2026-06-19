import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "MVP Plan Detail | LaunchMind AI",
  description:
    "View and export a LaunchMind AI MVP plan generated from a saved startup analysis.",
  path: "/dashboard/mvp",
  noIndex: true,
});

export default function MvpDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
