import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";
import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { generateReport, type Report } from "../../lib/workspace";

export const metadata: Metadata = createMetadata({
  title: "Feasibility Report | LaunchMind AI",
  description: "Generate a feasibility report from a saved LaunchMind analysis.",
  path: "/feasibility",
  noIndex: true,
});

function ReportResult({ result }: { result: Report }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Title</p>
        <p className="mt-3 text-base font-semibold text-foreground">{result.title}</p>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Executive summary</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.executive_summary}</p>
      </div>
      <div className="rounded-lg border border-border bg-background/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Recommendations</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.recommendations}</p>
      </div>
    </div>
  );
}

export default function FeasibilityPage() {
  return (
    <ToolGeneratorPage
      title="Feasibility report"
      description="Turn a saved idea analysis into a structured feasibility report you can review, refine, and reuse."
      buttonLabel="Generate feasibility report"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to prepare a fresh report."
      generate={generateReport}
      renderResult={(result) => <ReportResult result={result} />}
    />
  );
}
