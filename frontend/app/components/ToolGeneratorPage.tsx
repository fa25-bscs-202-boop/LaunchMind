"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, RefreshCcw, Sparkles } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/api";
import { downloadPdf } from "@/lib/download";
import { getAnalyses, type Analysis } from "@/lib/workspace";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";
import { WorkspaceShell } from "./WorkspaceShell";

function normalizeToolError(message: string) {
  if (!message) {
    return "Something went wrong generating your report. Please try again.";
  }

  if (message.includes("longer than expected")) {
    return "This is taking longer than expected. Please try again.";
  }

  if (message.includes("temporarily unavailable")) {
    return message;
  }

  return "Something went wrong generating your report. Please try again.";
}

export function ToolGeneratorPage<Result>({
  title,
  description,
  buttonLabel,
  loadingText,
  emptyLabel,
  generate,
  renderResult,
  getPdfExport,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  loadingText: string;
  emptyLabel: string;
  generate: (analysisId: number) => Promise<Result>;
  renderResult: (result: Result) => React.ReactNode;
  getPdfExport?: (result: Result) => { endpoint: string; filename: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalyses() {
      try {
        const response = await getAnalyses();
        if (!isMounted) {
          return;
        }

        setAnalyses(response);

        const queryAnalysisId = searchParams.get("analysis");
        const initialAnalysisId =
          queryAnalysisId && response.some((analysis) => String(analysis.id) === queryAnalysisId)
            ? queryAnalysisId
            : response[0]
              ? String(response[0].id)
              : "";

        setSelectedAnalysisId(initialAnalysisId);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }

        if (isMounted) {
          setError("We couldn’t load your saved plans right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalyses();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedAnalysisId) {
      setError("Choose a saved analysis before generating this output.");
      return;
    }

    try {
      setIsGenerating(true);
      const generatedResult = await generate(Number(selectedAnalysisId));
      setResult(generatedResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(normalizeToolError(message));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleExportPdf() {
    if (!result || !getPdfExport) {
      return;
    }

    const pdfExport = getPdfExport(result);

    try {
      setIsExporting(true);
      setError("");
      await downloadPdf(pdfExport.endpoint, pdfExport.filename);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      setError("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <WorkspaceShell title={title} description={description}>
      {isLoading ? (
        <div className="grid gap-4">
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card/80 p-6" />
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card/80 p-6" />
        </div>
      ) : null}

      {!isLoading && !error && analyses.length === 0 ? <WorkspaceEmptyState /> : null}

      {!isLoading && analyses.length > 0 ? (
        <div className="grid gap-6">
          <Card className="bg-card/95">
            <CardHeader>
              <CardTitle className="text-xl">{buttonLabel}</CardTitle>
              <CardDescription>{emptyLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor={`${title}-analysis`}>Saved analysis</Label>
                  <Select
                    id={`${title}-analysis`}
                    value={selectedAnalysisId}
                    onChange={(event) => setSelectedAnalysisId(event.target.value)}
                  >
                    {analyses.map((analysis) => (
                      <option key={analysis.id} value={analysis.id}>
                        {analysis.idea}
                      </option>
                    ))}
                  </Select>
                </div>

                {error ? (
                  <Alert variant="destructive" className="lg:col-span-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  className="w-full sm:mx-auto sm:max-w-sm lg:col-span-2"
                  isLoading={isGenerating}
                  loadingText={loadingText}
                >
                  {buttonLabel}
                </Button>

                {error ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:mx-auto sm:max-w-sm lg:col-span-2"
                    onClick={() => setError("")}
                  >
                    <RefreshCcw className="size-4" aria-hidden="true" />
                    Retry
                  </Button>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card/95">
            <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl">Output</CardTitle>
                <CardDescription>
                  {isGenerating ? "Analyzing your idea... this may take a few seconds." : "Generated content will appear here."}
                </CardDescription>
              </div>
              {!isGenerating && result && getPdfExport ? (
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
              {isGenerating ? (
                <div className="grid gap-3">
                  <div className="h-6 w-36 rounded bg-primary/12 animate-pulse" />
                  <div className="h-20 rounded-lg bg-background/40 animate-pulse" />
                  <div className="h-20 rounded-lg bg-background/40 animate-pulse" />
                </div>
              ) : null}

              {!isGenerating && result ? renderResult(result) : null}

              {!isGenerating && !result ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/25 px-6 text-center">
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Ready when you are</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Pick one of your saved analyses and generate the next planning document.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </WorkspaceShell>
  );
}
