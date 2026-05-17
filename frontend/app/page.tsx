import Link from "next/link";
import { Navbar } from "./components/Navbar";

const features = [
  {
    title: "Idea Analyzer",
    label: "Analysis",
    description:
      "Turn rough notes into a structured review of the idea, audience, risks, and early feasibility.",
  },
  {
    title: "Feasibility Reports",
    label: "Report",
    description:
      "Generate formal business reports with practical market, technical, financial, and legal sections.",
  },
  {
    title: "Pitch Deck Generator",
    label: "Strategy",
    description:
      "Prepare concise pitch content that explains the problem, solution, market, model, and roadmap.",
  },
  {
    title: "SWOT Analysis",
    label: "Analysis",
    description:
      "Map strengths, weaknesses, opportunities, and threats in a clear decision-making format.",
  },
  {
    title: "Competitor Research",
    label: "Strategy",
    description:
      "Compare realistic alternatives, identify gaps, and clarify how the idea could be positioned.",
  },
  {
    title: "MVP Planner",
    label: "Planning",
    description:
      "Define the first usable version, core features, excluded features, team needs, and rollout steps.",
  },
];

function HeroSection() {
  return (
    <section className="px-4 py-24 sm:py-32">
      <div className="container-page text-center">
        <div
          className="animate-fade-up mx-auto mb-7 w-fit rounded-full border border-[rgba(212,175,55,0.18)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--accent)]"
          style={{ animationDelay: "0ms" }}
        >
          Built for founders, students, and early teams
        </div>

        <h1
          className="animate-fade-up mx-auto max-w-5xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-[var(--text)] sm:text-6xl lg:text-[5.25rem]"
          style={{ animationDelay: "80ms" }}
        >
          Turn raw ideas into startup-ready plans.
        </h1>

        <p
          className="animate-fade-up mx-auto mt-7 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8"
          style={{ animationDelay: "120ms" }}
        >
          LaunchMind AI helps you analyze ideas, generate feasibility reports,
          prepare pitch decks, compare competitors, build SWOT analysis, and plan
          your MVP from one workspace.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "160ms" }}
        >
          <Link href="/register" className="btn-primary w-full sm:w-auto">
            Get Started
          </Link>
          <Link href="/features" className="btn-secondary w-full sm:w-auto">
            Explore Features
          </Link>
        </div>

        <div
          className="animate-fade-scale mx-auto mt-20 max-w-[1100px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-left shadow-2xl shadow-black/35"
          style={{ animationDelay: "220ms" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">
                Startup Workspace
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Idea validation draft
              </p>
            </div>
            <span className="rounded-full border border-[rgba(212,175,55,0.18)] px-3 py-1 text-xs text-[var(--accent)]">
              Planning mode
            </span>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-[var(--border)] p-6 sm:p-8 md:border-b-0 md:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Raw Idea
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[var(--text)]">
                Campus budgeting assistant
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
                A simple tool that helps university students track spending,
                plan monthly budgets, and understand where their money goes.
              </p>

              <div className="mt-7 space-y-3">
                <div className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-medium text-[var(--muted)]">Audience</p>
                  <p className="mt-1 text-sm text-[var(--text)]">
                    Students managing limited monthly income
                  </p>
                </div>
                <div className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-medium text-[var(--muted)]">Concern</p>
                  <p className="mt-1 text-sm text-[var(--text)]">
                    Needs validation through interviews and a small pilot
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Generated Strategy
              </p>
              <div className="mt-4 space-y-4">
                {[
                  ["Feasibility Report", "Demand may exist, but adoption should be tested with a small group before building advanced features."],
                  ["MVP Plan", "Start with expense entry, budget goals, and weekly spending summaries. Leave bank integrations for later."],
                  ["Pitch Direction", "Position the product as a practical finance habit tool for students, not a broad personal finance platform."],
                ].map(([title, copy], index) => (
                  <div
                    key={title}
                    className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                    style={{ animationDelay: `${260 + index * 40}ms` }}
                  >
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-4 pb-28 pt-6 sm:pb-32">
      <div className="container-page">
        <div className="animate-fade-up max-w-2xl" style={{ animationDelay: "80ms" }}>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Product features
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
            Tools for early startup planning
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Structured outputs for founders who need clear decisions, not noisy
            documents.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
              style={{ animationDelay: `${120 + index * 40}ms` }}
            >
              <span className="rounded-full border border-[rgba(212,175,55,0.16)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                {feature.label}
              </span>
              <h3 className="mt-6 text-lg font-bold tracking-[-0.02em] text-[var(--text)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-4 pb-28">
      <div className="animate-fade-up hover-lift container-page rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 text-center shadow-xl shadow-black/20 sm:p-10">
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
          Ready to build your startup idea?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          Start with one idea and turn it into structured planning documents from a single workspace.
        </p>
        <Link href="/register" className="btn-primary mt-8">
          Start Free
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  );
}

