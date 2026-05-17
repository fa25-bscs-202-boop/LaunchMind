"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { PdfExportButton } from "../../../components/PdfExportButton";
import { apiRequest, isUnauthorizedError } from "../../../../lib/api";
import { getToken, logoutUser } from "../../../../lib/auth";

type Report = {
  id: number;
  analysis_id: number;
  title: string;
  executive_summary: string;
  introduction: string;
  problem_statement: string;
  objectives: string;
  scope: string;
  methodology: string;
  market_feasibility: string;
  technical_feasibility: string;
  operational_feasibility: string;
  financial_feasibility: string;
  legal_considerations: string;
  risk_assessment: string;
  findings: string;
  recommendations: string;
  conclusion: string;
  created_at: string;
};

const reportSections = [
  { title: "Executive Summary", key: "executive_summary" },
  { title: "Introduction", key: "introduction" },
  { title: "Problem Statement", key: "problem_statement" },
  { title: "Objectives", key: "objectives" },
  { title: "Scope", key: "scope" },
  { title: "Methodology", key: "methodology" },
  { title: "Market Feasibility", key: "market_feasibility" },
  { title: "Technical Feasibility", key: "technical_feasibility" },
  { title: "Operational Feasibility", key: "operational_feasibility" },
  { title: "Financial Feasibility", key: "financial_feasibility" },
  { title: "Legal Considerations", key: "legal_considerations" },
  { title: "Risk Assessment", key: "risk_assessment" },
  { title: "Findings", key: "findings" },
  { title: "Recommendations", key: "recommendations" },
  { title: "Conclusion", key: "conclusion" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ReportSection({ title, text }: { title: string; text?: string }) {
  if (!text) {
    return null;
  }

  return (
    <section className="border-b border-[var(--border)] py-8 last:border-b-0">
      <h2 className="text-2xl font-bold tracking-[-0.035em] text-[var(--text)]">
        {title}
      </h2>
      <p className="mt-4 whitespace-pre-line text-base leading-8 text-[var(--muted)]">
        {text}
      </p>
    </section>
  );
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<Report>(`/reports/${params.id}`);
        setReport(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("This report could not be loaded right now. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, [params.id, router]);

  async function handleDelete() {
    if (!report) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest<{ message: string }>(`/reports/${report.id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/reports");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This report could not be deleted right now. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <Link href="/dashboard/reports" className="nav-link text-sm">
            Back to reports
          </Link>

          {isLoading ? (
            <div className="animate-fade-up hover-lift mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 shadow-xl shadow-black/20">
              <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="mt-8 h-10 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-8 space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-4/6 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {report ? (
            <article className="mt-8 animate-[fadeUp_220ms_ease-out_forwards] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl shadow-black/30 sm:p-10 lg:p-12">
              <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Feasibility Report
                  </p>
                  <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                    {report.title}
                  </h1>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>{formatDate(report.created_at)}</span>
                    <span>|</span>
                    <span>Linked analysis #{report.analysis_id}</span>
                    <span>|</span>
                    <span>Complete</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-fit">
                  <PdfExportButton
                    endpoint={`/exports/report/${report.id}/pdf`}
                    filename={`launchmind-report-${report.id}.pdf`}
                  />
                  <button
                    type="button"
                    className="btn-secondary w-full px-5 py-2.5 text-red-100 hover:border-red-400/30 sm:w-fit"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="mx-auto max-w-4xl">
                {reportSections.map((section) => (
                  <ReportSection
                    key={section.key}
                    title={section.title}
                    text={report[section.key]}
                  />
                ))}
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </main>
  );
}












