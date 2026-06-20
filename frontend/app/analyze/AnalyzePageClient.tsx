"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isUnauthorizedError } from "@/lib/api";
import { createAnalysis, type Analysis } from "@/lib/workspace";
import { WorkspaceShell } from "../components/WorkspaceShell";

export default function AnalyzePageClient() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
          : "Something went wrong generating your report. Try again when you’re ready.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <WorkspaceShell
      title="Analyze your startup idea"
      description="Capture the core idea first, then reuse it across feasibility, pitch, SWOT, competitor research, and MVP planning."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle className="text-xl">Create your first plan</CardTitle>
            <CardDescription>Give LaunchMind a clear summary, industry context, and the audience you want to serve.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
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
                <Alert variant="destructive">
                  <AlertDescription>{fieldError}</AlertDescription>
                </Alert>
              ) : null}

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText="Analyzing your idea... this may take a few seconds."
              >
                Analyze idea
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle className="text-xl">Analysis result</CardTitle>
            <CardDescription>
              {isLoading ? "Analyzing your idea... this may take a few seconds." : "Your saved analysis will appear here."}
            </CardDescription>
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
                <div className="rounded-lg border border-border bg-background/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">One-line pitch</p>
                  <p className="mt-3 text-sm leading-6 text-foreground">{result.one_line_pitch}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Recommendation</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.final_recommendation}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/dashboard">View dashboard</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={`/feasibility?analysis=${result.id}`}>Generate feasibility report</Link>
                  </Button>
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
