import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "MVP Planner | LaunchMind AI Dashboard",
  description:
    "Generate and manage LaunchMind AI MVP plans with features, timeline, budget, team, and launch checklist.",
  path: "/dashboard/mvp",
  noIndex: true,
});

export default function MvpLayout({ children }: { children: ReactNode }) {
  return children;
}
