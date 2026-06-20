import type { Metadata } from "next";
import { Suspense } from "react";

import { createMetadata } from "../../lib/seo";
import { FeasibilityClient } from "./FeasibilityClient";

export const metadata: Metadata = createMetadata({
  title: "Feasibility Report | LaunchMind AI",
  description: "Generate a feasibility report from a saved LaunchMind analysis.",
  path: "/feasibility",
  noIndex: true,
});

export default function FeasibilityPage() {
  return (
    <Suspense fallback={null}>
      <FeasibilityClient />
    </Suspense>
  );
}
