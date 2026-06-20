import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";
import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { generateCompetitorAnalysis, type CompetitorAnalysis } from "../../lib/workspace";

export const metadata: Metadata = createMetadata({
  title: "Competitor Analysis | LaunchMind AI",
  description: "Generate competitor research from a saved LaunchMind analysis.",
  path: "/competitor",
  noIndex: true,
});

function CompetitorResult({ result }: { result: CompetitorAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Direct competitors</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.direct_competitors.map((item) => (
            <span
              key={item}
              className="inline-flex min-h-9 items-center rounded-full border border-primary/20 bg-primary/8 px-3 text-xs font-medium text-primary"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Market gap</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.market_gap}</p>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Differentiation</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.differentiation_strategy}</p>
      </div>
    </div>
  );
}

export default function CompetitorPage() {
  return (
    <ToolGeneratorPage
      title="Competitor analysis"
      description="Compare likely alternatives and identify where your idea can stand apart before building further."
      buttonLabel="Generate competitor analysis"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to prepare a competitor review."
      generate={generateCompetitorAnalysis}
      renderResult={(result) => <CompetitorResult result={result} />}
    />
  );
}
