import type { Metadata } from "next";
import { Suspense } from "react";

import { createMetadata } from "../../lib/seo";
import { SwotClient } from "./SwotClient";

export const metadata: Metadata = createMetadata({
  title: "SWOT Analysis | LaunchMind AI",
  description: "Generate a SWOT analysis from a saved LaunchMind analysis.",
  path: "/swot",
  noIndex: true,
});

export default function SwotPage() {
  return (
    <Suspense fallback={null}>
      <SwotClient />
    </Suspense>
  );
}
