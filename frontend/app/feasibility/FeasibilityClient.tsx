"use client";

import { ToolGeneratorPage } from "../components/ToolGeneratorPage";
import { TextReportSection } from "../components/ReportSections";
import { generateReport, type Report } from "../../lib/workspace";

function ReportResult({ result }: { result: Report }) {
  return (
    <div className="space-y-4">
      <TextReportSection label="Title">
        <p className="text-base font-semibold text-foreground">{result.title}</p>
      </TextReportSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextReportSection label="Executive summary"><p>{result.executive_summary}</p></TextReportSection>
        <TextReportSection label="Introduction"><p>{result.introduction}</p></TextReportSection>
        <TextReportSection label="Problem statement"><p>{result.problem_statement}</p></TextReportSection>
        <TextReportSection label="Objectives"><p>{result.objectives}</p></TextReportSection>
        <TextReportSection label="Scope"><p>{result.scope}</p></TextReportSection>
        <TextReportSection label="Methodology"><p>{result.methodology}</p></TextReportSection>
        <TextReportSection label="Market feasibility"><p>{result.market_feasibility}</p></TextReportSection>
        <TextReportSection label="Technical feasibility"><p>{result.technical_feasibility}</p></TextReportSection>
        <TextReportSection label="Operational feasibility"><p>{result.operational_feasibility}</p></TextReportSection>
        <TextReportSection label="Financial feasibility"><p>{result.financial_feasibility}</p></TextReportSection>
        <TextReportSection label="Legal considerations"><p>{result.legal_considerations}</p></TextReportSection>
        <TextReportSection label="Risk assessment"><p>{result.risk_assessment}</p></TextReportSection>
        <TextReportSection label="Findings"><p>{result.findings}</p></TextReportSection>
        <TextReportSection label="Recommendations"><p>{result.recommendations}</p></TextReportSection>
      </div>
      <TextReportSection label="Conclusion"><p>{result.conclusion}</p></TextReportSection>
    </div>
  );
}

export function FeasibilityClient() {
  return (
    <ToolGeneratorPage
      title="Feasibility report"
      description="Turn a saved idea analysis into a structured feasibility report you can review, refine, and reuse."
      buttonLabel="Generate feasibility report"
      loadingText="Analyzing your idea... this may take a few seconds."
      emptyLabel="Choose one of your saved analyses to prepare a fresh report."
      generate={generateReport}
      renderResult={(result) => <ReportResult result={result} />}
      getPdfExport={(result) => ({
        endpoint: `/exports/report/${result.id}/pdf`,
        filename: `launchmind-report-${result.id}.pdf`,
      })}
    />
  );
}
