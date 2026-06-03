"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { apiRequest, isUnauthorizedError } from "../../../lib/api";
import { getToken, logoutUser } from "../../../lib/auth";

type Analysis = {
  id: number;
  idea: string;
  industry: string | null;
  target_audience: string | null;
  startup_names: string[];
  one_line_pitch: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getStartupName(analysis: Analysis) {
  return analysis.startup_names?.[0] || "Untitled analysis";
}

function SkeletonCards() {
  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-2">
      {["one", "two", "three", "four"].map((item) => (
        <div
          key={item}
          className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7"
        >
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="mt-6 h-6 w-56 rounded-full bg-white/10" />
          <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-4/5 rounded-full bg-white/10" />
          <div className="mt-8 h-10 w-36 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadAnalyses() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<Analysis[]>("/analyses");
        setAnalyses(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("Saved analyses could not be loaded right now. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalyses();
  }, [router]);

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      await apiRequest<{ message: string }>(`/analyses/${id}`, {
        method: "DELETE",
      });
      setAnalyses((current) => current.filter((analysis) => analysis.id !== id));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This analysis could not be deleted right now. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                Saved analyses
              </h1>
              <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
                Review previous startup idea analyses and continue planning from the strongest direction.
              </p>
            </div>
            <Link href="/dashboard/new-analysis" className="btn-primary w-full sm:w-fit">
              New analysis
            </Link>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {isLoading ? <SkeletonCards /> : null}

          {!isLoading && analyses.length === 0 ? (
            <div className="animate-fade-up hover-lift mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-9 text-center shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold tracking-[-0.035em]">No analyses yet.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Start with a raw idea and LaunchMind will save the structured analysis here for future review.
              </p>
              <Link href="/dashboard/new-analysis" className="btn-primary mt-7">
                Analyze an idea
              </Link>
            </div>
          ) : null}

          {!isLoading && analyses.length > 0 ? (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {analyses.map((analysis) => (
                <article
                  key={analysis.id}
                  className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.22)] ${
                    deletingId === analysis.id ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="rounded-full border border-[rgba(212,175,55,0.16)] px-3 py-1 text-[var(--accent)]">
                      {analysis.industry || "General"}
                    </span>
                    <span>{formatDate(analysis.created_at)}</span>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em] text-[var(--text)]">
                    {getStartupName(analysis)}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {analysis.one_line_pitch}
                  </p>

                  <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Target audience
                    </p>
                    <p className="mt-2 text-sm text-[var(--text)]">
                      {analysis.target_audience || "Not specified"}
                    </p>
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/dashboard/analyses/${analysis.id}`}
                      className="btn-secondary px-5 py-2.5"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="btn-secondary px-5 py-2.5 text-red-100 hover:border-red-400/30"
                      onClick={() => handleDelete(analysis.id)}
                      disabled={deletingId === analysis.id}
                    >
                      {deletingId === analysis.id ? "Deleting..." : "Delete"}
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







