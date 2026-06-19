import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Feasibility Report Detail | LaunchMind AI",
  description:
    "View and export a LaunchMind AI feasibility report generated from a saved startup analysis.",
  path: "/dashboard/reports",
  noIndex: true,
});

export default function ReportDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
