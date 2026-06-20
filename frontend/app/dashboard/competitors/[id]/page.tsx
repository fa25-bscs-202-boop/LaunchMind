"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { apiRequest, isUnauthorizedError } from "../../../../lib/api";
import { hasStoredUserToken, logoutUser } from "../../../../lib/auth";

type CompetitorAnalysis = {
  id: number;
  analysis_id: number;
  direct_competitors?: string[] | string | null;
  indirect_competitors?: string[] | string | null;
  competitor_strengths?: string | null;
  competitor_weaknesses?: string | null;
  market_gap?: string | null;
  differentiation_strategy?: string | null;
  pricing_comparison?: string | null;
  recommendations?: string | null;
  created_at: string;
};

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

function getMarketOverview(competitor: CompetitorAnalysis) {
  const directCount = toList(competitor.direct_competitors).length;
  const indirectCount = toList(competitor.indirect_competitors).length;

  if (directCount > 0 || indirectCount > 0) {
    return `This research reviews ${directCount} direct competitor${directCount === 1 ? "" : "s"} and ${indirectCount} indirect alternative${indirectCount === 1 ? "" : "s"}. It focuses on practical positioning, visible market gaps, and realistic ways the startup could stand apart.`;
  }

  return competitor.pricing_comparison || "No market overview available.";
}

function TextSection({ title, text }: { title: string; text?: string | null }) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
      <h2 className="text-xl font-bold tracking-[-0.03em]">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
        {text || "No details available."}
      </p>
    </article>
  );
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
          className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CompetitorGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        {title}
      </h3>
      <div className="mt-4">
        <BulletList items={items} />
      </div>
    </div>
  );
}

function TopCompetitors({ competitor }: { competitor: CompetitorAnalysis }) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 lg:col-span-2">
      <h2 className="text-xl font-bold tracking-[-0.03em]">Top Competitors</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CompetitorGroup title="Direct competitors" items={toList(competitor.direct_competitors)} />
        <CompetitorGroup title="Indirect competitors" items={toList(competitor.indirect_competitors)} />
      </div>
    </article>
  );
}

export default function CompetitorDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [competitor, setCompetitor] = useState<CompetitorAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadCompetitorAnalysis() {
      if (!hasStoredUserToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<CompetitorAnalysis>(`/competitors/${params.id}`);
        setCompetitor(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("Unable to load competitor research. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCompetitorAnalysis();
  }, [params.id, router]);

  async function handleDelete() {
    if (!competitor) {
      return;
    }

    const confirmed = window.confirm("Delete this competitor analysis?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest<{ message: string }>(`/competitors/${competitor.id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/competitors");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This competitor analysis could not be deleted right now. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <Link href="/dashboard/competitors" className="nav-link text-sm">
            Back to competitor analyses
          </Link>

          {isLoading ? (
            <div className="animate-fade-up hover-lift mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 shadow-xl shadow-black/20">
              <div className="h-5 w-48 animate-pulse rounded-full bg-white/10" />
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

          {competitor ? (
            <div className="mt-8 animate-[fadeUp_220ms_ease-out_forwards]">
              <div className="flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl shadow-black/30 sm:p-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Competitor Research
                  </p>
                  <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                    Competitor Research
                  </h1>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>Linked analysis #{competitor.analysis_id}</span>
                    <span className="text-white/20">|</span>
                    <span>{formatDate(competitor.created_at)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-secondary w-full px-5 py-2.5 text-red-100 hover:border-red-400/30 sm:w-fit"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <TextSection title="Market Overview" text={getMarketOverview(competitor)} />
                <TopCompetitors competitor={competitor} />
                <TextSection title="Competitor Strengths" text={competitor.competitor_strengths} />
                <TextSection title="Competitor Weaknesses" text={competitor.competitor_weaknesses} />
                <TextSection title="Market Gaps" text={competitor.market_gap} />
                <TextSection title="Competitive Advantages" text={competitor.differentiation_strategy} />
                <TextSection title="Positioning Strategy" text={competitor.pricing_comparison} />
                <TextSection title="Strategic Recommendation" text={competitor.recommendations} />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}







