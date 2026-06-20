"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { apiRequest, isUnauthorizedError } from "../../../lib/api";
import { hasStoredUserToken, logoutUser } from "../../../lib/auth";

type AnalysisOption = {
  id: number;
  startup_names?: string[];
  one_line_pitch: string;
};

type SWOTAnalysis = {
  id: number;
  analysis_id: number;
  startup_name?: string | null;
  strategic_recommendations?: string[] | string | null;
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

function toList(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}

function getTitle(swot: SWOTAnalysis) {
  return swot.startup_name || `SWOT Analysis #${swot.id}`;
}

function getAnalysisLabel(analysis: AnalysisOption) {
  return analysis.startup_names?.[0] || analysis.one_line_pitch || `Analysis #${analysis.id}`;
}

function SkeletonCards() {
  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-2">
      {["one", "two", "three", "four"].map((item) => (
        <div key={item} className="h-60 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="mt-6 h-7 w-64 rounded-full bg-white/10" />
          <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-5/6 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function SWOTListPage() {
  const router = useRouter();
  const [items, setItems] = useState<SWOTAnalysis[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisOption[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadPageData() {
      if (!hasStoredUserToken()) {
        router.push("/login");
        return;
      }

      try {
        const [swotData, analysisData] = await Promise.all([
          apiRequest<SWOTAnalysis[]>("/swot"),
          apiRequest<AnalysisOption[]>("/analyses"),
        ]);
        setItems(swotData);
        setAnalyses(analysisData);
        setSelectedAnalysisId(analysisData[0]?.id ? String(analysisData[0].id) : "");
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("Unable to load SWOT analyses. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPageData();
  }, [router]);

  async function handleGenerateSwot() {
    if (!selectedAnalysisId) {
      return;
    }

    setError("");

    try {
      setIsGenerating(true);
      const swot = await apiRequest<GeneratedResponse>(`/swot/generate/${selectedAnalysisId}`, {
        method: "POST",
      });
      router.push(`/dashboard/swot/${swot.id}`);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("We could not generate the SWOT analysis right now. Please try again shortly.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this SWOT analysis?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      await apiRequest<{ message: string }>(`/swot/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This SWOT analysis could not be deleted right now. Please try again.");
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
              SWOT analyses
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Generate and manage strengths, weaknesses, opportunities, and threats for saved startup ideas.
            </p>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <section className="animate-fade-up hover-lift mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-8">
            <h2 className="text-2xl font-bold tracking-[-0.035em]">Generate SWOT analysis</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Select a saved analysis and create a practical SWOT review.
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
                  <label className="block text-sm font-semibold text-[var(--text)]" htmlFor="swot-analysis">
                    Saved analysis
                  </label>
                  <select
                    id="swot-analysis"
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
                  onClick={handleGenerateSwot}
                  disabled={isLoading || isGenerating || !selectedAnalysisId}
                >
                  {isGenerating ? "Generating SWOT..." : "Generate SWOT"}
                </button>
              </div>
            )}
          </section>

          {isLoading ? <SkeletonCards /> : null}

          {!isLoading && items.length === 0 ? (
            <div className="animate-fade-up hover-lift mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-9 text-center shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold tracking-[-0.035em]">No SWOT analyses yet.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Generate your first SWOT analysis from a saved analysis above.
              </p>
              <Link href="/dashboard/analyses" className="btn-secondary mt-7">
                View saved analyses
              </Link>
            </div>
          ) : null}

          {!isLoading && items.length > 0 ? (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {items.map((swot) => {
                const recommendations = toList(swot.strategic_recommendations);
                const preview = recommendations[0] || "Open this SWOT analysis to review the full strategic recommendations.";

                return (
                  <article
                    key={swot.id}
                    className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.22)] ${
                      deletingId === swot.id ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                      <span className="rounded-full border border-[rgba(212,175,55,0.16)] px-3 py-1 text-[var(--accent)]">
                        SWOT
                      </span>
                      <span>{formatDate(swot.created_at)}</span>
                      <span>Analysis #{swot.analysis_id}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em]">{getTitle(swot)}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                      {preview}
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link href={`/dashboard/swot/${swot.id}`} className="btn-secondary px-5 py-2.5">
                        Open
                      </Link>
                      <button
                        type="button"
                        className="btn-secondary px-5 py-2.5 text-red-100 hover:border-red-400/30"
                        onClick={() => handleDelete(swot.id)}
                        disabled={deletingId === swot.id}
                      >
                        {deletingId === swot.id ? "Deleting..." : "Delete"}
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








