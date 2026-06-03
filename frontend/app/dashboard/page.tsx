"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { isUnauthorizedError } from "../../lib/api";
import { getCurrentUser, getToken, logoutUser, type User } from "../../lib/auth";

type DashboardCard = {
  title: string;
  description: string;
  action: string;
  href: string;
};

const dashboardCards: DashboardCard[] = [
  {
    title: "New Idea Analysis",
    description: "Analyze a raw idea and generate structured startup insights.",
    action: "Start",
    href: "/dashboard/new-analysis",
  },
  {
    title: "Saved Analyses",
    description: "Review previous idea analyses and continue from where you left off.",
    action: "View",
    href: "/dashboard/analyses",
  },
  {
    title: "Reports",
    description: "Generate and manage feasibility reports.",
    action: "Generate",
    href: "/dashboard/reports",
  },
  {
    title: "Pitch Decks",
    description: "Prepare investor-style startup presentations.",
    action: "Generate",
    href: "/dashboard/pitch",
  },
  {
    title: "SWOT",
    description: "Review strengths, weaknesses, opportunities, and threats.",
    action: "Open",
    href: "/dashboard/swot",
  },
  {
    title: "Competitors",
    description: "Compare market alternatives and positioning.",
    action: "Open",
    href: "/dashboard/competitors",
  },
  {
    title: "MVP Planner",
    description: "Plan the first practical version of your product.",
    action: "Start",
    href: "/dashboard/mvp",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        router.push("/login");
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          logoutUser();
          router.push("/login");
          return;
        }

        setAuthError("We could not verify your session right now. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
        
        <section className="px-4 py-20 sm:py-28">
          <div className="container-page">
            <div className="max-w-3xl">
              <div className="h-11 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-5 h-5 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {["one", "two", "three", "four", "five", "six"].map((item) => (
                <div
                  key={item}
                  className="animate-fade-up hover-lift h-48 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
                >
                  <div className="h-6 w-40 rounded-full bg-white/10" />
                  <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
                  <div className="mt-3 h-4 w-4/5 rounded-full bg-white/10" />
                  <div className="mt-8 h-10 w-28 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
        
        <section className="px-4 py-20 sm:py-28">
          <div className="container-page">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-100">
              {authError}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Good to see you, {user.name}
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Choose a tool to analyze, plan, or present your startup idea.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card, index) => (
              <article
                key={card.title}
                className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <h2 className="text-xl font-bold tracking-[-0.025em]">
                  {card.title}
                </h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
                  {card.description}
                </p>
                <Link href={card.href} className="btn-secondary mt-7 px-5 py-2.5">
                  {card.action}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}












