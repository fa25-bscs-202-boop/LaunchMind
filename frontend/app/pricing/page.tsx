import Link from "next/link";
import { Navbar } from "../components/Navbar";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For testing the workspace and preparing a few early idea drafts.",
    items: ["Basic idea analysis", "Limited saved outputs", "PDF export"],
    href: "/register",
  },
  {
    name: "Pro",
    price: "$12",
    description: "For founders and freelancers who need more complete planning documents.",
    items: ["Full feasibility reports", "Pitch deck content", "Competitor and SWOT tools"],
    href: "/register",
  },
  {
    name: "University",
    price: "Custom",
    description: "For classes, incubators, and student programs that support many projects.",
    items: ["Team access", "Student-friendly workflows", "Program support options"],
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Pricing
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Simple plans for early-stage planning.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Choose a starting point that fits your idea stage. Payment integration will be added later.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
              >
                <h2 className="text-2xl font-bold tracking-[-0.03em]">{plan.name}</h2>
                <p className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[var(--accent)]">
                  {plan.price}
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  {plan.description}
                </p>
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








