import json
import re

from app.config import settings


MVP_DEFAULTS = {
    "mvp_summary": "",
    "core_features": [],
    "excluded_features": [],
    "recommended_tech_stack": [],
    "development_phases": [],
    "timeline": "",
    "required_team": [],
    "budget_considerations": "",
    "launch_checklist": [],
    "success_metrics": [],
}

LIST_FIELDS = {
    "core_features",
    "excluded_features",
    "recommended_tech_stack",
    "development_phases",
    "required_team",
    "launch_checklist",
    "success_metrics",
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


MVP_SYSTEM_PROMPT = """
You are LaunchMind AI, a practical MVP product planning consultant.

Generate a realistic MVP development plan from the saved startup analysis.
Return ONLY valid JSON.
Do not use markdown.
Do not include any text outside the JSON object.

The JSON object must contain exactly these fields:
mvp_summary, core_features, excluded_features, recommended_tech_stack,
development_phases, timeline, required_team, budget_considerations,
launch_checklist, success_metrics.

Use arrays of short strings for core_features, excluded_features,
recommended_tech_stack, development_phases, required_team, launch_checklist,
and success_metrics. Use strings for mvp_summary, timeline, and
budget_considerations.

Style rules:
- Use a practical product planning tone.
- Keep it beginner-founder friendly.
- Focus on the first usable version.
- Avoid over-engineering.
- Do not use hype language.
- Do not use fake numbers.
- Do not make exaggerated claims.
- Use lean MVP wording, phased rollout, and practical startup constraints.
- Keep financial recommendations lightweight, student/startup realistic, and
  bootstrap-friendly.
- Do not suggest exact investor funding needs, aggressive growth projections,
  fake conversion targets, or unrealistic scaling assumptions.
- Do not mention seed funding unless the saved analysis explicitly asks for it.
- If funding is discussed, say: initial development budget depends on team size,
  hosting costs, and API usage.
- Never write $150k-$200k seed or similar large seed funding assumptions.
- Recommended tech stack must align with the current LaunchMind project stack:
  FastAPI backend, JWT authentication, SQLite or PostgreSQL compatible database,
  OpenRouter integration, and React or Next.js frontend.
- Never suggest Node.js or Express for the backend because FastAPI already
  exists in this project.
- Use cautious wording such as may, could, should start with, requires testing,
  and can be added later.
- Clearly separate core MVP features from excluded future features.
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
            "AI MVP response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        )

    try:
        return json.loads(cleaned_text[start : end + 1])
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI MVP response invalid: expected valid JSON object. "
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
    cleaned_text = re.sub(
        r"\$150k\s*-\s*\$200k\s*seed",
        "initial development budget depends on team size, hosting costs, and API usage",
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = re.sub(
        r"Node\.?js\s*/\s*Express backend",
        "FastAPI backend",
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = re.sub(
        r"Express backend",
        "FastAPI backend",
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = re.sub(
        r"Node\.?js backend",
        "FastAPI backend",
        cleaned_text,
        flags=re.IGNORECASE,
    )

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


def normalize_mvp_plan(data: dict) -> dict:
    normalized = MVP_DEFAULTS.copy()

    for key, default_value in MVP_DEFAULTS.items():
        value = data.get(key, default_value)

        if key in LIST_FIELDS:
            if not isinstance(value, list):
                value = []

            cleaned_items = []

            for item in value:
                cleaned_item = clean_text(item)

                if cleaned_item:
                    cleaned_items.append(cleaned_item)

            normalized[key] = cleaned_items
        else:
            if not isinstance(value, str):
                value = str(value)

            normalized[key] = clean_text(value)

    return normalized


def build_mvp_prompt(analysis) -> str:
    analysis_context = {
        "idea": analysis.idea,
        "industry": analysis.industry,
        "target_audience": analysis.target_audience,
        "startup_names": parse_list(analysis.startup_names),
        "one_line_pitch": analysis.one_line_pitch,
        "problem_statement": analysis.problem_statement,
        "proposed_solution": analysis.proposed_solution,
        "target_market": analysis.target_market,
        "technical_feasibility": analysis.technical_feasibility,
        "financial_feasibility": analysis.financial_feasibility,
        "operational_feasibility": analysis.operational_feasibility,
        "risk_assessment": parse_list(analysis.risk_assessment),
        "revenue_model": parse_list(analysis.revenue_model),
        "launch_roadmap": parse_list(analysis.launch_roadmap),
        "final_recommendation": analysis.final_recommendation,
    }

    return f"""
Use this saved analysis as the source context:
{json.dumps(analysis_context, indent=2)}

Current LaunchMind architecture context:
- Backend: FastAPI
- Authentication: JWT
- Database: SQLite now, PostgreSQL compatible later
- AI provider: OpenRouter
- Preferred frontend: React or Next.js

Generate an MVP plan using this exact JSON shape:
{json.dumps(MVP_DEFAULTS, indent=2)}

Keep the plan focused on the smallest useful version that can test the main
idea with real users. Features that are not needed for the first test should go
in excluded_features.
The recommended_tech_stack must fit the current architecture. Do not recommend
Node.js or Express for the backend.
"""


def generate_mvp_plan(analysis) -> dict:
    client = get_openrouter_client()

    try:
        completion = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": MVP_SYSTEM_PROMPT},
                {"role": "user", "content": build_mvp_prompt(analysis)},
            ],
        )
    except Exception as error:
        raise ValueError(f"OpenRouter MVP request failed: {error}") from error

    response_text = completion.choices[0].message.content

    if not response_text:
        raise ValueError("AI MVP response invalid: empty response")

    mvp_data = extract_json_from_text(response_text)

    return normalize_mvp_plan(mvp_data)
