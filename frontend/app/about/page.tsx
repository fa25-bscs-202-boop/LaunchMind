import Link from "next/link";
import { Navbar } from "../components/Navbar";

export default function AboutPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              About
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Built for clearer startup thinking.
            </h1>
            <Link href="/register" className="btn-primary mt-8">
              Create your workspace
            </Link>
          </div>

          <div className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-9">
            <p className="text-lg leading-8 text-[var(--text)]">
              LaunchMind AI helps students, founders, and freelancers turn raw ideas into structured startup plans.
            </p>
            <p className="mt-6 text-base leading-7 text-[var(--muted)]">
              The product is designed for early planning work: feasibility reports, pitch content, competitor research, SWOT analysis, and MVP planning. The goal is to make idea validation more practical, organized, and presentation-ready.
            </p>
            <p className="mt-6 text-base leading-7 text-[var(--muted)]">
              Instead of pushing exaggerated claims, LaunchMind AI focuses on useful questions, realistic next steps, and documents that can support class projects, early founder decisions, and freelance product planning.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}






