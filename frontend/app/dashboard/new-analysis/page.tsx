"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
// Navbar is provided globally in layout
import { apiRequest, ApiError, isUnauthorizedError } from "../../../lib/api";
import { getToken, logoutUser } from "../../../lib/auth";

type AnalysisResult = {
  startup_names: string[];
  one_line_pitch: string;
  problem_statement: string;
  proposed_solution: string;
  target_market: string;
  market_feasibility: string;
  technical_feasibility: string;
  financial_feasibility: string;
  risk_assessment: string[];
  revenue_model: string[];
  launch_roadmap: string[];
  final_recommendation: string;
};

type FormErrors = {
  idea?: string;
  industry?: string;
  targetAudience?: string;
};

const textSections = [
  { title: "Problem Statement", key: "problem_statement" },
  { title: "Proposed Solution", key: "proposed_solution" },
  { title: "Target Market", key: "target_market" },
  { title: "Market Feasibility", key: "market_feasibility" },
  { title: "Technical Feasibility", key: "technical_feasibility" },
  { title: "Financial Feasibility", key: "financial_feasibility" },
] as const;

function validateForm(idea: string, industry: string, targetAudience: string) {
  const errors: FormErrors = {};

  if (!idea.trim()) {
    errors.idea = "Idea description is required.";
  } else if (idea.trim().length < 20) {
    errors.idea = "Idea description must be at least 20 characters.";
  }

  if (!industry.trim()) {
    errors.industry = "Industry is required.";
  }

  if (!targetAudience.trim()) {
    errors.targetAudience = "Target audience is required.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-200">{message}</p>;
}

function TextCard({ title, children }: { title: string; children: string }) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20">
      <h3 className="text-lg font-bold tracking-[-0.025em] text-[var(--text)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{children}</p>
    </article>
  );
}

function ListCard({
  title,
  items,
  variant = "list",
}: {
  title: string;
  items: string[];
  variant?: "list" | "timeline";
}) {
  return (
    <article className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20">
      <h3 className="text-lg font-bold tracking-[-0.025em] text-[var(--text)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${title}-${item}`} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
            <span className="mt-2 flex h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>
              {variant === "timeline" ? (
                <span className="mr-2 font-semibold text-[var(--text)]">
                  Step {index + 1}:
                </span>
              ) : null}
              {item}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function AnalysisResults({ result }: { result: AnalysisResult }) {
  return (
    <section className="mt-16 animate-[fadeUp_220ms_ease-out_forwards]" id="analysis-results">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Analysis results
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
          Structured startup insight
        </h2>
      </div>

      <div className="animate-fade-up hover-lift mt-8 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[var(--surface)] p-6 shadow-xl shadow-black/25">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Startup Names
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {result.startup_names.map((name) => (
            <span
              key={name}
              className="rounded-full border border-[rgba(212,175,55,0.22)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="animate-fade-up hover-lift mt-5 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[var(--surface)] p-6 shadow-xl shadow-black/25">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          One Line Pitch
        </h3>
        <p className="mt-4 text-xl font-semibold leading-8 tracking-[-0.025em] text-[var(--text)]">
          {result.one_line_pitch}
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {textSections.map((section) => (
          <TextCard key={section.key} title={section.title}>
            {result[section.key]}
          </TextCard>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <ListCard title="Risk Assessment" items={result.risk_assessment} />
        <ListCard title="Revenue Model" items={result.revenue_model} />
        <ListCard title="Launch Roadmap" items={result.launch_roadmap} variant="timeline" />
      </div>

      <div className="animate-fade-up hover-lift mt-5 rounded-2xl border border-[rgba(212,175,55,0.24)] bg-[var(--surface)] p-7 shadow-xl shadow-black/25">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Final Recommendation
        </h3>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[var(--text)]">
          {result.final_recommendation}
        </p>
      </div>

      <Link href="/dashboard/analyses" className="btn-secondary mt-8 w-full sm:w-fit">
        View saved analyses
      </Link>
    </section>
  );
}

export default function NewAnalysisPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError("");

    const validationErrors = validateForm(idea, industry, targetAudience);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      const analysis = await apiRequest<AnalysisResult>("/ideas/analyze", {
        method: "POST",
        body: JSON.stringify({
          idea: idea.trim(),
          industry: industry.trim(),
          target_audience: targetAudience.trim(),
        }),
      });

      setResult(analysis);
      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (error) {
      setResult(null);

      if (isUnauthorizedError(error)) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (error instanceof ApiError) {
        setRequestError(error.message);
      } else {
        setRequestError("We could not analyze this idea right now. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Analyze a new startup idea
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Describe your idea and LaunchMind will generate structured startup insights.
            </p>
          </div>

          <form
            className="animate-fade-up hover-lift mt-12 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-9"
            onSubmit={handleSubmit}
          >
            <label
              className="block text-sm font-semibold text-[var(--text)]"
              htmlFor="idea"
            >
              Startup idea
            </label>
            <textarea
              id="idea"
              name="idea"
              rows={10}
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Describe your startup or business idea..."
              className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text)] outline-none transition placeholder:text-[rgba(163,163,163,0.55)] focus:border-[rgba(212,175,55,0.45)]"
            />
            <FieldError message={errors.idea} />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="block text-sm font-semibold text-[var(--text)]"
                  htmlFor="industry"
                >
                  Industry
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  placeholder="e.g. Healthcare, AI SaaS, Education"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[rgba(163,163,163,0.55)] focus:border-[rgba(212,175,55,0.45)]"
                />
                <FieldError message={errors.industry} />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-[var(--text)]"
                  htmlFor="target-audience"
                >
                  Target audience
                </label>
                <input
                  id="target-audience"
                  name="target-audience"
                  type="text"
                  value={targetAudience}
                  onChange={(event) => setTargetAudience(event.target.value)}
                  placeholder="e.g. Students, freelancers, small businesses"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[rgba(163,163,163,0.55)] focus:border-[rgba(212,175,55,0.45)]"
                />
                <FieldError message={errors.targetAudience} />
              </div>
            </div>

            {requestError ? (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                <p className="font-semibold">Analysis could not be completed.</p>
                <p className="mt-1 text-red-100/80">{requestError}</p>
              </div>
            ) : null}

            <button
              type="submit"
              className="btn-primary mt-8 w-full gap-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#080808]/30 border-t-[#080808]" />
              ) : null}
              {isLoading ? "Analyzing idea..." : "Analyze idea"}
            </button>
          </form>

          <div ref={resultsRef}>{result ? <AnalysisResults result={result} /> : null}</div>
        </div>
      </section>
    </main>
  );
}








