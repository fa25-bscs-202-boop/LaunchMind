import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Feasibility Reports | LaunchMind AI",
  description:
    "Generate and manage LaunchMind AI feasibility reports for saved startup ideas.",
  path: "/dashboard/reports",
  noIndex: true,
});

export default function ReportsLayout({ children }: { children: ReactNode }) {
  return children;
}
