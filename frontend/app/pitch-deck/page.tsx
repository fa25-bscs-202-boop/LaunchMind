import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";
import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { generatePitchDeck, type PitchDeck } from "../../lib/workspace";

export const metadata: Metadata = createMetadata({
  title: "Pitch Deck | LaunchMind AI",
  description: "Generate a pitch deck outline from a saved LaunchMind analysis.",
  path: "/pitch-deck",
  noIndex: true,
});

function PitchResult({ result }: { result: PitchDeck }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Startup name</p>
        <p className="mt-3 text-base font-semibold text-foreground">{result.startup_name}</p>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Elevator pitch</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.elevator_pitch}</p>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Go-to-market</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.go_to_market_strategy}</p>
      </div>
    </div>
  );
}

export default function PitchDeckPage() {
  return (
    <ToolGeneratorPage
      title="Pitch deck"
      description="Draft your narrative and go-to-market direction from a saved LaunchMind idea analysis."
      buttonLabel="Generate pitch deck"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to prepare pitch content."
      generate={generatePitchDeck}
      renderResult={(result) => <PitchResult result={result} />}
    />
  );
}
