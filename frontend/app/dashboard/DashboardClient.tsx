"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Boxes, Download, FileText, Lightbulb, Presentation, ShieldCheck, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/api";
import { downloadPdf } from "@/lib/download";
import {
  getAnalyses,
  getCompetitorAnalyses,
  getMvpPlans,
  getPitchDecks,
  getReports,
  getSwotAnalyses,
  type Analysis,
  type CompetitorAnalysis,
  type MvpPlan,
  type PitchDeck,
  type Report,
  type SwotAnalysis,
} from "@/lib/workspace";
import { WorkspaceEmptyState } from "../components/WorkspaceEmptyState";
import { ListReportSection, TextReportSection } from "../components/ReportSections";
import { WorkspaceShell } from "../components/WorkspaceShell";

type DashboardData = {
  analyses: Analysis[];
  reports: Report[];
  pitches: PitchDeck[];
  swots: SwotAnalysis[];
  competitors: CompetitorAnalysis[];
  mvps: MvpPlan[];
};

type SavedSectionProps<T> = {
  id: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onOpenItem: (item: T) => void;
};

type SelectedSavedItem =
  | { type: "analysis"; item: Analysis }
  | { type: "report"; item: Report }
  | { type: "pitch"; item: PitchDeck }
  | { type: "swot"; item: SwotAnalysis }
  | { type: "competitor"; item: CompetitorAnalysis }
  | { type: "mvp"; item: MvpPlan };

const emptyData: DashboardData = {
  analyses: [],
  reports: [],
  pitches: [],
  swots: [],
  competitors: [],
  mvps: [],
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function SavedSection<T>({
  id,
  title,
  description,
  href,
  buttonLabel,
  icon: Icon,
  items,
  renderItem,
  onOpenItem,
}: SavedSectionProps<T>) {
  return (
    <section id={id} className="scroll-mt-6 rounded-lg border border-border bg-card/95 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href={href}>{buttonLabel}</Link>
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <Card key={index} className="border-border/90 bg-background/35">
              <button
                type="button"
                onClick={() => onOpenItem(item)}
                className="block h-full w-full rounded-lg text-left transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <CardContent className="p-5">{renderItem(item)}</CardContent>
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-background/25 p-6 text-sm text-muted-foreground">
          No saved items in this category yet.
        </div>
      )}
    </section>
  );
}

function SavedItemDetails({ selected }: { selected: SelectedSavedItem }) {
  if (selected.type === "analysis") {
    const item = selected.item;

    return (
      <div className="space-y-4">
        <TextReportSection label="Idea"><p className="text-foreground">{item.idea}</p></TextReportSection>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextReportSection label="One-line pitch"><p>{item.one_line_pitch}</p></TextReportSection>
          <TextReportSection label="Target market"><p>{item.target_market}</p></TextReportSection>
          <TextReportSection label="Problem statement"><p>{item.problem_statement}</p></TextReportSection>
          <TextReportSection label="Proposed solution"><p>{item.proposed_solution}</p></TextReportSection>
          <TextReportSection label="Market feasibility"><p>{item.market_feasibility}</p></TextReportSection>
          <TextReportSection label="Technical feasibility"><p>{item.technical_feasibility}</p></TextReportSection>
          <TextReportSection label="Financial feasibility"><p>{item.financial_feasibility}</p></TextReportSection>
          <TextReportSection label="Operational feasibility"><p>{item.operational_feasibility}</p></TextReportSection>
          <TextReportSection label="Legal feasibility"><p>{item.legal_feasibility}</p></TextReportSection>
          <TextReportSection label="Final recommendation"><p>{item.final_recommendation}</p></TextReportSection>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <ListReportSection label="Startup names" items={item.startup_names} />
          <ListReportSection label="Risk assessment" items={item.risk_assessment} />
          <ListReportSection label="Revenue model" items={item.revenue_model} />
          <ListReportSection label="Launch roadmap" items={item.launch_roadmap} />
        </div>
      </div>
    );
  }

  if (selected.type === "report") {
    const item = selected.item;

    return (
      <div className="space-y-4">
        <TextReportSection label="Title"><p className="text-foreground">{item.title}</p></TextReportSection>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextReportSection label="Executive summary"><p>{item.executive_summary}</p></TextReportSection>
          <TextReportSection label="Introduction"><p>{item.introduction}</p></TextReportSection>
          <TextReportSection label="Problem statement"><p>{item.problem_statement}</p></TextReportSection>
          <TextReportSection label="Objectives"><p>{item.objectives}</p></TextReportSection>
          <TextReportSection label="Scope"><p>{item.scope}</p></TextReportSection>
          <TextReportSection label="Methodology"><p>{item.methodology}</p></TextReportSection>
          <TextReportSection label="Market feasibility"><p>{item.market_feasibility}</p></TextReportSection>
          <TextReportSection label="Technical feasibility"><p>{item.technical_feasibility}</p></TextReportSection>
          <TextReportSection label="Operational feasibility"><p>{item.operational_feasibility}</p></TextReportSection>
          <TextReportSection label="Financial feasibility"><p>{item.financial_feasibility}</p></TextReportSection>
          <TextReportSection label="Legal considerations"><p>{item.legal_considerations}</p></TextReportSection>
          <TextReportSection label="Risk assessment"><p>{item.risk_assessment}</p></TextReportSection>
          <TextReportSection label="Findings"><p>{item.findings}</p></TextReportSection>
          <TextReportSection label="Recommendations"><p>{item.recommendations}</p></TextReportSection>
        </div>
        <TextReportSection label="Conclusion"><p>{item.conclusion}</p></TextReportSection>
      </div>
    );
  }

  if (selected.type === "pitch") {
    const item = selected.item;

    return (
      <div className="space-y-4">
        <TextReportSection label="Startup name"><p className="text-foreground">{item.startup_name}</p></TextReportSection>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextReportSection label="Elevator pitch"><p>{item.elevator_pitch}</p></TextReportSection>
          <TextReportSection label="Problem"><p>{item.problem}</p></TextReportSection>
          <TextReportSection label="Solution"><p>{item.solution}</p></TextReportSection>
          <TextReportSection label="Target market"><p>{item.target_market}</p></TextReportSection>
          <TextReportSection label="Business model"><p>{item.business_model}</p></TextReportSection>
          <TextReportSection label="Competitor landscape"><p>{item.competitor_landscape}</p></TextReportSection>
          <TextReportSection label="Go-to-market"><p>{item.go_to_market_strategy}</p></TextReportSection>
          <TextReportSection label="Revenue model"><p>{item.revenue_model}</p></TextReportSection>
          <TextReportSection label="MVP summary"><p>{item.mvp_summary}</p></TextReportSection>
          <TextReportSection label="Traction strategy"><p>{item.traction_strategy}</p></TextReportSection>
          <TextReportSection label="Funding needs"><p>{item.funding_needs}</p></TextReportSection>
          <TextReportSection label="Future roadmap"><p>{item.future_roadmap}</p></TextReportSection>
        </div>
        <TextReportSection label="Closing statement"><p>{item.closing_statement}</p></TextReportSection>
      </div>
    );
  }

  if (selected.type === "swot") {
    const item = selected.item;

    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <ListReportSection label="Strengths" items={item.strengths} />
        <ListReportSection label="Weaknesses" items={item.weaknesses} />
        <ListReportSection label="Opportunities" items={item.opportunities} />
        <ListReportSection label="Threats" items={item.threats} />
        <ListReportSection label="Strategic recommendations" items={item.strategic_recommendations} />
      </div>
    );
  }

  if (selected.type === "competitor") {
    const item = selected.item;

    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <ListReportSection label="Direct competitors" items={item.direct_competitors} />
        <ListReportSection label="Indirect competitors" items={item.indirect_competitors} />
        <TextReportSection label="Competitor strengths"><p>{item.competitor_strengths}</p></TextReportSection>
        <TextReportSection label="Competitor weaknesses"><p>{item.competitor_weaknesses}</p></TextReportSection>
        <TextReportSection label="Market gap"><p>{item.market_gap}</p></TextReportSection>
        <TextReportSection label="Differentiation strategy"><p>{item.differentiation_strategy}</p></TextReportSection>
        <TextReportSection label="Pricing comparison"><p>{item.pricing_comparison}</p></TextReportSection>
        <TextReportSection label="Recommendations"><p>{item.recommendations}</p></TextReportSection>
      </div>
    );
  }

  const item = selected.item;

  return (
    <div className="space-y-4">
      <TextReportSection label="MVP summary"><p>{item.mvp_summary}</p></TextReportSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <ListReportSection label="Core features" items={item.core_features} />
        <ListReportSection label="Excluded features" items={item.excluded_features} />
        <ListReportSection label="Recommended tech stack" items={item.recommended_tech_stack} />
        <ListReportSection label="Development phases" items={item.development_phases} />
        <TextReportSection label="Timeline"><p>{item.timeline}</p></TextReportSection>
        <ListReportSection label="Required team" items={item.required_team} />
        <TextReportSection label="Budget considerations"><p>{item.budget_considerations}</p></TextReportSection>
        <ListReportSection label="Launch checklist" items={item.launch_checklist} />
      </div>
      <ListReportSection label="Success metrics" items={item.success_metrics} />
    </div>
  );
}

function getSelectedTitle(selected: SelectedSavedItem) {
  if (selected.type === "analysis") return selected.item.idea;
  if (selected.type === "report") return selected.item.title;
  if (selected.type === "pitch") return selected.item.startup_name;
  if (selected.type === "swot") return `SWOT Analysis #${selected.item.id}`;
  if (selected.type === "competitor") return `Competitor Analysis #${selected.item.id}`;
  return `MVP Plan #${selected.item.id}`;
}

function getSelectedPdfExport(selected: SelectedSavedItem) {
  if (selected.type === "analysis") {
    return {
      endpoint: `/exports/analysis/${selected.item.id}/pdf`,
      filename: `launchmind-analysis-${selected.item.id}.pdf`,
    };
  }

  if (selected.type === "report") {
    return {
      endpoint: `/exports/report/${selected.item.id}/pdf`,
      filename: `launchmind-report-${selected.item.id}.pdf`,
    };
  }

  if (selected.type === "pitch") {
    return {
      endpoint: `/exports/pitch/${selected.item.id}/pdf`,
      filename: `launchmind-pitch-${selected.item.id}.pdf`,
    };
  }

  if (selected.type === "swot") {
    return {
      endpoint: `/exports/swot/${selected.item.id}/pdf`,
      filename: `launchmind-swot-${selected.item.id}.pdf`,
    };
  }

  if (selected.type === "competitor") {
    return {
      endpoint: `/exports/competitor/${selected.item.id}/pdf`,
      filename: `launchmind-competitor-${selected.item.id}.pdf`,
    };
  }

  return {
    endpoint: `/exports/mvp/${selected.item.id}/pdf`,
    filename: `launchmind-mvp-${selected.item.id}.pdf`,
  };
}

export default function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<SelectedSavedItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!selectedItem) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selectedItem]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [analyses, reports, pitches, swots, competitors, mvps] = await Promise.all([
          getAnalyses(),
          getReports(),
          getPitchDecks(),
          getSwotAnalyses(),
          getCompetitorAnalyses(),
          getMvpPlans(),
        ]);

        if (isMounted) {
          setData({ analyses, reports, pitches, swots, competitors, mvps });
        }
      } catch (err) {
        if (isUnauthorizedError(err)) {
          router.replace("/login?next=/dashboard");
          return;
        }

        if (isMounted) {
          setError("We couldn’t load your saved workspace right now. Please refresh and try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const categories = useMemo(
    () => [
      { id: "analyses", label: "Saved Analysis", href: "#analyses", count: data.analyses.length },
      { id: "reports", label: "Saved Feasibility", href: "#reports", count: data.reports.length },
      { id: "pitches", label: "Saved Pitch Decks", href: "#pitches", count: data.pitches.length },
      { id: "swots", label: "Saved SWOT", href: "#swots", count: data.swots.length },
      { id: "competitors", label: "Saved Competitor", href: "#competitors", count: data.competitors.length },
      { id: "mvps", label: "Saved MVP", href: "#mvps", count: data.mvps.length },
    ],
    [data],
  );

  const totalSaved = categories.reduce((total, category) => total + category.count, 0);

  async function handleExportSelectedPdf() {
    if (!selectedItem) {
      return;
    }

    const pdfExport = getSelectedPdfExport(selectedItem);

    try {
      setIsExporting(true);
      setError("");
      await downloadPdf(pdfExport.endpoint, pdfExport.filename);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/login?next=/dashboard");
        return;
      }

      setError("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <WorkspaceShell
      title="Dashboard"
      description="Review all saved work in one clean, categorized workspace."
    >
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-lg border border-border bg-card/80 p-6" />
          ))}
        </div>
      ) : null}

      {!isLoading && error ? (
        <Alert variant="destructive" className="max-w-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {!isLoading && !error && totalSaved === 0 ? <WorkspaceEmptyState /> : null}

      {!isLoading && !error && totalSaved > 0 ? (
        <div className="grid gap-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className="rounded-lg border border-border bg-card/95 p-4 transition hover:border-primary/35 hover:bg-primary/8"
              >
                <p className="text-sm font-semibold text-foreground">{category.label}</p>
                <p className="mt-2 text-3xl font-bold text-primary">{category.count}</p>
              </a>
            ))}
          </div>

          <SavedSection
            id="analyses"
            title="Saved Analysis"
            description="All startup idea analyses you have created."
            href="/analyze"
            buttonLabel="Analyze idea"
            icon={Lightbulb}
            items={data.analyses}
            onOpenItem={(analysis) => setSelectedItem({ type: "analysis", item: analysis })}
            renderItem={(analysis) => (
              <div className="space-y-3">
                <div>
                  <h3 className="line-clamp-2 text-lg font-bold text-foreground">{analysis.idea}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(analysis.created_at)} · {analysis.industry || "General idea"}
                  </p>
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{analysis.one_line_pitch}</p>
              </div>
            )}
          />

          <SavedSection
            id="reports"
            title="Saved Feasibility Reports"
            description="Generated feasibility reports saved from your analyses."
            href="/feasibility"
            buttonLabel="Generate report"
            icon={FileText}
            items={data.reports}
            onOpenItem={(report) => setSelectedItem({ type: "report", item: report })}
            renderItem={(report) => (
              <div className="space-y-3">
                <h3 className="line-clamp-2 text-lg font-bold text-foreground">{report.title}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(report.created_at)}</p>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{report.executive_summary}</p>
              </div>
            )}
          />

          <SavedSection
            id="pitches"
            title="Saved Pitch Decks"
            description="Pitch deck drafts generated from your saved analyses."
            href="/pitch-deck"
            buttonLabel="Generate pitch"
            icon={Presentation}
            items={data.pitches}
            onOpenItem={(pitch) => setSelectedItem({ type: "pitch", item: pitch })}
            renderItem={(pitch) => (
              <div className="space-y-3">
                <h3 className="line-clamp-2 text-lg font-bold text-foreground">{pitch.startup_name}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(pitch.created_at)}</p>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{pitch.elevator_pitch}</p>
              </div>
            )}
          />

          <SavedSection
            id="swots"
            title="Saved SWOT"
            description="SWOT analyses generated from your saved ideas."
            href="/swot"
            buttonLabel="Generate SWOT"
            icon={BarChart3}
            items={data.swots}
            onOpenItem={(swot) => setSelectedItem({ type: "swot", item: swot })}
            renderItem={(swot) => (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">SWOT Analysis #{swot.id}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(swot.created_at)}</p>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {swot.strengths[0] || swot.strategic_recommendations[0] || "Saved SWOT analysis"}
                </p>
              </div>
            )}
          />

          <SavedSection
            id="competitors"
            title="Saved Competitor Analysis"
            description="Competitor research generated from your saved ideas."
            href="/competitor"
            buttonLabel="Generate competitor"
            icon={ShieldCheck}
            items={data.competitors}
            onOpenItem={(competitor) => setSelectedItem({ type: "competitor", item: competitor })}
            renderItem={(competitor) => (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">Competitor Analysis #{competitor.id}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(competitor.created_at)}</p>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{competitor.market_gap}</p>
              </div>
            )}
          />

          <SavedSection
            id="mvps"
            title="Saved MVP Plans"
            description="MVP plans generated from your saved analyses."
            href="/mvp-planner"
            buttonLabel="Generate MVP"
            icon={Boxes}
            items={data.mvps}
            onOpenItem={(mvp) => setSelectedItem({ type: "mvp", item: mvp })}
            renderItem={(mvp) => (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">MVP Plan #{mvp.id}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(mvp.created_at)}</p>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{mvp.mvp_summary}</p>
              </div>
            )}
          />
        </div>
      ) : null}

      {selectedItem ? (
        <div className="fixed inset-0 z-[9999] grid h-dvh w-screen place-items-center overflow-hidden bg-black/70 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex h-full max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Saved details</p>
                <h2 className="mt-2 line-clamp-2 text-2xl font-bold text-foreground">{getSelectedTitle(selectedItem)}</h2>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                  onClick={handleExportSelectedPdf}
                  isLoading={isExporting}
                  loadingText="Exporting..."
                >
                  <Download className="size-4" aria-hidden />
                  Export PDF
                </Button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/40 text-muted-foreground transition hover:border-primary/35 hover:text-foreground"
                  aria-label="Close saved details"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
            </div>
            <div className="saved-details-scroll min-h-0 flex-1 overflow-y-scroll overscroll-contain p-5 pr-3 sm:pr-4">
              <SavedItemDetails selected={selectedItem} />
            </div>
          </div>
        </div>
      ) : null}
    </WorkspaceShell>
  );
}
