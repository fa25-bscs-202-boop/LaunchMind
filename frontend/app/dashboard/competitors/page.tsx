"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
// Navbar is provided globally in layout
import { apiRequest, isUnauthorizedError } from "../../../lib/api";
import { hasStoredUserToken, logoutUser } from "../../../lib/auth";

type AnalysisOption = {
  id: number;
  startup_names?: string[];
  one_line_pitch: string;
};

type CompetitorAnalysis = {
  id: number;
  analysis_id: number;
  startup_name?: string | null;
  market_gap?: string | null;
  differentiation_strategy?: string | null;
  recommendations?: string | null;
  created_at: string;
};

type GeneratedResponse = {
  id: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getAnalysisLabel(analysis: AnalysisOption) {
  return analysis.startup_names?.[0] || analysis.one_line_pitch || `Analysis #${analysis.id}`;
}

function SkeletonCards() {
  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-2">
      {["one", "two", "three", "four"].map((item) => (
        <div
          key={item}
          className="h-60 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7"
        >
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="mt-6 h-7 w-64 rounded-full bg-white/10" />
          <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-5/6 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function CompetitorResearchPage() {
  const router = useRouter();
  const [items, setItems] = useState<CompetitorAnalysis[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisOption[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const analysisNames = useMemo(() => {
    return new Map(analyses.map((analysis) => [analysis.id, getAnalysisLabel(analysis)]));
  }, [analyses]);

  useEffect(() => {
    async function loadPageData() {
      if (!hasStoredUserToken()) {
        router.push("/login");
        return;
      }

      try {
        const [competitorData, analysisData] = await Promise.all([
          apiRequest<CompetitorAnalysis[]>("/competitors"),
          apiRequest<AnalysisOption[]>("/analyses"),
        ]);
        setItems(competitorData);
        setAnalyses(analysisData);
        setSelectedAnalysisId(analysisData[0]?.id ? String(analysisData[0].id) : "");
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("Unable to load competitor analyses. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPageData();
  }, [router]);

  async function handleGenerateCompetitorAnalysis() {
    if (!selectedAnalysisId) {
      return;
    }

    setError("");

    try {
      setIsGenerating(true);
      const competitor = await apiRequest<GeneratedResponse>(`/competitors/analyze/${selectedAnalysisId}`, {
        method: "POST",
      });
      router.push(`/dashboard/competitors/${competitor.id}`);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("We could not generate competitor insights right now. Please try again shortly.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this competitor analysis?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      await apiRequest<{ message: string }>(`/competitors/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This competitor analysis could not be deleted right now. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Competitor Research
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Compare market alternatives, positioning, strengths, and competitive gaps before launching your startup.
            </p>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <section className="animate-fade-up hover-lift mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-8">
            <h2 className="text-2xl font-bold tracking-[-0.035em]">Generate competitor analysis</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Select one of your saved startup analyses to generate market and competitor insights.
            </p>

            {!isLoading && analyses.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-sm text-[var(--muted)]">Create an analysis first before generating this document.</p>
                <Link href="/dashboard/new-analysis" className="btn-primary mt-5">
                  New Idea Analysis
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)]" htmlFor="competitor-analysis">
                    Saved analysis
                  </label>
                  <select
                    id="competitor-analysis"
                    value={selectedAnalysisId}
                    onChange={(event) => setSelectedAnalysisId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
                    disabled={isLoading || analyses.length === 0}
                  >
                    {analyses.map((analysis) => (
                      <option key={analysis.id} value={analysis.id}>
                        {getAnalysisLabel(analysis)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn-primary w-full disabled:pointer-events-none disabled:opacity-60 lg:w-fit"
                  onClick={handleGenerateCompetitorAnalysis}
                  disabled={isLoading || isGenerating || !selectedAnalysisId}
                >
                  {isGenerating ? "Analyzing competitors..." : "Generate Analysis"}
                </button>
              </div>
            )}
          </section>

          {isLoading ? <SkeletonCards /> : null}

          {!isLoading && items.length === 0 ? (
            <div className="animate-fade-up hover-lift mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-9 text-center shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold tracking-[-0.035em]">No competitor analyses generated yet.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Generate competitor research from a saved analysis above to compare alternatives and positioning.
              </p>
              <Link href="/dashboard/analyses" className="btn-secondary mt-7">
                View saved analyses
              </Link>
            </div>
          ) : null}

          {!isLoading && items.length > 0 ? (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {items.map((competitor) => {
                const title = competitor.startup_name || analysisNames.get(competitor.analysis_id) || `Competitor Research #${competitor.id}`;
                const preview =
                  competitor.differentiation_strategy ||
                  competitor.market_gap ||
                  competitor.recommendations ||
                  "Open this competitor analysis to review market positioning and strategic recommendations.";

                return (
                  <article
                    key={competitor.id}
                    className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.22)] ${
                      deletingId === competitor.id ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                      <span className="rounded-full border border-[rgba(212,175,55,0.16)] px-3 py-1 text-[var(--accent)]">
                        Competitors
                      </span>
                      <span>{formatDate(competitor.created_at)}</span>
                      <span>Analysis #{competitor.analysis_id}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em]">{title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                      {preview}
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link href={`/dashboard/competitors/${competitor.id}`} className="btn-secondary px-5 py-2.5">
                        Open
                      </Link>
                      <button
                        type="button"
                        className="btn-secondary px-5 py-2.5 text-red-100 hover:border-red-400/30"
                        onClick={() => handleDelete(competitor.id)}
                        disabled={deletingId === competitor.id}
                      >
                        {deletingId === competitor.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}








