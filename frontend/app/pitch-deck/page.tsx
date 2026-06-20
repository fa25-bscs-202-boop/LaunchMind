import type { Metadata } from "next";
import { Suspense } from "react";

import { createMetadata } from "../../lib/seo";
import { PitchDeckClient } from "./PitchDeckClient";

export const metadata: Metadata = createMetadata({
  title: "Pitch Deck | LaunchMind AI",
  description: "Generate a pitch deck outline from a saved LaunchMind analysis.",
  path: "/pitch-deck",
  noIndex: true,
});

export default function PitchDeckPage() {
  return (
    <Suspense fallback={null}>
      <PitchDeckClient />
    </Suspense>
  );
}
