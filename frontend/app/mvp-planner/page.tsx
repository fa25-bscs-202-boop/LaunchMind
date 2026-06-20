import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";
import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { generateMvpPlan, type MvpPlan } from "../../lib/workspace";

export const metadata: Metadata = createMetadata({
  title: "MVP Planner | LaunchMind AI",
  description: "Generate an MVP plan from a saved LaunchMind analysis.",
  path: "/mvp-planner",
  noIndex: true,
});

function MvpResult({ result }: { result: MvpPlan }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">MVP summary</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.mvp_summary}</p>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Core features</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          {result.core_features.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Timeline</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.timeline}</p>
      </div>
    </div>
  );
}

export default function MvpPlannerPage() {
  return (
    <ToolGeneratorPage
      title="MVP planner"
      description="Translate a saved idea analysis into a lean first version with focused scope and realistic milestones."
      buttonLabel="Generate MVP plan"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to build an MVP plan."
      generate={generateMvpPlan}
      renderResult={(result) => <MvpResult result={result} />}
    />
  );
}
