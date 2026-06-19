import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toolPages, type ToolPage } from "../../lib/seo-content";
import { breadcrumbSchema, faqSchema } from "../../lib/structured-data";
import { JsonLd } from "./JsonLd";

type ToolLandingPageProps = {
  tool: ToolPage;
};

export function ToolLandingPage({ tool }: ToolLandingPageProps) {
  const relatedTools = tool.related
    .map((path) => toolPages.find((item) => item.path === path))
    .filter((item): item is ToolPage => Boolean(item));

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Tools", path: "/ai-tools" },
            { name: tool.h1, path: tool.path },
          ]),
          faqSchema(tool.faqs),
        ]}
      />

      <section className="px-4 py-16 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-left">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">
              {tool.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {tool.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg lg:mx-0">
              {tool.intro}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/register">
                  {tool.primaryCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/ai-tools">Explore all AI tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="container-page grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card asChild className="p-6 sm:p-7">
            <article>
              <h2 className="text-2xl font-bold">What the tool does</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
                {tool.whatItDoes}
              </p>
            </article>
          </Card>

          <Card asChild className="p-6 sm:p-7">
            <article>
              <h2 className="text-2xl font-bold">Benefits</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {tool.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <h2 className="text-3xl font-bold">How to use it</h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Start with a specific goal, then use the generated draft as a structured first version.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {tool.howToUse.map((step, index) => (
              <Card
                key={step}
                className="p-6 text-center md:text-left"
              >
                <Badge>Step {index + 1}</Badge>
                <h3 className="mt-4 text-base font-bold">
                  {step}
                </h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {tool.faqs.map((faq) => (
              <Card
                key={faq.question}
                className="p-6"
              >
                <h3 className="text-lg font-bold">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="container-page">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--accent)]">
                Related tools
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                Keep building from here
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/blog">Read AI planning guides</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((related) => (
              <Link
                key={related.path}
                href={related.path}
                className="rounded-lg border border-border bg-card p-6 text-center shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-primary/35 md:text-left"
              >
                <p className="text-xs font-semibold uppercase text-[var(--accent)]">
                  {related.eyebrow}
                </p>
                <h3 className="mt-4 text-xl font-bold">
                  {related.h1}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {related.metaDescription}
                </p>
              </Link>
            ))}
            <Link
              href="/jobs"
              className="rounded-lg border border-border bg-card p-6 text-center shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-primary/35 md:text-left"
            >
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">
                Career hub
              </p>
              <h3 className="mt-4 text-xl font-bold">
                AI jobs and startup career ideas
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Explore role paths that pair well with AI resume and cover letter workflows.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
