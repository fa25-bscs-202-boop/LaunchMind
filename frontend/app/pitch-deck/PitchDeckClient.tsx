"use client";

import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { TextReportSection } from "../components/ReportSections";
import { generatePitchDeck, type PitchDeck } from "../../lib/workspace";

function PitchResult({ result }: { result: PitchDeck }) {
  return (
    <div className="space-y-4">
      <TextReportSection label="Startup name">
        <p className="text-base font-semibold text-foreground">{result.startup_name}</p>
      </TextReportSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextReportSection label="Elevator pitch"><p>{result.elevator_pitch}</p></TextReportSection>
        <TextReportSection label="Problem"><p>{result.problem}</p></TextReportSection>
        <TextReportSection label="Solution"><p>{result.solution}</p></TextReportSection>
        <TextReportSection label="Target market"><p>{result.target_market}</p></TextReportSection>
        <TextReportSection label="Business model"><p>{result.business_model}</p></TextReportSection>
        <TextReportSection label="Competitor landscape"><p>{result.competitor_landscape}</p></TextReportSection>
        <TextReportSection label="Go-to-market"><p>{result.go_to_market_strategy}</p></TextReportSection>
        <TextReportSection label="Revenue model"><p>{result.revenue_model}</p></TextReportSection>
        <TextReportSection label="MVP summary"><p>{result.mvp_summary}</p></TextReportSection>
        <TextReportSection label="Traction strategy"><p>{result.traction_strategy}</p></TextReportSection>
        <TextReportSection label="Funding needs"><p>{result.funding_needs}</p></TextReportSection>
        <TextReportSection label="Future roadmap"><p>{result.future_roadmap}</p></TextReportSection>
      </div>
      <TextReportSection label="Closing statement"><p>{result.closing_statement}</p></TextReportSection>
    </div>
  );
}

export function PitchDeckClient() {
  return (
    <ToolGeneratorPage
      title="Pitch deck"
      description="Draft your narrative and go-to-market direction from a saved LaunchMind idea analysis."
      buttonLabel="Generate pitch deck"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to prepare pitch content."
      generate={generatePitchDeck}
      renderResult={(result) => <PitchResult result={result} />}
      getPdfExport={(result) => ({
        endpoint: `/exports/pitch/${result.id}/pdf`,
        filename: `launchmind-pitch-${result.id}.pdf`,
      })}
    />
  );
}
