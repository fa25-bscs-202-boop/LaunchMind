import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { blogArticles } from "../../lib/seo-content";
import { breadcrumbSchema } from "../../lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "LaunchMind AI Blog | Startup, AI Tools, and Career Guides",
  description:
    "Read practical guides on startup validation, AI business planning, resume writing, cover letters, and early career growth.",
  path: "/blog",
  keywords: ["startup blog", "AI tools blog", "startup validation", "resume tips", "business planning"],
});

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Blog
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Startup and AI tool guides for practical planning
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Learn how to validate startup ideas, use AI tools responsibly, and prepare stronger career materials without sounding generic.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="container-page grid gap-5 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <article
              key={article.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {article.category}
              </p>
              <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em]">
                {article.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {article.description}
              </p>
              <p className="mt-6 text-sm text-[var(--muted)]">{article.readTime}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="container-page rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 shadow-xl shadow-black/20">
          <h2 className="text-3xl font-bold tracking-[-0.04em]">
            Start with the tool that matches your goal
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/startup-idea-generator" className="btn-secondary">
              Startup idea generator
            </Link>
            <Link href="/business-name-generator" className="btn-secondary">
              Business name generator
            </Link>
            <Link href="/ai-resume-builder" className="btn-secondary">
              AI resume builder
            </Link>
            <Link href="/ai-cover-letter-generator" className="btn-secondary">
              Cover letter generator
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
