import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { breadcrumbSchema } from "../../lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "LaunchMind AI Features | Startup Reports, SWOT, MVP and Pitch Tools",
  description:
    "Explore LaunchMind AI features for idea analysis, feasibility reports, pitch decks, SWOT analysis, competitor research, and MVP planning.",
  path: "/features",
  keywords: ["LaunchMind AI features", "AI startup tools", "SWOT generator", "pitch deck generator"],
});

const detailedFeatures = [
  {
    title: "Idea Analyzer",
    label: "Analysis",
    description:
      "Convert an early idea into a structured review covering the problem, audience, feasibility, and practical risks.",
  },
  {
    title: "Feasibility Reports",
    label: "Report",
    description:
      "Prepare formal reports with market, technical, financial, operational, and legal sections for clearer planning.",
  },
  {
    title: "Pitch Deck Generator",
    label: "Presentation",
    description:
      "Create concise pitch content that explains the problem, solution, business model, roadmap, and next steps.",
  },
  {
    title: "SWOT Analysis",
    label: "Strategy",
    description:
      "Organize strengths, weaknesses, opportunities, and threats so the idea can be judged with more discipline.",
  },
  {
    title: "Competitor Research",
    label: "Research",
    description:
      "Compare direct and indirect alternatives, identify gaps, and shape a realistic positioning strategy.",
  },
  {
    title: "MVP Planner",
    label: "Planning",
    description:
      "Define a first usable version with core features, excluded features, team needs, and a phased launch path.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Features
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Practical tools for shaping startup ideas.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              LaunchMind AI helps early teams move from scattered notes to usable planning documents without losing clarity or realism.
            </p>
            <Link href="/register" className="btn-primary mt-8">
              Start free
            </Link>
            <Link href="/ai-tools" className="btn-secondary mt-4 sm:ml-3">
              View AI tools
            </Link>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {detailedFeatures.map((feature) => (
              <article
                key={feature.title}
                className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.22)]"
              >
                <span className="rounded-full border border-[rgba(212,175,55,0.16)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                  {feature.label}
                </span>
                <h2 className="mt-6 text-xl font-bold tracking-[-0.025em]">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}





