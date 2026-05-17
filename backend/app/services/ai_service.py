import json
import re

from app.config import settings


IDEA_ANALYSIS_SYSTEM_PROMPT = """
You are LaunchMind AI, a practical feasibility consultant writing realistic
university-level business reports. Your job is to assess startup ideas in a
clear, balanced, and believable way.

Return ONLY a raw JSON object.
Do not use markdown.
Do not use ```json.
Do not use code fences.
Do not explain anything outside JSON.

Writing rules:
- Use simple professional English.
- Avoid hype language.
- Avoid exaggerated startup jargon.
- Avoid fake statistics unless they are explicitly known from the user input.
- Avoid em dashes.
- Avoid corporate buzzwords.
- Keep explanations practical and believable.
- Write like a real consultant, not a marketer.
- Use short and medium-length paragraphs.
- Avoid repetitive sentence structures.
- Avoid sounding like ChatGPT.
- Keep the tone realistic, practical, slightly academic, and suitable for a
  university feasibility report or class presentation.

Do not use these phrases:
game changing, revolutionary, disruptive, projected to exceed,
billion-dollar opportunity, massive market, cutting-edge, next-generation,
world-class.

The JSON object must include exactly these keys:
startup_names, one_line_pitch, problem_statement, proposed_solution,
target_market, market_feasibility, technical_feasibility,
financial_feasibility, operational_feasibility, legal_feasibility,
risk_assessment, revenue_model, launch_roadmap, final_recommendation.

Use arrays of strings for startup_names, risk_assessment, revenue_model,
and launch_roadmap. Use strings for every other field.
"""


IDEA_ANALYSIS_DEFAULTS = {
    "startup_names": [],
    "one_line_pitch": "",
    "problem_statement": "",
    "proposed_solution": "",
    "target_market": "",
    "market_feasibility": "",
    "technical_feasibility": "",
    "financial_feasibility": "",
    "operational_feasibility": "",
    "legal_feasibility": "",
    "risk_assessment": [],
    "revenue_model": [],
    "launch_roadmap": [],
    "final_recommendation": "",
}


HYPE_PHRASES = [
    "game changing",
    "game-changing",
    "revolutionary",
    "disruptive",
    "projected to exceed",
    "billion-dollar opportunity",
    "massive market",
    "cutting-edge",
    "next-generation",
    "world-class",
]


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
            "AI response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        )

    try:
        return json.loads(cleaned_text[start : end + 1])
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        ) from error


def clean_ai_text(text: str) -> str:
    cleaned_text = str(text)
    cleaned_text = cleaned_text.replace("—", ",")
    cleaned_text = cleaned_text.replace("–", ",")
    cleaned_text = cleaned_text.replace("�", ",")
    cleaned_text = cleaned_text.replace("```json", "")
    cleaned_text = cleaned_text.replace("```JSON", "")
    cleaned_text = cleaned_text.replace("```", "")
    cleaned_text = cleaned_text.replace("**", "")
    cleaned_text = cleaned_text.replace("__", "")
    cleaned_text = cleaned_text.replace("As an AI language model,", "")
    cleaned_text = cleaned_text.replace("As an AI,", "")
    cleaned_text = cleaned_text.replace("It is important to note that", "Note that")

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

    return cleaned_text.strip()


def normalize_analysis(data: dict) -> dict:
    normalized = IDEA_ANALYSIS_DEFAULTS.copy()

    for key, default_value in IDEA_ANALYSIS_DEFAULTS.items():
        value = data.get(key, default_value)

        if isinstance(default_value, list):
            if not isinstance(value, list):
                value = []
            cleaned_items = []

            for item in value:
                cleaned_item = clean_ai_text(item)

                if cleaned_item:
                    cleaned_items.append(cleaned_item)

            value = cleaned_items

        if isinstance(default_value, str):
            if not isinstance(value, str):
                value = ""
            value = clean_ai_text(value)

        normalized[key] = value

    return normalized


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


def test_ai_connection(prompt: str) -> str:
    client = get_openrouter_client()

    completion = client.chat.completions.create(
        model=settings.OPENROUTER_MODEL,
        messages=[
            {"role": "user", "content": prompt},
        ],
    )

    return completion.choices[0].message.content or ""


def analyze_startup_idea(
    idea: str,
    industry: str | None,
    target_audience: str | None,
) -> dict:
    client = get_openrouter_client()

    user_prompt = f"""
Analyze this startup idea:

Idea:
{idea}

Industry:
{industry or "Not provided"}

Target audience:
{target_audience or "Not provided"}

Return the analysis using this exact JSON shape:
{json.dumps(IDEA_ANALYSIS_DEFAULTS, indent=2)}
"""

    try:
        completion = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": IDEA_ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        )
    except Exception as error:
        raise ValueError(f"OpenRouter request failed: {error}") from error

    response_text = completion.choices[0].message.content

    if not response_text:
        raise ValueError("AI response invalid: empty response")

    analysis = extract_json_from_text(response_text)

    return normalize_analysis(analysis)
