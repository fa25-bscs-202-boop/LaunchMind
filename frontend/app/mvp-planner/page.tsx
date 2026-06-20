import type { Metadata } from "next";
import { Suspense } from "react";

import { createMetadata } from "../../lib/seo";
import { MvpPlannerClient } from "./MvpPlannerClient";

export const metadata: Metadata = createMetadata({
  title: "MVP Planner | LaunchMind AI",
  description: "Generate an MVP plan from a saved LaunchMind analysis.",
  path: "/mvp-planner",
  noIndex: true,
});

export default function MvpPlannerPage() {
  return (
    <Suspense fallback={null}>
      <MvpPlannerClient />
    </Suspense>
  );
}
