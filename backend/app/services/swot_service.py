import json
import re

from app.config import settings


SWOT_DEFAULTS = {
    "strengths": [],
    "weaknesses": [],
    "opportunities": [],
    "threats": [],
    "strategic_recommendations": [],
}

HYPE_PHRASES = [
    "game changing",
    "game-changing",
    "revolutionary",
    "disruptive",
    "world-class",
    "massive market",
    "billion-dollar",
    "cutting-edge",
    "next-generation",
]


SWOT_SYSTEM_PROMPT = """
You are LaunchMind AI, a practical business feasibility consultant.

Generate a structured SWOT analysis from the saved startup analysis.
Return ONLY valid JSON.
Do not use markdown.
Do not include any text outside the JSON object.

The JSON object must contain exactly these fields:
strengths, weaknesses, opportunities, threats, strategic_recommendations.

Every field must be an array of short, useful bullet-point strings.

Style rules:
- Use a practical business tone.
- Use clear feasibility-report language.
- Keep points short and useful.
- Do not use fake numbers.
- Do not use hype language.
- Do not make exaggerated claims.
- Use cautious wording such as may, could, requires validation, and further
  research is needed.
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
        raise ValueError("OPENROUTER_API_KEY is not configured")

    try:
        from openai import OpenAI
    except ModuleNotFoundError as error:
        raise ValueError(
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
        raise ValueError(
            "AI SWOT response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        )

    try:
        return json.loads(cleaned_text[start : end + 1])
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI SWOT response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        ) from error


def clean_text(text: str) -> str:
    cleaned_text = str(text or "")
    cleaned_text = cleaned_text.replace("—", ",")
    cleaned_text = cleaned_text.replace("–", ",")
    cleaned_text = cleaned_text.replace("�", ",")
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


def normalize_swot_analysis(data: dict) -> dict:
    normalized = SWOT_DEFAULTS.copy()

    for key in SWOT_DEFAULTS:
        value = data.get(key, [])

        if not isinstance(value, list):
            value = []

        cleaned_items = []

        for item in value:
            cleaned_item = clean_text(item)

            if cleaned_item:
                cleaned_items.append(cleaned_item)

        normalized[key] = cleaned_items

    return normalized


def build_swot_prompt(analysis) -> str:
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

Generate SWOT analysis using this exact JSON shape:
{json.dumps(SWOT_DEFAULTS, indent=2)}

Focus on realistic internal strengths and weaknesses, external opportunities
and threats, and practical strategic recommendations.
"""


def generate_swot_analysis(analysis) -> dict:
    client = get_openrouter_client()

    try:
        completion = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": SWOT_SYSTEM_PROMPT},
                {"role": "user", "content": build_swot_prompt(analysis)},
            ],
        )
    except Exception as error:
        raise ValueError(f"OpenRouter SWOT request failed: {error}") from error

    response_text = completion.choices[0].message.content

    if not response_text:
        raise ValueError("AI SWOT response invalid: empty response")

    swot_data = extract_json_from_text(response_text)

    return normalize_swot_analysis(swot_data)
