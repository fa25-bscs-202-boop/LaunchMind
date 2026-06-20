import json
import re

from app.config import settings


COMPETITOR_DEFAULTS = {
    "direct_competitors": [],
    "indirect_competitors": [],
    "competitor_strengths": "",
    "competitor_weaknesses": "",
    "market_gap": "",
    "differentiation_strategy": "",
    "pricing_comparison": "",
    "recommendations": "",
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


COMPETITOR_SYSTEM_PROMPT = """
You are LaunchMind AI, a practical startup market research consultant.

Generate realistic competitor research from the saved startup analysis.
Return ONLY valid JSON.
Do not use markdown.
Do not include any text outside the JSON object.

The JSON object must contain exactly these fields:
direct_competitors, indirect_competitors, competitor_strengths,
competitor_weaknesses, market_gap, differentiation_strategy,
pricing_comparison, recommendations.

Use arrays of strings for direct_competitors and indirect_competitors.
Use strings for every other field.

Strict rules:
- Use realistic competitors and practical positioning.
- If specific competitor names are uncertain, describe competitor categories
  instead of inventing unsupported company claims.
- Do not use fake market statistics.
- Do not make billion-dollar claims.
- Do not use hype language.
- Do not say revolutionary, game-changing, world-class, massive market, or
  disruptive.
- Do not make unsupported claims about competitors.
- Use cautious wording such as may, could, appears to, requires validation, and
  further research is needed.
- Keep a feasibility-report tone.
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
            "AI competitor response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        )

    try:
        return json.loads(cleaned_text[start : end + 1])
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI competitor response invalid: expected valid JSON object. "
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


def normalize_competitor_analysis(data: dict) -> dict:
    normalized = COMPETITOR_DEFAULTS.copy()

    for key, default_value in COMPETITOR_DEFAULTS.items():
        value = data.get(key, default_value)

        if isinstance(default_value, list):
            if not isinstance(value, list):
                value = []
            value = [clean_text(item) for item in value if clean_text(item)]

        if isinstance(default_value, str):
            if not isinstance(value, str):
                value = str(value)
            value = clean_text(value)

        normalized[key] = value

    return normalized


def build_fallback_competitor_analysis(analysis) -> dict:
    industry = clean_text(analysis.industry or "the selected market")

    return normalize_competitor_analysis(
        {
            "direct_competitors": [
                f"Existing online providers in {industry}",
                "Small local or niche providers serving the same customer need",
                "New startups or simple tools focused on the same problem",
            ],
            "indirect_competitors": [
                "Manual workflows such as spreadsheets, notes, or messaging apps",
                "Informal service providers or social media sellers",
                "General-purpose platforms that customers may already use",
            ],
            "competitor_strengths": (
                "Existing alternatives may already have customer trust, lower switching friction, or familiar workflows."
            ),
            "competitor_weaknesses": (
                "Many alternatives may be too broad, informal, inconsistent, or not focused on the exact target audience."
            ),
            "market_gap": analysis.market_feasibility,
            "differentiation_strategy": (
                "Differentiate through a narrower customer focus, clearer user experience, reliable support, and a practical first offer."
            ),
            "pricing_comparison": (
                "Pricing should be tested against simple existing alternatives. Exact competitor pricing requires further market research."
            ),
            "recommendations": (
                "Validate competitor categories through customer interviews, compare real alternatives users mention, and test positioning before launch."
            ),
        }
    )


def build_competitor_prompt(analysis) -> str:
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
        "final_recommendation": analysis.final_recommendation,
    }

    return f"""
Use this saved analysis as the source context:
{json.dumps(analysis_context, indent=2)}

Generate competitor research using this exact JSON shape:
{json.dumps(COMPETITOR_DEFAULTS, indent=2)}

Focus on realistic alternatives users may compare against. If exact competitors
are uncertain, use careful category descriptions such as local providers,
manual workflows, existing SaaS tools, spreadsheets, agencies, or informal
substitutes.
"""


def generate_competitor_analysis(analysis) -> dict:
    try:
        client = get_openrouter_client()
    except ValueError as error:
        print(f"Competitor fallback used: {error}")
        return build_fallback_competitor_analysis(analysis)

    try:
        completion = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": COMPETITOR_SYSTEM_PROMPT},
                {"role": "user", "content": build_competitor_prompt(analysis)},
            ],
        )
    except Exception as error:
        print(f"OpenRouter competitor request failed: {error}")
        return build_fallback_competitor_analysis(analysis)

    response_text = completion.choices[0].message.content

    if not response_text:
        print("AI competitor response invalid: empty response")
        return build_fallback_competitor_analysis(analysis)

    try:
        competitor_data = extract_json_from_text(response_text)
    except ValueError as error:
        print(error)
        return build_fallback_competitor_analysis(analysis)

    return normalize_competitor_analysis(competitor_data)
