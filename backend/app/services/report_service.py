import json
import re

from app.config import settings

class ReportGenerationUnavailableError(Exception):
    pass


class ReportAIConfigurationError(Exception):
    pass


class ReportInvalidResponseError(Exception):
    pass

REPORT_DEFAULTS = {
    "title": "",
    "executive_summary": "",
    "introduction": "",
    "problem_statement": "",
    "objectives": "",
    "scope": "",
    "methodology": "",
    "market_feasibility": "",
    "technical_feasibility": "",
    "operational_feasibility": "",
    "financial_feasibility": "",
    "legal_considerations": "",
    "risk_assessment": "",
    "findings": "",
    "recommendations": "",
    "conclusion": "",
}

HYPE_PHRASES = [
    "game changing",
    "game-changing",
    "revolutionary",
    "disruptive",
    "world-class",
    "projected to exceed",
    "billion-dollar opportunity",
    "massive market",
    "cutting-edge",
    "next-generation",
]


REPORT_SYSTEM_PROMPT = """
You are LaunchMind AI, a practical feasibility report writer.
Write like a smart university student and business consultant.

Create a complete feasibility report from the saved analysis context.
Return ONLY valid JSON.
Do not use markdown.
Do not include any text outside the JSON object.

The JSON object must contain exactly these string fields:
title, executive_summary, introduction, problem_statement, objectives, scope,
methodology, market_feasibility, technical_feasibility,
operational_feasibility, financial_feasibility, legal_considerations,
risk_assessment, findings, recommendations, conclusion.

Writing rules:
- Use realistic university feasibility report tone.
- Use simple professional English.
- Avoid em dashes.
- Avoid robotic repeated phrases.
- Avoid hype language and startup marketing language.
- Do not invent exact market sizes, user counts, valuations, funding
  requirements, revenue, profit, or growth percentages unless the user provided
  them in the saved analysis.
- Do not repeat unsupported statistics from the saved analysis. Rewrite them
  cautiously instead.
- If exact data is unknown, use phrases such as further market research is
  needed, initial estimates suggest, exact figures require validation, and
  small-scale pilot testing is recommended.
- Do not say commercially promising, aggressive acquisition plan, healthy gross
  margin, discernible need, projected growth, market capture, billion-dollar,
  scalable opportunity, projected to exceed, massive market, revolutionary,
  disruptive, world-class, game-changing, or cutting-edge.
- Prefer practical, cautious, evidence-based, academic, and realistic wording.
- Market feasibility should focus on likely demand, target audience behavior,
  adoption possibility, and the need for validation. Do not use fake market
  statistics.
- Financial feasibility should discuss possible development costs, likely
  operational costs, pricing approach, and monetization options without
  inventing large precise numbers. Mention that MVP development cost, monthly
  API or hosting cost, possible subscription pricing, and break-even depend on
  adoption and require validation.
- Recommendations should focus on next practical steps, pilot testing, user
  interviews, phased implementation, and gradual rollout.
- Use cautious wording such as may, could, requires validation, initial estimate,
  exact figures require validation, and further research is needed.
- Keep the report formal, readable, and practical.
"""


def parse_list(value) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value]

    if isinstance(value, str):
        try:
            parsed_value = json.loads(value)
        except json.JSONDecodeError:
            return []

        if isinstance(parsed_value, list):
            return [str(item) for item in parsed_value]

    return []


def get_openrouter_client():
    if not settings.OPENROUTER_API_KEY:
        raise ReportAIConfigurationError("OPENROUTER_API_KEY is not configured")

    try:
        from openai import OpenAI
    except ModuleNotFoundError as error:
        raise ReportAIConfigurationError(
            "OpenAI SDK is not installed. Run pip install -r requirements.txt"
        ) from error

    return OpenAI(
        base_url=settings.OPENROUTER_BASE_URL,
        api_key=settings.OPENROUTER_API_KEY,
    )


def extract_json_from_text(text: str) -> dict:
    cleaned_text = text.strip()
    cleaned_text = cleaned_text.replace("```json", "")
    cleaned_text = cleaned_text.replace("```JSON", "")
    cleaned_text = cleaned_text.replace("```", "")
    cleaned_text = cleaned_text.strip()

    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        pass

    start = cleaned_text.find("{")
    end = cleaned_text.rfind("}")
    raw_preview = cleaned_text[:300]

    if start == -1 or end == -1 or start >= end:
        raise ReportInvalidResponseError(
            "AI report response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        )

    try:
        return json.loads(cleaned_text[start : end + 1])
    except json.JSONDecodeError as error:
        raise ReportInvalidResponseError(
            "AI report response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        ) from error


def clean_report_text(text: str) -> str:
    cleaned_text = str(text or "")
    cleaned_text = cleaned_text.replace("â€”", ",")
    cleaned_text = cleaned_text.replace("â€“", ",")
    cleaned_text = cleaned_text.replace("ï¿½", ",")
    cleaned_text = cleaned_text.replace("**", "")
    cleaned_text = cleaned_text.replace("__", "")
    cleaned_text = cleaned_text.replace("```", "")

    for phrase in HYPE_PHRASES:
        cleaned_text = re.sub(
            re.escape(phrase),
            "",
            cleaned_text,
            flags=re.IGNORECASE,
        )

    cleaned_text = re.sub(r"\s+", " ", cleaned_text)
    cleaned_text = re.sub(r"\s+([,.!?;:])", r"\1", cleaned_text)
    cleaned_text = re.sub(r",\s*,+", ",", cleaned_text)
    cleaned_text = re.sub(r"([,.!?;:]){2,}", r"\1", cleaned_text)

    return cleaned_text.strip(" ,")


def normalize_report(data: dict) -> dict:
    normalized = REPORT_DEFAULTS.copy()

    for field in REPORT_DEFAULTS:
        value = data.get(field, "")

        if not isinstance(value, str):
            value = str(value)

        normalized[field] = clean_report_text(value)

    return normalized


def build_report_prompt(analysis) -> str:
    analysis_context = {
        "idea": analysis.idea,
        "industry": analysis.industry,
        "target_audience": analysis.target_audience,
        "startup_names": parse_list(analysis.startup_names),
        "one_line_pitch": analysis.one_line_pitch,
        "problem_statement": analysis.problem_statement,
        "proposed_solution": analysis.proposed_solution,
        "target_market": analysis.target_market,
        "market_feasibility": analysis.market_feasibility,
        "technical_feasibility": analysis.technical_feasibility,
        "financial_feasibility": analysis.financial_feasibility,
        "operational_feasibility": analysis.operational_feasibility,
        "legal_feasibility": analysis.legal_feasibility,
        "risk_assessment": parse_list(analysis.risk_assessment),
        "revenue_model": parse_list(analysis.revenue_model),
        "launch_roadmap": parse_list(analysis.launch_roadmap),
        "final_recommendation": analysis.final_recommendation,
    }

    return f"""
Use this saved analysis as the source context:
{json.dumps(analysis_context, indent=2)}

Write a complete feasibility report using this exact JSON shape:
{json.dumps(REPORT_DEFAULTS, indent=2)}

Do not copy unsupported or exaggerated claims directly. If a claim needs evidence,
rewrite it cautiously and state that further research or validation is needed.
If the saved analysis includes exact figures without clear evidence, do not repeat
those figures. Replace them with cautious wording about validation, pilot testing,
or further market research.
"""


def generate_report_from_analysis(analysis) -> dict:
    client = get_openrouter_client()

    try:
        completion = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": REPORT_SYSTEM_PROMPT},
                {"role": "user", "content": build_report_prompt(analysis)},
            ],
        )
    except Exception as error:
        print(f"OpenRouter report request failed: {error}")
        raise ReportGenerationUnavailableError(
            "OpenRouter report request failed"
        ) from error

    response_text = completion.choices[0].message.content

    if not response_text:
        print("AI report response invalid: empty response")
        raise ReportInvalidResponseError("AI report response invalid: empty response")

    try:
        report_data = extract_json_from_text(response_text)
    except ReportInvalidResponseError as error:
        print(error)
        raise

    return normalize_report(report_data)

