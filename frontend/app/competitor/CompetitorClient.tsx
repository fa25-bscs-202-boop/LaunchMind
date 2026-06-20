"use client";

import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { ListReportSection, TextReportSection } from "../components/ReportSections";
import { generateCompetitorAnalysis, type CompetitorAnalysis } from "../../lib/workspace";

function CompetitorResult({ result }: { result: CompetitorAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ListReportSection label="Direct competitors" items={result.direct_competitors} />
        <ListReportSection label="Indirect competitors" items={result.indirect_competitors} />
        <TextReportSection label="Competitor strengths"><p>{result.competitor_strengths}</p></TextReportSection>
        <TextReportSection label="Competitor weaknesses"><p>{result.competitor_weaknesses}</p></TextReportSection>
        <TextReportSection label="Market gap"><p>{result.market_gap}</p></TextReportSection>
        <TextReportSection label="Differentiation"><p>{result.differentiation_strategy}</p></TextReportSection>
        <TextReportSection label="Pricing comparison"><p>{result.pricing_comparison}</p></TextReportSection>
        <TextReportSection label="Recommendations"><p>{result.recommendations}</p></TextReportSection>
      </div>
    </div>
  );
}

export function CompetitorClient() {
  return (
    <ToolGeneratorPage
      title="Competitor analysis"
      description="Compare likely alternatives and identify where your idea can stand apart before building further."
      buttonLabel="Generate competitor analysis"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to prepare a competitor review."
      generate={generateCompetitorAnalysis}
      renderResult={(result) => <CompetitorResult result={result} />}
      getPdfExport={(result) => ({
        endpoint: `/exports/competitor/${result.id}/pdf`,
        filename: `launchmind-competitor-${result.id}.pdf`,
      })}
    />
  );
}
