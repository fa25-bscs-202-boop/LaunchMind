"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { PdfExportButton } from "../../../components/PdfExportButton";
import { apiRequest, isUnauthorizedError } from "../../../../lib/api";
import { getToken, logoutUser } from "../../../../lib/auth";

type Analysis = {
  id: number;
  industry: string | null;
  target_audience: string | null;
  startup_names: string[];
  one_line_pitch: string;
  problem_statement: string;
  proposed_solution: string;
  target_market: string;
  market_feasibility: string;
  technical_feasibility: string;
  financial_feasibility: string;
  operational_feasibility?: string;
  legal_feasibility?: string;
  risk_assessment: string[];
  revenue_model: string[];
  launch_roadmap: string[];
  final_recommendation: string;
  created_at: string;
};

type GeneratedItemResponse = {
  id: number;
};

const textSections = [
  { title: "Problem", key: "problem_statement" },
  { title: "Solution", key: "proposed_solution" },
  { title: "Target Market", key: "target_market" },
  { title: "Market Feasibility", key: "market_feasibility" },
  { title: "Technical Feasibility", key: "technical_feasibility" },
  { title: "Financial Feasibility", key: "financial_feasibility" },
  { title: "Operational Feasibility", key: "operational_feasibility" },
  { title: "Legal Feasibility", key: "legal_feasibility" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatRoadmapItem(item: string) {
  const withoutStepLabel = item.replace(/^Step\s*\d+\s*:\s*/i, "");

  return withoutStepLabel.replace(/^(Month\s+\d+(?:-\d+)?):\s*/i, "$1 — ");
}

function TextCard({ title, text }: { title: string; text?: string }) {
  if (!text) {
    return null;
  }

  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
      <h2 className="text-lg font-bold tracking-[-0.025em] text-[var(--text)]">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
    </article>
  );
}

function ListCard({
  title,
  items,
  timeline = false,
}: {
  title: string;
  items: string[];
  timeline?: boolean;
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
      <h2 className="text-lg font-bold tracking-[-0.025em] text-[var(--text)]">{title}</h2>
      <ul className="mt-5 space-y-3">
        {safeItems.length > 0 ? (
          safeItems.map((item) => (
            <li
              key={`${title}-${item}`}
              className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{timeline ? formatRoadmapItem(item) : item}</span>
            </li>
          ))
        ) : (
          <li className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
            No items available.
          </li>
        )}
      </ul>
    </article>
  );
}

function ActionCard({
  title,
  description,
  buttonText,
  loadingText,
  isLoading,
  onClick,
}: {
  title: string;
  description: string;
  buttonText: string;
  loadingText: string;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.24)]">
      <h3 className="text-base font-bold tracking-[-0.02em] text-[var(--text)]">{title}</h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">{description}</p>
      <button
        type="button"
        className="mt-6 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#080808] transition hover:translate-y-[-1px] hover:bg-[#e1bf4c] disabled:pointer-events-none disabled:opacity-60"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? loadingText : buttonText}
      </button>
    </article>
  );
}

export default function AnalysisDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [isGeneratingSwot, setIsGeneratingSwot] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<Analysis>(`/analyses/${params.id}`);
        setAnalysis(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("This analysis could not be loaded right now. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalysis();
  }, [params.id, router]);

  async function handleGenerateReport() {
    if (!analysis) {
      return;
    }

    try {
      setError("");
      setIsGeneratingReport(true);
      const report = await apiRequest<GeneratedItemResponse>(`/reports/generate/${analysis.id}`, {
        method: "POST",
      });
      router.push(`/dashboard/reports/${report.id}`);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("We could not generate the report right now. Please try again shortly.");
      setIsGeneratingReport(false);
    }
  }

  async function handleGeneratePitchDeck() {
    if (!analysis) {
      return;
    }

    try {
      setError("");
      setIsGeneratingPitch(true);
      const pitchDeck = await apiRequest<GeneratedItemResponse>(`/pitch/generate/${analysis.id}`, {
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
      setIsGeneratingPitch(false);
    }
  }

  async function handleGenerateSwot() {
    if (!analysis) {
      return;
    }

    try {
      setError("");
      setIsGeneratingSwot(true);
      const swot = await apiRequest<GeneratedItemResponse>(`/swot/generate/${analysis.id}`, {
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
      setIsGeneratingSwot(false);
    }
  }

  async function handleDelete() {
    if (!analysis) {
      return;
    }

    const confirmed = window.confirm("Delete this analysis?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest<{ message: string }>(`/analyses/${analysis.id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/analyses");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This analysis could not be deleted right now. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <Link href="/dashboard/analyses" className="nav-link text-sm">
            Back to analyses
          </Link>

          {isLoading ? (
            <div className="animate-fade-up hover-lift mt-10 max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 shadow-xl shadow-black/20">
              <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="mt-7 h-11 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-white/10" />
              <div className="mt-3 h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
            </div>
          ) : null}

          {error ? (
            <div className="mt-8 max-w-4xl rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              {error}
            </div>
          ) : null}

          {analysis ? (
            <div className="mt-10 animate-[fadeUp_220ms_ease-out_forwards]">
              <div className="max-w-4xl">
                <div className="flex flex-wrap gap-3">
                  {(analysis.startup_names || []).map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-[rgba(212,175,55,0.22)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>

                <h1 className="mt-7 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                  Startup analysis
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text)]">
                  {analysis.one_line_pitch}
                </p>
                <div className="mt-7 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                  <span>{analysis.industry || "General industry"}</span>
                  <span className="text-white/20">|</span>
                  <span>{analysis.target_audience || "Audience not specified"}</span>
                  <span className="text-white/20">|</span>
                  <span>{formatDate(analysis.created_at)}</span>
                </div>
                <div className="mt-7">
                  <PdfExportButton
                    endpoint={`/exports/analysis/${analysis.id}/pdf`}
                    filename={`launchmind-analysis-${analysis.id}.pdf`}
                  />
                </div>
              </div>

              <div className="mt-14 grid gap-6 lg:grid-cols-2">
                {textSections.map((section) => (
                  <TextCard
                    key={section.key}
                    title={section.title}
                    text={analysis[section.key]}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <ListCard title="Risk Assessment" items={analysis.risk_assessment || []} />
                <ListCard title="Revenue Model" items={analysis.revenue_model || []} />
                <ListCard title="Launch Roadmap" items={analysis.launch_roadmap || []} timeline />
              </div>

              <section className="animate-fade-up hover-lift mt-6 max-w-4xl rounded-2xl border border-[rgba(212,175,55,0.24)] bg-[var(--surface)] p-8 shadow-xl shadow-black/25">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Final Recommendation
                </h2>
                <p className="mt-5 text-base leading-8 text-[var(--text)]">
                  {analysis.final_recommendation}
                </p>
              </section>

              <section className="mt-14">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold tracking-[-0.035em] text-[var(--text)]">
                    Next actions
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    Turn this analysis into documents and planning tools.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                  <ActionCard
                    title="Feasibility Report"
                    description="Generate a full university-style feasibility report."
                    buttonText="Generate report"
                    loadingText="Generating report..."
                    isLoading={isGeneratingReport}
                    onClick={handleGenerateReport}
                  />
                  <ActionCard
                    title="Pitch Deck"
                    description="Create an investor-style pitch deck from this analysis."
                    buttonText="Generate pitch deck"
                    loadingText="Generating pitch deck..."
                    isLoading={isGeneratingPitch}
                    onClick={handleGeneratePitchDeck}
                  />
                  <ActionCard
                    title="SWOT Analysis"
                    description="Review strengths, weaknesses, opportunities, and threats."
                    buttonText="Generate SWOT"
                    loadingText="Generating SWOT..."
                    isLoading={isGeneratingSwot}
                    onClick={handleGenerateSwot}
                  />
                </div>
              </section>

              <section className="mt-14 max-w-4xl rounded-2xl border border-red-500/20 bg-red-500/5 p-7">
                <h2 className="text-lg font-bold tracking-[-0.025em] text-red-100">Danger zone</h2>
                <p className="mt-3 text-sm leading-6 text-red-100/75">
                  Delete this analysis and its saved record.
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-full border border-red-500/25 px-5 py-2.5 text-sm font-semibold text-red-100 transition hover:border-red-400/45 hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete analysis"}
                </button>
              </section>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}









