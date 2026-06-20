"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { PdfExportButton } from "../../../components/PdfExportButton";
import { apiRequest, isUnauthorizedError } from "../../../../lib/api";
import { hasStoredUserToken, logoutUser } from "../../../../lib/auth";

type MVPPlan = {
  id: number;
  analysis_id: number;
  mvp_summary?: string | null;
  core_features?: string[] | string | null;
  excluded_features?: string[] | string | null;
  recommended_tech_stack?: string[] | string | null;
  development_phases?: string[] | string | null;
  timeline?: string | null;
  required_team?: string[] | string | null;
  budget_considerations?: string | null;
  launch_checklist?: string[] | string | null;
  success_metrics?: string[] | string | null;
  created_at: string;
};

type ListSection = {
  title: string;
  field:
    | "core_features"
    | "excluded_features"
    | "recommended_tech_stack"
    | "development_phases"
    | "required_team"
    | "launch_checklist"
    | "success_metrics";
};

const listSections: ListSection[] = [
  { title: "Core Features", field: "core_features" },
  { title: "Excluded Features", field: "excluded_features" },
  { title: "Recommended Tech Stack", field: "recommended_tech_stack" },
  { title: "Development Phases", field: "development_phases" },
  { title: "Required Team", field: "required_team" },
  { title: "Launch Checklist", field: "launch_checklist" },
  { title: "Success Metrics", field: "success_metrics" },
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

function TextSection({ title, text }: { title: string; text?: string | null }) {
  if (!text) {
    return null;
  }

  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
      <h2 className="text-xl font-bold tracking-[-0.03em]">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
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

function ListSectionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
      <h2 className="text-xl font-bold tracking-[-0.03em]">{title}</h2>
      <div className="mt-5">
        <BulletList items={items} />
      </div>
    </article>
  );
}

export default function MVPDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<MVPPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadPlan() {
      if (!hasStoredUserToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<MVPPlan>(`/mvp/${params.id}`);
        setPlan(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("Unable to load this MVP plan. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlan();
  }, [params.id, router]);

  async function handleDelete() {
    if (!plan) {
      return;
    }

    const confirmed = window.confirm("Delete this MVP plan?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest<{ message: string }>(`/mvp/${plan.id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/mvp");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This MVP plan could not be deleted right now. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <Link href="/dashboard/mvp" className="nav-link text-sm">
            Back to MVP plans
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

          {plan ? (
            <div className="mt-8 animate-[fadeUp_220ms_ease-out_forwards]">
              <div className="flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl shadow-black/30 sm:p-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    MVP Planner
                  </p>
                  <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                    MVP Plan #{plan.id}
                  </h1>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>Linked analysis #{plan.analysis_id}</span>
                    <span className="text-white/20">|</span>
                    <span>{formatDate(plan.created_at)}</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-fit">
                  <PdfExportButton
                    endpoint={`/exports/mvp/${plan.id}/pdf`}
                    filename={`launchmind-mvp-${plan.id}.pdf`}
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
                <TextSection title="MVP Summary" text={plan.mvp_summary} />
                <TextSection title="Timeline" text={plan.timeline} />
                <TextSection title="Budget Considerations" text={plan.budget_considerations} />
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {listSections.map((section) => (
                  <ListSectionCard
                    key={section.field}
                    title={section.title}
                    items={toList(plan[section.field])}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}









