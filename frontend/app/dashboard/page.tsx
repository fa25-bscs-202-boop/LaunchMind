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
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, isUnauthorizedError } from "../../lib/api";
import { getCurrentUser, hasStoredUserToken, logoutUser, type User } from "../../lib/auth";

type DashboardCard = {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: typeof Rocket;
};

type AnalysisSummary = {
  id: number;
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
  const [hasAnalyses, setHasAnalyses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    async function loadUser() {
      if (!hasStoredUserToken()) {
        router.push("/login");
        return;
      }

      try {
        const [currentUser, analyses] = await Promise.all([
          getCurrentUser(),
          apiRequest<AnalysisSummary[]>("/analyses"),
        ]);
        setUser(currentUser);
        setHasAnalyses(analyses.length > 0);
        if (typeof window !== "undefined") {
          const onboardingKey = `launchmind_onboarding_seen_${currentUser.id}`;
          setShowOnboarding(!window.localStorage.getItem(onboardingKey));
        }
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

  function closeOnboarding() {
    if (user && typeof window !== "undefined") {
      window.localStorage.setItem(`launchmind_onboarding_seen_${user.id}`, "true");
    }

    setShowOnboarding(false);
    setOnboardingStep(0);
  }

  const onboardingSteps = [
    {
      title: "Start with one clear idea",
      description: "Use New Idea Analysis to turn rough notes into a sharper problem, audience, and direction.",
    },
    {
      title: "Expand into planning documents",
      description: "Generate reports, SWOT, pitch decks, competitors, and MVP plans from the same workspace.",
    },
    {
      title: "Keep momentum visible",
      description: "Save outputs, revisit them later, and build your next decision from something concrete.",
    },
  ];

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
      {showOnboarding ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-border/90 bg-card/98">
            <CardHeader className="relative p-6 pb-3">
              <button
                type="button"
                className="absolute right-5 top-5 text-muted-foreground transition hover:text-foreground"
                onClick={closeOnboarding}
                aria-label="Close onboarding"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <Badge className="w-fit gap-2">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Quick onboarding
              </Badge>
              <CardTitle className="mt-4 text-2xl">{onboardingSteps[onboardingStep].title}</CardTitle>
              <CardDescription>{onboardingSteps[onboardingStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="mb-6 flex gap-2">
                {onboardingSteps.map((step, index) => (
                  <span
                    key={step.title}
                    className={`h-2 flex-1 rounded-full ${index <= onboardingStep ? "bg-primary" : "bg-white/10"}`}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button variant="ghost" onClick={closeOnboarding}>
                  Skip for now
                </Button>
                <div className="flex gap-3">
                  {onboardingStep > 0 ? (
                    <Button variant="secondary" onClick={() => setOnboardingStep((current) => current - 1)}>
                      Back
                    </Button>
                  ) : null}
                  {onboardingStep < onboardingSteps.length - 1 ? (
                    <Button onClick={() => setOnboardingStep((current) => current + 1)}>Next</Button>
                  ) : (
                    <Button onClick={closeOnboarding}>Go to workspace</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

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

          {!hasAnalyses ? (
            <Card className="mt-12 overflow-hidden border-primary/15 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,255,255,0.02))]">
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="flex items-center justify-center border-b border-border/80 p-8 lg:border-b-0 lg:border-r">
                  <div className="relative h-48 w-full max-w-sm">
                    <div className="absolute left-0 top-10 h-24 w-24 rounded-3xl border border-primary/20 bg-primary/10" />
                    <div className="absolute left-16 top-2 h-32 w-40 rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)]" />
                    <div className="absolute bottom-0 right-0 h-28 w-44 rounded-[2rem] border border-primary/20 bg-[rgba(212,175,55,0.08)]" />
                    <div className="absolute left-1/2 top-16 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border border-primary/25 bg-background shadow-xl shadow-black/30">
                      <Rocket className="size-7 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="p-8 sm:p-10">
                  <Badge className="gap-2">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    First workspace
                  </Badge>
                  <h2 className="mt-5 text-3xl font-bold leading-tight">Create your first plan and give the dashboard something to build from.</h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                    Start with one idea analysis. Once you have that first result, LaunchMind can expand it into reports,
                    pitch content, SWOT analysis, competitor research, and MVP planning.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/dashboard/new-analysis">Create first plan</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <Link href="/dashboard/analyses">See saved analyses</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

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
