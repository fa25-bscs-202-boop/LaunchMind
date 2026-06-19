import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { toolPages } from "../../lib/seo-content";
import { breadcrumbSchema, softwareApplicationSchema } from "../../lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "AI Tools for Startups and Careers | LaunchMind AI",
  description:
    "Explore LaunchMind AI tools for startup ideas, business names, resumes, cover letters, feasibility reports, and MVP planning.",
  path: "/ai-tools",
  keywords: ["AI tools", "startup AI tools", "career AI tools", "business AI tools"],
});

export default function AiToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Tools", path: "/ai-tools" },
          ]),
          softwareApplicationSchema(),
        ]}
      />

      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              AI tools
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              AI tools for startup planning and job applications
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Use LaunchMind AI to shape startup ideas, name businesses, prepare job application drafts, and connect planning work to useful next steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/startup-idea-generator" className="btn-primary">
                Start with a startup idea
              </Link>
              <Link href="/jobs" className="btn-secondary">
                Explore jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {toolPages.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 transition hover:border-[rgba(212,175,55,0.35)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {tool.eyebrow}
              </p>
              <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em]">
                {tool.h1}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {tool.metaDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="container-page grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold tracking-[-0.03em]">Startup workflows</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Move from business idea to name, feasibility report, SWOT review, competitor research, and MVP planning.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold tracking-[-0.03em]">Career workflows</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Draft resume and cover letter content that connects your projects, skills, and startup experience to target roles.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold tracking-[-0.03em]">Learning workflows</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Use the blog and guides to learn how to validate ideas, write stronger drafts, and avoid generic AI output.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
