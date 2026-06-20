"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { PdfExportButton } from "../../../components/PdfExportButton";
import { apiRequest, isUnauthorizedError } from "../../../../lib/api";
import { hasStoredUserToken, logoutUser } from "../../../../lib/auth";

type SWOTAnalysis = {
  id: number;
  analysis_id: number;
  startup_name?: string | null;
  strengths?: string[] | string | null;
  weaknesses?: string[] | string | null;
  opportunities?: string[] | string | null;
  threats?: string[] | string | null;
  strategic_recommendations?: string[] | string | null;
  created_at: string;
};

type Quadrant = {
  title: string;
  field: "strengths" | "weaknesses" | "opportunities" | "threats";
  accent: string;
};

const quadrants: Quadrant[] = [
  { title: "Strengths", field: "strengths", accent: "bg-emerald-400" },
  { title: "Weaknesses", field: "weaknesses", accent: "bg-amber-400" },
  { title: "Opportunities", field: "opportunities", accent: "bg-[var(--accent)]" },
  { title: "Threats", field: "threats", accent: "bg-red-400" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
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

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No items available.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function QuadrantCard({ quadrant, swot }: { quadrant: Quadrant; swot: SWOTAnalysis }) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${quadrant.accent}`} />
        <h2 className="text-xl font-bold tracking-[-0.03em]">{quadrant.title}</h2>
      </div>
      <div className="mt-5">
        <BulletList items={toList(swot[quadrant.field])} />
      </div>
    </article>
  );
}

export default function SWOTDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [swot, setSwot] = useState<SWOTAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadSwot() {
      if (!hasStoredUserToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<SWOTAnalysis>(`/swot/${params.id}`);
        setSwot(data);
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

    loadSwot();
  }, [params.id, router]);

  async function handleDelete() {
    if (!swot) {
      return;
    }

    const confirmed = window.confirm("Delete this SWOT analysis?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest<{ message: string }>(`/swot/${swot.id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/swot");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This SWOT analysis could not be deleted right now. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <Link href="/dashboard/swot" className="nav-link text-sm">
            Back to SWOT analyses
          </Link>

          {isLoading ? (
            <div className="animate-fade-up hover-lift mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 shadow-xl shadow-black/20">
              <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="mt-8 h-10 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="h-48 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-48 animate-pulse rounded-2xl bg-white/10" />
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {swot ? (
            <div className="mt-8 animate-[fadeUp_220ms_ease-out_forwards]">
              <div className="flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl shadow-black/30 sm:p-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    SWOT Analysis
                  </p>
                  <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                    SWOT Analysis
                  </h1>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>Linked analysis #{swot.analysis_id}</span>
                    <span>|</span>
                    <span>{formatDate(swot.created_at)}</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-fit">
                  <PdfExportButton
                    endpoint={`/exports/swot/${swot.id}/pdf`}
                    filename={`launchmind-swot-${swot.id}.pdf`}
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

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {quadrants.map((quadrant) => (
                  <QuadrantCard key={quadrant.field} quadrant={quadrant} swot={swot} />
                ))}
              </div>

              <article className="animate-fade-up hover-lift mt-5 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <h2 className="text-2xl font-bold tracking-[-0.035em]">
                    Strategic Recommendations
                  </h2>
                </div>
                <div className="mt-5">
                  <BulletList items={toList(swot.strategic_recommendations)} />
                </div>
              </article>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}









