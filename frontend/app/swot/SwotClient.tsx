"use client";

import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { generateSwotAnalysis, type SwotAnalysis } from "../../lib/workspace";

function SwotResult({ result }: { result: SwotAnalysis }) {
  const sections = [
    { label: "Strengths", items: result.strengths },
    { label: "Weaknesses", items: result.weaknesses },
    { label: "Opportunities", items: result.opportunities },
    { label: "Threats", items: result.threats },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <div key={section.label} className="rounded-lg border border-border bg-background/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{section.label}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            {section.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SwotClient() {
  return (
    <ToolGeneratorPage
      title="SWOT analysis"
      description="Review strengths, weaknesses, opportunities, and threats using the same saved idea context."
      buttonLabel="Generate SWOT analysis"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to generate a SWOT view."
      generate={generateSwotAnalysis}
      renderResult={(result) => <SwotResult result={result} />}
      getPdfExport={(result) => ({
        endpoint: `/exports/swot/${result.id}/pdf`,
        filename: `launchmind-swot-${result.id}.pdf`,
      })}
    />
  );
}
