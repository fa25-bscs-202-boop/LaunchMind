"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Presentation,
  Rocket,
  Search,
  TrendingUp,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isUnauthorizedError } from "../../lib/api";
import { getCurrentUser, hasStoredUserToken, logoutUser, type User } from "../../lib/auth";

type DashboardCard = {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: typeof Rocket;
};

const dashboardCards: DashboardCard[] = [
  {
    title: "New Idea Analysis",
    description: "Analyze a raw idea and generate structured startup insights.",
    action: "Start",
    href: "/dashboard/new-analysis",
    icon: Rocket,
  },
  {
    title: "Saved Analyses",
    description: "Review previous idea analyses and continue from where you left off.",
    action: "View",
    href: "/dashboard/analyses",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    description: "Generate and manage feasibility reports.",
    action: "Generate",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Pitch Decks",
    description: "Prepare investor-style startup presentations.",
    action: "Generate",
    href: "/dashboard/pitch",
    icon: Presentation,
  },
  {
    title: "SWOT",
    description: "Review strengths, weaknesses, opportunities, and threats.",
    action: "Open",
    href: "/dashboard/swot",
    icon: BarChart3,
  },
  {
    title: "Competitors",
    description: "Compare market alternatives and positioning.",
    action: "Open",
    href: "/dashboard/competitors",
    icon: Search,
  },
  {
    title: "MVP Planner",
    description: "Plan the first practical version of your product.",
    action: "Start",
    href: "/dashboard/mvp",
    icon: ClipboardList,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function loadUser() {
      if (!hasStoredUserToken()) {
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
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 py-16 sm:py-24">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center sm:mx-0 sm:text-left">
              <div className="mx-auto h-10 w-2/3 animate-pulse rounded-full bg-white/10 sm:mx-0" />
              <div className="mx-auto mt-5 h-5 w-full max-w-xl animate-pulse rounded-full bg-white/10 sm:mx-0" />
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {["one", "two", "three", "four", "five", "six"].map((item) => (
                <Card key={item} className="h-52 animate-pulse p-6">
                  <div className="size-10 rounded-lg bg-white/10" />
                  <div className="mt-6 h-6 w-40 rounded-full bg-white/10" />
                  <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
                  <div className="mt-3 h-4 w-4/5 rounded-full bg-white/10" />
                  <div className="mt-8 h-10 w-28 rounded-full bg-white/10" />
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 py-16 sm:py-24">
          <div className="container-page">
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-4 py-16 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center sm:mx-0 sm:text-left">
            <Badge className="gap-2">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              Startup workspace
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Good to see you, {user.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:mx-0 sm:text-lg">
              Choose a tool to analyze, plan, or present your startup idea.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Card
                  key={card.title}
                  className="animate-fade-up transition duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_52px_rgba(0,0,0,0.28)]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CardHeader className="items-center p-6 text-center sm:items-start sm:text-left">
                    <div className="flex size-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="mt-2">{card.title}</CardTitle>
                    <CardDescription className="min-h-12">{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex p-6 pt-0">
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <Link href={card.href}>{card.action}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
