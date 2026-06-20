import { apiRequest } from "./api";

export type Analysis = {
  id: number;
  user_id?: number;
  project_id?: number | null;
  idea: string;
  industry: string | null;
  target_audience: string | null;
  one_line_pitch: string;
  problem_statement: string;
  proposed_solution: string;
  target_market: string;
  market_feasibility: string;
  technical_feasibility: string;
  financial_feasibility: string;
  operational_feasibility: string;
  legal_feasibility: string;
  risk_assessment: string[];
  revenue_model: string[];
  launch_roadmap: string[];
  final_recommendation: string;
  startup_names: string[];
  created_at: string;
};

export type Report = {
  id: number;
  user_id?: number;
  analysis_id: number;
  title: string;
  executive_summary: string;
  introduction: string;
  problem_statement: string;
  objectives: string;
  scope: string;
  methodology: string;
  market_feasibility: string;
  technical_feasibility: string;
  operational_feasibility: string;
  financial_feasibility: string;
  legal_considerations: string;
  risk_assessment: string;
  findings: string;
  recommendations: string;
  conclusion: string;
  created_at: string;
};

export type PitchDeck = {
  id: number;
  user_id?: number;
  analysis_id: number;
  startup_name: string;
  elevator_pitch: string;
  problem: string;
  solution: string;
  target_market: string;
  business_model: string;
  competitor_landscape: string;
  go_to_market_strategy: string;
  revenue_model: string;
  mvp_summary: string;
  traction_strategy: string;
  funding_needs: string;
  future_roadmap: string;
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
  user_id?: number;
  analysis_id: number;
  direct_competitors: string[];
  indirect_competitors: string[];
  competitor_strengths: string;
  competitor_weaknesses: string;
  market_gap: string;
  differentiation_strategy: string;
  pricing_comparison: string;
  recommendations: string;
  created_at: string;
};

export type MvpPlan = {
  id: number;
  user_id?: number;
  analysis_id: number;
  mvp_summary: string;
  core_features: string[];
  excluded_features: string[];
  recommended_tech_stack: string[];
  development_phases: string[];
  timeline: string;
  required_team: string[];
  budget_considerations: string;
  launch_checklist: string[];
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

export async function getReports() {
  return apiRequest<Report[]>("/reports", { method: "GET" });
}

export async function getPitchDecks() {
  return apiRequest<PitchDeck[]>("/pitch", { method: "GET" });
}

export async function getSwotAnalyses() {
  return apiRequest<SwotAnalysis[]>("/swot", { method: "GET" });
}

export async function getCompetitorAnalyses() {
  return apiRequest<CompetitorAnalysis[]>("/competitors", { method: "GET" });
}

export async function getMvpPlans() {
  return apiRequest<MvpPlan[]>("/mvp", { method: "GET" });
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
