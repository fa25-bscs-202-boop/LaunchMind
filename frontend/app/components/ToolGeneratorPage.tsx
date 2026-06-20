"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCcw, Sparkles } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/api";
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
}: {
  title: string;
  description: string;
  buttonLabel: string;
  loadingText: string;
  emptyLabel: string;
  generate: (analysisId: number) => Promise<Result>;
  renderResult: (result: Result) => React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const selectedAnalysis = useMemo(
    () => analyses.find((analysis) => String(analysis.id) === selectedAnalysisId) ?? null,
    [analyses, selectedAnalysisId],
  );

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

  return (
    <WorkspaceShell title={title} description={description}>
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card/80 p-6" />
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card/80 p-6" />
        </div>
      ) : null}

      {!isLoading && !error && analyses.length === 0 ? <WorkspaceEmptyState /> : null}

      {!isLoading && analyses.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <Card className="bg-card/95">
            <CardHeader>
              <CardTitle className="text-xl">{buttonLabel}</CardTitle>
              <CardDescription>{emptyLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
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

                {selectedAnalysis ? (
                  <div className="rounded-lg border border-border bg-background/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Selected idea</p>
                    <p className="mt-3 text-sm leading-6 text-foreground">{selectedAnalysis.one_line_pitch}</p>
                  </div>
                ) : null}

                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <Button type="submit" className="w-full" isLoading={isGenerating} loadingText={loadingText}>
                  {buttonLabel}
                </Button>

                {error ? (
                  <Button type="button" variant="secondary" className="w-full" onClick={() => setError("")}>
                    <RefreshCcw className="size-4" aria-hidden="true" />
                    Retry
                  </Button>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card/95">
            <CardHeader>
              <CardTitle className="text-xl">Output</CardTitle>
              <CardDescription>
                {isGenerating ? "Analyzing your idea... this may take a few seconds." : "Generated content will appear here."}
              </CardDescription>
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
                  <Button asChild variant="secondary" className="mt-6">
                    <Link href="/dashboard">Back to dashboard</Link>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </WorkspaceShell>
  );
}
