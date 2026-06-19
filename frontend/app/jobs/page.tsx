import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { jobCategories } from "../../lib/seo-content";
import { breadcrumbSchema, faqSchema } from "../../lib/structured-data";

const jobFaqs = [
  {
    question: "Can LaunchMind AI help me apply for startup jobs?",
    answer:
      "Yes. Use the AI resume builder and cover letter generator to draft role-specific application materials, then edit them for accuracy and personal voice.",
  },
  {
    question: "What jobs fit startup-minded students?",
    answer:
      "Product, operations, growth, founder associate, marketing, automation, and research roles often fit students with projects, hackathons, or early venture experience.",
  },
  {
    question: "Should I mention startup projects on my resume?",
    answer:
      "Yes, if they show useful skills, measurable outcomes, customer research, product thinking, or practical execution.",
  },
];

export const metadata: Metadata = createMetadata({
  title: "AI Jobs and Startup Career Tools | LaunchMind AI",
  description:
    "Explore AI and startup job paths, then use LaunchMind AI resume and cover letter tools to prepare stronger applications.",
  path: "/jobs",
  keywords: ["AI jobs", "startup jobs", "startup career tools", "AI resume builder", "cover letter generator"],
});

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Jobs", path: "/jobs" },
          ]),
          faqSchema(jobFaqs),
        ]}
      />

      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Jobs
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              AI jobs and startup career tools
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Explore startup-friendly role paths and prepare application drafts with AI resume and cover letter tools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/ai-resume-builder" className="btn-primary">
                Build a resume draft
              </Link>
              <Link href="/ai-cover-letter-generator" className="btn-secondary">
                Generate a cover letter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-[-0.04em]">
            Startup and AI role paths
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobCategories.map((category) => (
              <article
                key={category}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20"
              >
                <h3 className="text-xl font-bold tracking-[-0.03em]">{category}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Use projects, coursework, startup ideas, and measurable outcomes to position your experience for this type of role.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em]">
              Career questions
            </h2>
          </div>
          <div className="space-y-4">
            {jobFaqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20"
              >
                <h3 className="text-lg font-bold tracking-[-0.025em]">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
