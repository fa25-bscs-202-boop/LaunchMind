import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { breadcrumbSchema } from "../../lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "LaunchMind AI Pricing | Plans and Access",
  description: "Review LaunchMind AI pricing and current plan options for individuals, teams, and programs.",
  path: "/pricing",
  keywords: ["LaunchMind AI pricing", "LaunchMind plans", "software pricing"],
});

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For exploring the public experience and understanding the product direction.",
    items: ["Access to public pages", "Product updates", "Basic account access"],
    href: "/register",
  },
  {
    name: "Pro",
    price: "$12",
    description: "For individuals who want deeper product access and closer engagement as LaunchMind evolves.",
    items: ["Priority support", "Expanded access", "Early feature visibility"],
    href: "/register",
  },
  {
    name: "University",
    price: "Custom",
    description: "For programs, incubators, and partner organizations that need tailored coordination.",
    items: ["Team onboarding", "Program support", "Custom planning"],
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />

      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">Pricing</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Simple plans for a cleaner LaunchMind experience.</h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Choose a plan that matches your level of interest and how closely you want to work with the product.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
              >
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="mt-4 text-4xl font-bold text-[var(--accent)]">{plan.price}</p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{plan.description}</p>
                <ul className="mt-7 space-y-3 text-sm text-[var(--text)]">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="btn-secondary mt-8 w-full">
                  Choose {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
