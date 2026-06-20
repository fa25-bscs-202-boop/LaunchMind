"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isUnauthorizedError } from "@/lib/api";
import { downloadPdf } from "@/lib/download";
import { createAnalysis, type Analysis } from "@/lib/workspace";
import { ListReportSection, TextReportSection } from "../components/ReportSections";
import { WorkspaceShell } from "../components/WorkspaceShell";

export default function AnalyzePageClient() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError("");
    setError("");

    if (idea.trim().length < 20) {
      setFieldError("Describe your idea in at least 20 characters so LaunchMind has enough context to analyze it.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await createAnalysis({
        idea: idea.trim(),
        industry: industry.trim() || undefined,
        target_audience: targetAudience.trim() || undefined,
      });
      setResult(response);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/login?next=/analyze");
        return;
      }

      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("longer than expected")
          ? message
          : message || "Something went wrong generating your report. Try again when you’re ready.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExportPdf() {
    if (!result) {
      return;
    }

    try {
      setIsExporting(true);
      setError("");
      await downloadPdf(`/exports/analysis/${result.id}/pdf`, `launchmind-analysis-${result.id}.pdf`);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/login?next=/analyze");
        return;
      }

      setError("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <WorkspaceShell
      title="Analyze your startup idea"
      description="Capture the core idea first, then reuse it across feasibility, pitch, SWOT, competitor research, and MVP planning."
    >
      <div className="grid gap-6">
        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle className="text-xl">Create your first plan</CardTitle>
            <CardDescription>Give LaunchMind a clear summary, industry context, and the audience you want to serve.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="idea">Idea</Label>
                <Textarea
                  id="idea"
                  value={idea}
                  onChange={(event) => {
                    setIdea(event.target.value);
                    setFieldError("");
                  }}
                  placeholder="Describe the startup idea, the problem it solves, and the kind of outcome you want."
                  aria-invalid={Boolean(fieldError)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  placeholder="Education, fintech, health, ecommerce..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="target-audience">Target audience</Label>
                <Input
                  id="target-audience"
                  value={targetAudience}
                  onChange={(event) => setTargetAudience(event.target.value)}
                  placeholder="University students, small retailers, remote teams..."
                />
              </div>

              {fieldError ? (
                <Alert variant="destructive" className="lg:col-span-2">
                  <AlertDescription>{fieldError}</AlertDescription>
                </Alert>
              ) : null}

              {error ? (
                <Alert variant="destructive" className="lg:col-span-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button
                type="submit"
                className="w-full sm:mx-auto sm:max-w-sm lg:col-span-2"
                isLoading={isLoading}
                loadingText="Analyzing your idea... this may take a few seconds."
              >
                Analyze idea
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card/95">
          <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl">Output</CardTitle>
              <CardDescription>
                {isLoading ? "Analyzing your idea... this may take a few seconds." : "Generated content will appear here."}
              </CardDescription>
            </div>
            {result ? (
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={handleExportPdf}
                isLoading={isExporting}
                loadingText="Exporting..."
              >
                <Download className="size-4" aria-hidden="true" />
                Export PDF
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                <div className="h-6 w-44 rounded bg-primary/12 animate-pulse" />
                <div className="h-24 rounded-lg bg-background/40 animate-pulse" />
                <div className="h-24 rounded-lg bg-background/40 animate-pulse" />
              </div>
            ) : null}

            {!isLoading && result ? (
              <div className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  <TextReportSection label="One-line pitch">
                    <p className="text-foreground">{result.one_line_pitch}</p>
                  </TextReportSection>
                  <TextReportSection label="Target market">
                    <p>{result.target_market}</p>
                  </TextReportSection>
                  <TextReportSection label="Problem statement">
                    <p>{result.problem_statement}</p>
                  </TextReportSection>
                  <TextReportSection label="Proposed solution">
                    <p>{result.proposed_solution}</p>
                  </TextReportSection>
                </div>

                {result.startup_names.length > 0 ? (
                  <section className="rounded-lg border border-border bg-background/30 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Startup names</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.startup_names.map((name) => (
                        <span
                          key={name}
                          className="inline-flex min-h-9 max-w-full items-center rounded-full border border-primary/20 bg-primary/8 px-3 text-xs font-medium text-primary"
                        >
                          <span className="truncate">{name}</span>
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                <div className="grid gap-4 lg:grid-cols-2">
                  <TextReportSection label="Market feasibility">
                    <p>{result.market_feasibility}</p>
                  </TextReportSection>
                  <TextReportSection label="Technical feasibility">
                    <p>{result.technical_feasibility}</p>
                  </TextReportSection>
                  <TextReportSection label="Financial feasibility">
                    <p>{result.financial_feasibility}</p>
                  </TextReportSection>
                  <TextReportSection label="Operational feasibility">
                    <p>{result.operational_feasibility}</p>
                  </TextReportSection>
                  <TextReportSection label="Legal feasibility">
                    <p>{result.legal_feasibility}</p>
                  </TextReportSection>
                  <TextReportSection label="Final recommendation">
                    <p>{result.final_recommendation}</p>
                  </TextReportSection>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <ListReportSection label="Risk assessment" items={result.risk_assessment} />
                  <ListReportSection label="Revenue model" items={result.revenue_model} />
                  <ListReportSection label="Launch roadmap" items={result.launch_roadmap} />
                </div>
              </div>
            ) : null}

            {!isLoading && !result ? (
              <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-background/25 px-6 text-center">
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  Start with one solid idea analysis here. LaunchMind will save it so you can reuse it across every planning tool.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  );
}
