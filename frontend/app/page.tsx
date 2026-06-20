import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeStickyNav } from "./components/HomeStickyNav";
import { ScrollRevealActivator } from "./components/ScrollRevealActivator";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "LaunchMind AI | Startup Idea Generator and Planning Workspace",
  description:
    "Generate startup ideas, feasibility reports, pitch decks, SWOT analysis, competitor research, and MVP plans in one LaunchMind AI workspace.",
  path: "/",
  keywords: [
    "LaunchMind AI",
    "startup idea generator",
    "feasibility reports",
    "pitch deck generator",
    "MVP planning",
  ],
});

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
    <section className="px-4 py-20 sm:py-28">
      <div className="container-page text-center">
        <div
          className="scroll-reveal mx-auto mb-7 w-fit rounded-full border border-[rgba(212,175,55,0.18)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--accent)]"
          style={{ transitionDelay: "0ms" }}
        >
          Built for founders, students, and early teams
        </div>

        <h1
          className="scroll-reveal mx-auto max-w-5xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-[var(--text)] sm:text-6xl lg:text-[5.25rem]"
          style={{ transitionDelay: "80ms" }}
        >
          Turn raw ideas into startup-ready plans.
        </h1>

        <p
          className="scroll-reveal mx-auto mt-7 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8"
          style={{ transitionDelay: "120ms" }}
        >
          LaunchMind AI helps you analyze ideas, generate feasibility reports,
          prepare pitch decks, compare competitors, build SWOT analysis, and plan
          your MVP from one workspace.
        </p>

        <div
          className="scroll-reveal mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ transitionDelay: "160ms" }}
        >
          <Link href="/register" className="btn-primary w-full sm:w-auto">
            Get Started
          </Link>
          <Link href="#features" className="btn-secondary w-full sm:w-auto">
            Explore Features
          </Link>
        </div>

        <div
          className="scroll-reveal mx-auto mt-20 max-w-[1100px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-left shadow-2xl shadow-black/35"
          style={{ transitionDelay: "220ms" }}
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
                <div className="scroll-reveal hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-medium text-[var(--muted)]">Audience</p>
                  <p className="mt-1 text-sm text-[var(--text)]">
                    Students managing limited monthly income
                  </p>
                </div>
                <div className="scroll-reveal hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
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
                    className="scroll-reveal hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
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
        <div className="scroll-reveal max-w-2xl" style={{ transitionDelay: "80ms" }}>
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
              className="scroll-reveal hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
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
      <div className="scroll-reveal hover-lift container-page rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 text-center shadow-xl shadow-black/20 sm:p-10">
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
          Ready to build your startup idea?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          Start with one idea and turn it into structured planning documents from a single workspace.
        </p>
        <Link href="/register" className="btn-primary mt-8">
          Start Free
          <ArrowRight className="ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function PageFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-6">
      <div className="container-page flex flex-col items-start gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[var(--text)]">
          <span className="font-medium">Crafted by</span>
          <span className="text-[var(--muted)]">LaunchMind Team</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://www.linkedin.com/in/m-bilal-shah-gillani-3a7980220/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.18)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[rgba(212,175,55,0.35)] hover:bg-[var(--surface)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.7h5V24H0V8.7zm7.35 0H12V11h.07c.63-1.2 2.17-2.46 4.47-2.46 4.78 0 5.66 3.15 5.66 7.25V24h-4.98v-7.9c0-1.88-.03-4.29-2.62-4.29-2.62 0-3.02 2.05-3.02 4.17V24H7.35V8.7z" />
            </svg>
            Bilal Shah
          </a>
          <a
            href="https://www.linkedin.com/in/malik-abdur-rehman-9b4228358/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.18)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[rgba(212,175,55,0.35)] hover:bg-[var(--surface)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.7h5V24H0V8.7zm7.35 0H12V11h.07c.63-1.2 2.17-2.46 4.47-2.46 4.78 0 5.66 3.15 5.66 7.25V24h-4.98v-7.9c0-1.88-.03-4.29-2.62-4.29-2.62 0-3.02 2.05-3.02 4.17V24H7.35V8.7z" />
            </svg>
            Malik Rehman
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <Link href="/privacy-policy" className="nav-link">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="nav-link">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] bg-grid-background">
      <ScrollRevealActivator />
      <HomeStickyNav />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
      <PageFooter />
    </main>
  );
}
