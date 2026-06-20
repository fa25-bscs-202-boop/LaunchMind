import json
import re

from app.config import settings


PITCH_DEFAULTS = {
    "startup_name": "",
    "elevator_pitch": "",
    "problem": "",
    "solution": "",
    "target_market": "",
    "business_model": "",
    "competitor_landscape": "",
    "go_to_market_strategy": "",
    "revenue_model": "",
    "mvp_summary": "",
    "traction_strategy": "",
    "funding_needs": "",
    "future_roadmap": "",
    "closing_statement": "",
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


PITCH_SYSTEM_PROMPT = """
You are LaunchMind AI, a practical startup pitch deck writer.

Generate a realistic investor-style pitch deck from the saved startup analysis.
Return ONLY valid JSON.
Do not use markdown.
Do not include any text outside the JSON object.

The JSON object must contain exactly these string fields:
startup_name, elevator_pitch, problem, solution, target_market, business_model,
competitor_landscape, go_to_market_strategy, revenue_model, mvp_summary,
traction_strategy, funding_needs, future_roadmap, closing_statement.

Style rules:
- Use an investor presentation tone.
- Keep writing concise and slide-friendly.
- Use simple professional English.
- Do not use fake numbers.
- Do not use hype language.
- Do not say revolutionary, billion-dollar, world-class, game-changing, or
  cutting-edge.
- Keep a practical startup tone.
- If market size, funding, or traction is unknown, say it requires validation
  rather than inventing numbers.
- Funding needs should stay realistic and should not include exact funding amounts unless explicitly provided in the saved analysis.
- If funding is uncertain, say: Initial funding should be estimated after confirming vehicle, staffing, technology, and operational costs.
- Do not invent exact market size, user count, funding amount, paid user target,
  or timeline unless provided by the user.
- Replace unsupported numbers with cautious wording.
- Bad: 30 million potential users. Good: a broad audience of students,
  freelancers, and early founders.
- Bad: Seed round of $500k. Good: Initial funding should be estimated after confirming vehicle, staffing, technology, and operational costs.
- Bad: 5k paid users. Good: early traction should be measured through beta
  users, feedback, and conversion interest.
- Keep the output concise and slide-friendly.
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
            "AI pitch response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        )

    try:
        return json.loads(cleaned_text[start : end + 1])
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI pitch response invalid: expected valid JSON object. "
            f"Raw response starts with: {raw_preview}"
        ) from error

def clean_text(text: str) -> str:
    cleaned_text = str(text or "")
    cleaned_text = cleaned_text.replace(",including", ", including")
    cleaned_text = cleaned_text.replace(",within", ", within")
    cleaned_text = cleaned_text.replace("AIâ€‘powered", "AI-powered")
    cleaned_text = cleaned_text.replace("AIâ€powered", "AI-powered")
    cleaned_text = cleaned_text.replace("AIâ€“powered", "AI-powered")
    cleaned_text = cleaned_text.replace("AIâ€”powered", "AI-powered")
    cleaned_text = re.sub(
        r"\bAI\s*[,?]\s*powered\b",
        "AI-powered",
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = cleaned_text.replace("â€‘", "-")
    cleaned_text = cleaned_text.replace("â€", "-")
    cleaned_text = cleaned_text.replace("â€’", "-")
    cleaned_text = cleaned_text.replace("âˆ’", "-")
    cleaned_text = cleaned_text.replace("â€”", ",")
    cleaned_text = cleaned_text.replace("â€“", ",")
    cleaned_text = cleaned_text.replace("ï¿½", ",")
    cleaned_text = cleaned_text.replace("**", "")
    cleaned_text = cleaned_text.replace("__", "")
    cleaned_text = cleaned_text.replace("```", "")

    funding_sentence = (
        "Initial funding should be estimated after confirming vehicle, staffing, "
        "technology, and operational costs"
    )

    cleaned_text = cleaned_text.replace("scopeper", "scope per")
    cleaned_text = re.sub(
        r"initial funding depends on team size, API usage, and launch scope(?:\s*per\s+seat)?",
        funding_sentence,
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = re.sub(
        r"estimated around\s+" + re.escape(funding_sentence) + r"\s*,000",
        funding_sentence,
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = re.sub(
        r"(?<!\d),000\b",
        "",
        cleaned_text,
    )
    cleaned_text = re.sub(r",(?=\S)", ", ", cleaned_text)

    cleaned_text = re.sub(
        r"\b\d+(\.\d+)?\s*(million|billion|thousand|k)\s+potential users\b",
        "a broad audience of students, freelancers, and early founders",
        cleaned_text,
        flags=re.IGNORECASE,
    )
    cleaned_text = re.sub(
        r"\b\d+(\.\d+)?\s*(k|thousand)?\s*paid users\b",
        "early traction should be measured through beta users, feedback, and conversion interest",
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
    cleaned_text = re.sub(r"\?\s+(and|or)\b", " ", cleaned_text, flags=re.IGNORECASE)
    cleaned_text = re.sub(r",\s*,+", ",", cleaned_text)
    cleaned_text = re.sub(r"([,.!?;:]){2,}", r"\1", cleaned_text)
    cleaned_text = re.sub(r"\s+(and|or)\s*$", "", cleaned_text, flags=re.IGNORECASE)
    cleaned_text = re.sub(
        re.escape(funding_sentence) + r"(?:[,.]?\s*" + re.escape(funding_sentence) + r")+",
        funding_sentence,
        cleaned_text,
        flags=re.IGNORECASE,
    )

    return cleaned_text.strip(" ,")

def normalize_pitch_deck(data: dict) -> dict:
    normalized = PITCH_DEFAULTS.copy()

    for key in PITCH_DEFAULTS:
        value = data.get(key, "")

        if not isinstance(value, str):
            value = str(value)

        normalized[key] = clean_text(value)

    return normalized


def build_fallback_pitch_deck(analysis) -> dict:
    startup_names = parse_list(analysis.startup_names)
    startup_name = startup_names[0] if startup_names else "Startup Concept"
    revenue_items = parse_list(analysis.revenue_model)
    roadmap_items = parse_list(analysis.launch_roadmap)

    return normalize_pitch_deck(
        {
            "startup_name": startup_name,
            "elevator_pitch": analysis.one_line_pitch,
            "problem": analysis.problem_statement,
            "solution": analysis.proposed_solution,
            "target_market": analysis.target_market,
            "business_model": (
                "The business model should start with a simple paid offer, package, or subscription that can be tested with early users."
            ),
            "competitor_landscape": (
                "Customers may compare this idea with existing online tools, manual workflows, local providers, or informal alternatives. "
                "Specific competitor claims require further validation."
            ),
            "go_to_market_strategy": (
                "Start with a narrow audience, test messaging through direct outreach or a landing page, and use early feedback before wider promotion."
            ),
            "revenue_model": " ".join(revenue_items) or "Revenue should be tested through a simple pricing model before expanding plans.",
            "mvp_summary": (
                "The MVP should focus on the smallest usable version that demonstrates the core solution and collects user feedback."
            ),
            "traction_strategy": (
                "Early traction should be measured through interviews, pilot users, signups, repeat usage, and willingness to pay."
            ),
            "funding_needs": (
                "Initial funding should be estimated after confirming development, staffing, technology, and operational costs."
            ),
            "future_roadmap": " ".join(roadmap_items) or "Expand features only after the first pilot validates customer demand.",
            "closing_statement": analysis.final_recommendation,
        }
    )


def build_pitch_prompt(analysis) -> str:
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
        "financial_feasibility": analysis.financial_feasibility,
        "risk_assessment": parse_list(analysis.risk_assessment),
        "revenue_model": parse_list(analysis.revenue_model),
        "launch_roadmap": parse_list(analysis.launch_roadmap),
        "final_recommendation": analysis.final_recommendation,
    }

    return f"""
Use this saved analysis as the source context:
{json.dumps(analysis_context, indent=2)}

Generate a pitch deck using this exact JSON shape:
{json.dumps(PITCH_DEFAULTS, indent=2)}

Make each field concise and presentation-ready. Do not invent traction,
funding, market size, paid user targets, timelines, or competitor facts. Use
cautious wording where evidence is missing.
"""


def generate_pitch_deck(analysis) -> dict:
    try:
        client = get_openrouter_client()
    except ValueError as error:
        print(f"Pitch fallback used: {error}")
        return build_fallback_pitch_deck(analysis)

    try:
        completion = client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": PITCH_SYSTEM_PROMPT},
                {"role": "user", "content": build_pitch_prompt(analysis)},
            ],
        )
    except Exception as error:
        print(f"OpenRouter pitch request failed: {error}")
        return build_fallback_pitch_deck(analysis)

    response_text = completion.choices[0].message.content

    if not response_text:
        print("AI pitch response invalid: empty response")
        return build_fallback_pitch_deck(analysis)

    try:
        pitch_data = extract_json_from_text(response_text)
    except ValueError as error:
        print(error)
        return build_fallback_pitch_deck(analysis)

    return normalize_pitch_deck(pitch_data)

