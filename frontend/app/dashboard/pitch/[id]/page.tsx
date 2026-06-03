"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Navbar is provided globally in layout
import { PdfExportButton } from "../../../components/PdfExportButton";
import { apiRequest, isUnauthorizedError } from "../../../../lib/api";
import { getToken, logoutUser } from "../../../../lib/auth";

type PitchDeck = {
  id: number;
  analysis_id: number;
  startup_name: string;
  elevator_pitch: string;
  problem: string;
  solution: string;
  target_market: string;
  business_model: string;
  competitor_landscape: string;
  go_to_market_strategy: string;
  revenue_model: string;
  mvp_summary: string;
  traction_strategy: string;
  funding_needs: string;
  future_roadmap: string;
  closing_statement: string;
  created_at: string;
};

const pitchSections = [
  { title: "Elevator Pitch", key: "elevator_pitch" },
  { title: "Problem", key: "problem" },
  { title: "Solution", key: "solution" },
  { title: "Target Market", key: "target_market" },
  { title: "Business Model", key: "business_model" },
  { title: "Competitor Landscape", key: "competitor_landscape" },
  { title: "Go To Market Strategy", key: "go_to_market_strategy" },
  { title: "Revenue Model", key: "revenue_model" },
  { title: "MVP Summary", key: "mvp_summary" },
  { title: "Traction Strategy", key: "traction_strategy" },
  { title: "Funding Needs", key: "funding_needs" },
  { title: "Future Roadmap", key: "future_roadmap" },
  { title: "Closing Statement", key: "closing_statement" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function SlideCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        {title}
      </p>
      <p className="mt-4 text-base leading-7 text-[var(--text)]">{text}</p>
    </article>
  );
}

export default function PitchDeckDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadPitchDeck() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<PitchDeck>(`/pitch/${params.id}`);
        setPitchDeck(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setError("This pitch deck could not be loaded right now. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPitchDeck();
  }, [params.id, router]);

  async function handleDelete() {
    if (!pitchDeck) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest<{ message: string }>(`/pitch/${pitchDeck.id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/pitch");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        logoutUser();
        router.push("/login");
        return;
      }

      setError("This pitch deck could not be deleted right now. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <Link href="/dashboard/pitch" className="nav-link text-sm">
            Back to pitch decks
          </Link>

          {isLoading ? (
            <div className="animate-fade-up hover-lift mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 shadow-xl shadow-black/20">
              <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="mt-8 h-10 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-8 space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {pitchDeck ? (
            <div className="mt-8 animate-[fadeUp_220ms_ease-out_forwards]">
              <div className="flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl shadow-black/30 sm:p-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Pitch Deck
                  </p>
                  <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                    {pitchDeck.startup_name}
                  </h1>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>{formatDate(pitchDeck.created_at)}</span>
                    <span>|</span>
                    <span>Linked analysis #{pitchDeck.analysis_id}</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-fit">
                  <PdfExportButton
                    endpoint={`/exports/pitch/${pitchDeck.id}/pdf`}
                    filename={`launchmind-pitch-${pitchDeck.id}.pdf`}
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
                {pitchSections.map((section) => (
                  <SlideCard
                    key={section.key}
                    title={section.title}
                    text={pitchDeck[section.key]}
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









