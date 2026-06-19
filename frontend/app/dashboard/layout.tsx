import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Dashboard | LaunchMind AI",
  description:
    "LaunchMind AI dashboard for startup analyses, reports, pitch decks, SWOT, competitor research, and MVP plans.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
