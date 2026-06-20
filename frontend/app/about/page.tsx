import type { Metadata } from "next";

import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { breadcrumbSchema } from "../../lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "About LaunchMind AI | Company Overview and Direction",
  description:
    "Learn what LaunchMind AI is, what the team is focused on, and how the product is being presented right now.",
  path: "/about",
  keywords: ["about LaunchMind AI", "LaunchMind company", "product direction"],
});

export default function AboutPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <section className="px-4 py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">About</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">A focused public-facing LaunchMind experience.</h1>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-9">
            <p className="text-lg leading-8 text-[var(--text)]">
              LaunchMind AI is currently centered on a clearer website experience built around essential company and
              product information.
            </p>
            <p className="mt-6 text-base leading-7 text-[var(--muted)]">
              The public surface now prioritizes the pages visitors use most: FAQ, pricing, about, blog, and contact.
              This keeps the site easier to navigate and easier to maintain.
            </p>
            <p className="mt-6 text-base leading-7 text-[var(--muted)]">
              Account access remains available, but the website itself is intentionally trimmed back to remove unused AI
              tool routes and unnecessary navigation complexity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
