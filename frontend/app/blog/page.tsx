import type { Metadata } from "next";

import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { blogArticles } from "../../lib/seo-content";
import { breadcrumbSchema } from "../../lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "LaunchMind AI Blog | Product Notes and Public Updates",
  description: "Read product notes, public updates, and practical content related to LaunchMind AI.",
  path: "/blog",
  keywords: ["LaunchMind blog", "product updates", "public website content"],
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
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">Blog</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Product notes and public-facing LaunchMind updates</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Follow LaunchMind updates, product positioning notes, and practical writing around the website and company
              direction.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="container-page grid gap-5 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <article
              key={article.title}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
            >
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">{article.category}</p>
              <h2 className="mt-5 text-2xl font-bold">{article.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{article.description}</p>
              <p className="mt-6 text-sm text-[var(--muted)]">{article.readTime}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
