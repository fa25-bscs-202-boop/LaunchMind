import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = createMetadata({
  title: "Dashboard | LaunchMind AI",
  description: "View your saved LaunchMind idea analyses and continue planning work.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardClient />;
}
