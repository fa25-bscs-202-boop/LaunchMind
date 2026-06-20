import type { Metadata } from "next";
import { Suspense } from "react";

import { createMetadata } from "../../lib/seo";
import { CompetitorClient } from "./CompetitorClient";

export const metadata: Metadata = createMetadata({
  title: "Competitor Analysis | LaunchMind AI",
  description: "Generate competitor research from a saved LaunchMind analysis.",
  path: "/competitor",
  noIndex: true,
});

export default function CompetitorPage() {
  return (
    <Suspense fallback={null}>
      <CompetitorClient />
    </Suspense>
  );
}
