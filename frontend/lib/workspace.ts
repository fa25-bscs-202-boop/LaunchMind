import { apiRequest } from "./api";

export type Analysis = {
  id: number;
  idea: string;
  industry: string | null;
  target_audience: string | null;
  one_line_pitch: string;
  final_recommendation: string;
  startup_names: string[];
  created_at: string;
};

export type Report = {
  id: number;
  analysis_id: number;
  title: string;
  executive_summary: string;
  recommendations: string;
  conclusion: string;
  created_at: string;
};

export type PitchDeck = {
  id: number;
  analysis_id: number;
  startup_name: string;
  elevator_pitch: string;
  go_to_market_strategy: string;
  closing_statement: string;
  created_at: string;
};

export type SwotAnalysis = {
  id: number;
  analysis_id: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategic_recommendations: string[];
  created_at: string;
};

export type CompetitorAnalysis = {
  id: number;
  analysis_id: number;
  direct_competitors: string[];
  indirect_competitors: string[];
  market_gap: string;
  differentiation_strategy: string;
  recommendations: string;
  created_at: string;
};

export type MvpPlan = {
  id: number;
  analysis_id: number;
  mvp_summary: string;
  core_features: string[];
  timeline: string;
  success_metrics: string[];
  created_at: string;
};

export type CreateAnalysisInput = {
  idea: string;
  industry?: string;
  target_audience?: string;
};

export async function getAnalyses() {
  return apiRequest<Analysis[]>("/analyses", { method: "GET" });
}

export async function createAnalysis(input: CreateAnalysisInput) {
  return apiRequest<Analysis>("/ideas/analyze", {
    method: "POST",
    body: JSON.stringify(input),
    timeoutMs: 45000,
  });
}

export async function generateReport(analysisId: number) {
  return apiRequest<Report>(`/reports/generate/${analysisId}`, {
    method: "POST",
    timeoutMs: 45000,
  });
}

export async function generatePitchDeck(analysisId: number) {
  return apiRequest<PitchDeck>(`/pitch/generate/${analysisId}`, {
    method: "POST",
    timeoutMs: 45000,
  });
}

export async function generateSwotAnalysis(analysisId: number) {
  return apiRequest<SwotAnalysis>(`/swot/generate/${analysisId}`, {
    method: "POST",
    timeoutMs: 45000,
  });
}

export async function generateCompetitorAnalysis(analysisId: number) {
  return apiRequest<CompetitorAnalysis>(`/competitors/analyze/${analysisId}`, {
    method: "POST",
    timeoutMs: 45000,
  });
}

export async function generateMvpPlan(analysisId: number) {
  return apiRequest<MvpPlan>(`/mvp/generate/${analysisId}`, {
    method: "POST",
    timeoutMs: 45000,
  });
}
