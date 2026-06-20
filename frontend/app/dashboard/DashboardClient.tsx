"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/api";
import { getAnalyses, type Analysis } from "@/lib/workspace";
import { WorkspaceEmptyState } from "../components/WorkspaceEmptyState";
import { WorkspaceShell } from "../components/WorkspaceShell";

export default function DashboardClient() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAnalyses() {
      try {
        const response = await getAnalyses();
        if (isMounted) {
          setAnalyses(response);
        }
      } catch (err) {
        if (isUnauthorizedError(err)) {
          router.replace("/login?next=/dashboard");
          return;
        }

        if (isMounted) {
          setError("We couldn’t load your workspace right now. Please refresh and try again.");
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
  }, [router]);

  return (
    <WorkspaceShell
      title="Dashboard"
      description="Review only your saved idea analyses."
    >
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-lg border border-border bg-card/80 p-6" />
          ))}
        </div>
      ) : null}

      {!isLoading && error ? (
        <Alert variant="destructive" className="max-w-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {!isLoading && !error && analyses.length === 0 ? <WorkspaceEmptyState /> : null}

      {!isLoading && !error && analyses.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="bg-card/95">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-xl">{analysis.idea}</CardTitle>
                <CardDescription>
                  {new Date(analysis.created_at).toLocaleDateString()} · {analysis.industry || "General idea"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-border bg-background/30 p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-sm leading-6 text-muted-foreground">{analysis.one_line_pitch}</p>
                  </div>
                </div>
                <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {analysis.final_recommendation}
                </p>
                {analysis.startup_names.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.startup_names.slice(0, 2).map((name) => (
                      <span
                        key={name}
                        className="inline-flex min-h-9 max-w-full items-center rounded-full border border-primary/20 bg-primary/8 px-3 text-xs font-medium text-primary"
                      >
                        <span className="truncate">{name}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </WorkspaceShell>
  );
}
