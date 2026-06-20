"use client";

import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { ListReportSection, TextReportSection } from "../components/ReportSections";
import { generateMvpPlan, type MvpPlan } from "../../lib/workspace";

function MvpResult({ result }: { result: MvpPlan }) {
  return (
    <div className="space-y-4">
      <TextReportSection label="MVP summary"><p>{result.mvp_summary}</p></TextReportSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <ListReportSection label="Core features" items={result.core_features} />
        <ListReportSection label="Excluded features" items={result.excluded_features} />
        <ListReportSection label="Recommended tech stack" items={result.recommended_tech_stack} />
        <ListReportSection label="Development phases" items={result.development_phases} />
        <TextReportSection label="Timeline"><p>{result.timeline}</p></TextReportSection>
        <ListReportSection label="Required team" items={result.required_team} />
        <TextReportSection label="Budget considerations"><p>{result.budget_considerations}</p></TextReportSection>
        <ListReportSection label="Launch checklist" items={result.launch_checklist} />
      </div>
      <ListReportSection label="Success metrics" items={result.success_metrics} />
    </div>
  );
}

export function MvpPlannerClient() {
  return (
    <ToolGeneratorPage
      title="MVP planner"
      description="Translate a saved idea analysis into a lean first version with focused scope and realistic milestones."
      buttonLabel="Generate MVP plan"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to build an MVP plan."
      generate={generateMvpPlan}
      renderResult={(result) => <MvpResult result={result} />}
      getPdfExport={(result) => ({
        endpoint: `/exports/mvp/${result.id}/pdf`,
        filename: `launchmind-mvp-${result.id}.pdf`,
      })}
    />
  );
}
