"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { apiRequest, isUnauthorizedError } from "../../../lib/api";
import { getToken, logoutUser } from "../../../lib/auth";

type AnalysisOption = {
  id: number;
  startup_names?: string[];
  one_line_pitch: string;
};

type PitchDeck = {
  id: number;
  analysis_id: number;
  startup_name: string;
  elevator_pitch: string;
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
        <div key={item} className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="mt-6 h-7 w-64 rounded-full bg-white/10" />
          <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-5/6 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function PitchDecksPage() {
  const router = useRouter();
  const [pitchDecks, setPitchDecks] = useState<PitchDeck[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisOption[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadPageData() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const [pitchData, analysisData] = await Promise.all([
          apiRequest<PitchDeck[]>("/pitch"),
          apiRequest<AnalysisOption[]>("/analyses"),
        ]);
        setPitchDecks(pitchData);
        setAnalyses(analysisData);
        setSelectedAnalysisId(analysisData[0]?.id ? String(analysisData[0].id) : "");
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("Pitch decks could not be loaded right now. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPageData();
  }, [router]);

  async function handleGeneratePitch() {
    if (!selectedAnalysisId) {
      return;
    }

    setError("");

    try {
      setIsGenerating(true);
      const pitchDeck = await apiRequest<GeneratedResponse>(`/pitch/generate/${selectedAnalysisId}`, {
        method: "POST",
      });
      router.push(`/dashboard/pitch/${pitchDeck.id}`);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("We could not generate the pitch deck right now. Please try again shortly.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      await apiRequest<{ message: string }>(`/pitch/${id}`, { method: "DELETE" });
      setPitchDecks((current) => current.filter((deck) => deck.id !== id));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This pitch deck could not be deleted right now. Please try again.");
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
              Pitch decks
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Generate and manage investor-style presentation drafts from saved analyses.
            </p>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <section className="animate-fade-up hover-lift mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-8">
            <h2 className="text-2xl font-bold tracking-[-0.035em]">Generate pitch deck</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Select a saved analysis and create a concise investor-style pitch deck.
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
                  <label className="block text-sm font-semibold text-[var(--text)]" htmlFor="pitch-analysis">
                    Saved analysis
                  </label>
                  <select
                    id="pitch-analysis"
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
                  onClick={handleGeneratePitch}
                  disabled={isLoading || isGenerating || !selectedAnalysisId}
                >
                  {isGenerating ? "Generating pitch deck..." : "Generate pitch deck"}
                </button>
              </div>
            )}
          </section>

          {isLoading ? <SkeletonCards /> : null}

          {!isLoading && pitchDecks.length === 0 ? (
            <div className="animate-fade-up hover-lift mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-9 text-center shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold tracking-[-0.035em]">No pitch decks yet.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Generate your first pitch deck from a saved analysis above.
              </p>
              <Link href="/dashboard/analyses" className="btn-secondary mt-7">
                View saved analyses
              </Link>
            </div>
          ) : null}

          {!isLoading && pitchDecks.length > 0 ? (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {pitchDecks.map((deck) => (
                <article
                  key={deck.id}
                  className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.22)] ${
                    deletingId === deck.id ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="rounded-full border border-[rgba(212,175,55,0.16)] px-3 py-1 text-[var(--accent)]">
                      Pitch Deck
                    </span>
                    <span>{formatDate(deck.created_at)}</span>
                    <span>Analysis #{deck.analysis_id}</span>
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em]">{deck.startup_name}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                    {deck.elevator_pitch}
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link href={`/dashboard/pitch/${deck.id}`} className="btn-secondary px-5 py-2.5">
                      Open
                    </Link>
                    <button
                      type="button"
                      className="btn-secondary px-5 py-2.5 text-red-100 hover:border-red-400/30"
                      onClick={() => handleDelete(deck.id)}
                      disabled={deletingId === deck.id}
                    >
                      {deletingId === deck.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}








