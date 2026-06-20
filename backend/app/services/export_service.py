import html
import json
from datetime import datetime
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


def parse_list(value) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if item]

    if isinstance(value, str):
        try:
            parsed_value = json.loads(value)
        except json.JSONDecodeError:
            return [value] if value.strip() else []

        if isinstance(parsed_value, list):
            return [str(item) for item in parsed_value if item]

    return []


def markdown_list(items: list[str]) -> str:
    if not items:
        return "- Not provided"

    return "\n".join(f"- {item}" for item in items)


def html_list(items: list[str]) -> str:
    if not items:
        return "<ul><li>Not provided</li></ul>"

    list_items = "".join(f"<li>{html.escape(item)}</li>" for item in items)
    return f"<ul>{list_items}</ul>"


def analysis_to_markdown(analysis) -> str:
    return f"""# LaunchMind AI Startup Analysis Report

## Startup Names
{markdown_list(parse_list(analysis.startup_names))}

## One-Line Pitch
{analysis.one_line_pitch}

## Problem Statement
{analysis.problem_statement}

## Proposed Solution
{analysis.proposed_solution}

## Target Market
{analysis.target_market}

## Market Feasibility
{analysis.market_feasibility}

## Technical Feasibility
{analysis.technical_feasibility}

## Financial Feasibility
{analysis.financial_feasibility}

## Operational Feasibility
{analysis.operational_feasibility}

## Legal Feasibility
{analysis.legal_feasibility}

## Risk Assessment
{markdown_list(parse_list(analysis.risk_assessment))}

## Revenue Model
{markdown_list(parse_list(analysis.revenue_model))}

## Launch Roadmap
{markdown_list(parse_list(analysis.launch_roadmap))}

## Final Recommendation
{analysis.final_recommendation}
"""


def html_section(title: str, content: str) -> str:
    return f"""
    <section>
        <h2>{html.escape(title)}</h2>
        <p>{html.escape(content or "Not provided")}</p>
    </section>
    """


def html_list_section(title: str, items: list[str]) -> str:
    return f"""
    <section>
        <h2>{html.escape(title)}</h2>
        {html_list(items)}
    </section>
    """


def analysis_to_html(analysis) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LaunchMind AI Startup Analysis Report</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 40px auto;
            padding: 0 24px;
            color: #1f2937;
        }}
        h1 {{
            color: #111827;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
        }}
        h2 {{
            color: #2563eb;
            margin-top: 28px;
        }}
        section {{
            margin-bottom: 20px;
        }}
        ul {{
            padding-left: 24px;
        }}
    </style>
</head>
<body>
    <h1>LaunchMind AI Startup Analysis Report</h1>
    {html_list_section("Startup Names", parse_list(analysis.startup_names))}
    {html_section("One-Line Pitch", analysis.one_line_pitch)}
    {html_section("Problem Statement", analysis.problem_statement)}
    {html_section("Proposed Solution", analysis.proposed_solution)}
    {html_section("Target Market", analysis.target_market)}
    {html_section("Market Feasibility", analysis.market_feasibility)}
    {html_section("Technical Feasibility", analysis.technical_feasibility)}
    {html_section("Financial Feasibility", analysis.financial_feasibility)}
    {html_section("Operational Feasibility", analysis.operational_feasibility)}
    {html_section("Legal Feasibility", analysis.legal_feasibility)}
    {html_list_section("Risk Assessment", parse_list(analysis.risk_assessment))}
    {html_list_section("Revenue Model", parse_list(analysis.revenue_model))}
    {html_list_section("Launch Roadmap", parse_list(analysis.launch_roadmap))}
    {html_section("Final Recommendation", analysis.final_recommendation)}
</body>
</html>
"""


def pdf_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="DocumentTitle",
            fontName="Times-Bold",
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            spaceAfter=18,
            textColor=colors.HexColor("#111111"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocumentMeta",
            fontName="Times-Roman",
            fontSize=10,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#555555"),
            spaceAfter=20,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            fontName="Times-Bold",
            fontSize=14,
            leading=18,
            spaceBefore=12,
            spaceAfter=8,
            textColor=colors.HexColor("#111111"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyTextClean",
            fontName="Times-Roman",
            fontSize=11,
            leading=16,
            spaceAfter=8,
            textColor=colors.HexColor("#222222"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Footer",
            fontName="Times-Roman",
            fontSize=9,
            alignment=TA_RIGHT,
            textColor=colors.HexColor("#777777"),
        )
    )
    return styles


def clean_pdf_text(value) -> str:
    if value is None:
        return "Not provided."

    replacements = {
        "\u2011": "-",
        "\u2010": "-",
        "\u2012": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2212": "-",
        "\xa0": " ",
        "■": "-",
    }

    text = str(value)
    for original, replacement in replacements.items():
        text = text.replace(original, replacement)

    text = " ".join(text.split())
    return text or "Not provided."


def paragraph(text: str, style):
    safe_text = html.escape(clean_pdf_text(text)).replace("\n", "<br />")
    return Paragraph(safe_text, style)


def bullet_list(items: list[str], styles):
    safe_items = items or ["Not provided."]
    return ListFlowable(
        [
            ListItem(paragraph(item, styles["BodyTextClean"]), leftIndent=12)
            for item in safe_items
        ],
        bulletType="bullet",
        leftIndent=18,
        bulletFontName="Times-Roman",
        bulletFontSize=10,
    )


def add_text_section(story, title: str, content: str, styles):
    story.append(Paragraph(html.escape(clean_pdf_text(title)), styles["SectionTitle"]))
    story.append(paragraph(content, styles["BodyTextClean"]))


def add_list_section(story, title: str, items: list[str], styles):
    story.append(Paragraph(html.escape(clean_pdf_text(title)), styles["SectionTitle"]))
    story.append(bullet_list(items, styles))
    story.append(Spacer(1, 6))


def draw_pdf_frame(canvas, doc, document_type: str):
    canvas.saveState()
    canvas.setFont("Times-Roman", 9)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawString(inch, 0.55 * inch, clean_pdf_text("Generated by LaunchMind AI"))
    canvas.drawRightString(7.5 * inch, 0.55 * inch, clean_pdf_text(f"Page {doc.page}"))
    canvas.setStrokeColor(colors.HexColor("#D4AF37"))
    canvas.setLineWidth(0.5)
    canvas.line(inch, 10.25 * inch, 7.5 * inch, 10.25 * inch)
    canvas.setFont("Times-Bold", 9)
    canvas.drawString(inch, 10.4 * inch, clean_pdf_text("LaunchMind AI"))
    canvas.setFont("Times-Roman", 9)
    canvas.drawRightString(7.5 * inch, 10.4 * inch, clean_pdf_text(document_type))
    canvas.restoreState()


def build_pdf(document_type: str, title: str, sections: list[dict], title_page: bool = False) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=1.1 * inch,
        bottomMargin=0.9 * inch,
        title=clean_pdf_text(title),
    )
    styles = pdf_styles()
    generated_date = datetime.now().strftime("%B %d, %Y")

    story = [
        Paragraph(clean_pdf_text("LaunchMind AI"), styles["DocumentTitle"]),
        Paragraph(html.escape(clean_pdf_text(document_type)), styles["DocumentTitle"]),
        Paragraph(clean_pdf_text(f"Generated date: {generated_date}"), styles["DocumentMeta"]),
    ]

    if title_page:
        story.append(Spacer(1, 1.2 * inch))
        story.append(Paragraph(html.escape(clean_pdf_text(title)), styles["DocumentTitle"]))
        story.append(Paragraph(clean_pdf_text("Prepared as a professional feasibility document."), styles["DocumentMeta"]))
        story.append(PageBreak())
    else:
        story.append(Paragraph(html.escape(clean_pdf_text(title)), styles["SectionTitle"]))
        story.append(Spacer(1, 8))

    for section in sections:
        if section.get("type") == "list":
            add_list_section(story, section["title"], section.get("items", []), styles)
        else:
            add_text_section(story, section["title"], section.get("content", ""), styles)

    doc.build(
        story,
        onFirstPage=lambda canvas, document: draw_pdf_frame(canvas, document, document_type),
        onLaterPages=lambda canvas, document: draw_pdf_frame(canvas, document, document_type),
    )
    buffer.seek(0)
    return buffer.getvalue()


def analysis_to_pdf(analysis) -> bytes:
    sections = [
        {"title": "Startup Names", "type": "list", "items": parse_list(analysis.startup_names)},
        {"title": "One-Line Pitch", "content": analysis.one_line_pitch},
        {"title": "Problem Statement", "content": analysis.problem_statement},
        {"title": "Proposed Solution", "content": analysis.proposed_solution},
        {"title": "Target Market", "content": analysis.target_market},
        {"title": "Market Feasibility", "content": analysis.market_feasibility},
        {"title": "Technical Feasibility", "content": analysis.technical_feasibility},
        {"title": "Financial Feasibility", "content": analysis.financial_feasibility},
        {"title": "Operational Feasibility", "content": analysis.operational_feasibility},
        {"title": "Legal Feasibility", "content": analysis.legal_feasibility},
        {"title": "Risk Assessment", "type": "list", "items": parse_list(analysis.risk_assessment)},
        {"title": "Revenue Model", "type": "list", "items": parse_list(analysis.revenue_model)},
        {"title": "Launch Roadmap", "type": "list", "items": parse_list(analysis.launch_roadmap)},
        {"title": "Final Recommendation", "content": analysis.final_recommendation},
    ]
    return build_pdf("Startup Analysis Report", "LaunchMind AI Startup Analysis", sections)


def report_to_pdf(report) -> bytes:
    sections = [
        {"title": "Executive Summary", "content": report.executive_summary},
        {"title": "Introduction", "content": report.introduction},
        {"title": "Problem Statement", "content": report.problem_statement},
        {"title": "Objectives of the Study", "content": report.objectives},
        {"title": "Scope of Study", "content": report.scope},
        {"title": "Methodology", "content": report.methodology},
        {"title": "Market Feasibility Analysis", "content": report.market_feasibility},
        {"title": "Technical Feasibility Analysis", "content": report.technical_feasibility},
        {"title": "Operational Feasibility Analysis", "content": report.operational_feasibility},
        {"title": "Financial Feasibility Analysis", "content": report.financial_feasibility},
        {"title": "Legal and Regulatory Considerations", "content": report.legal_considerations},
        {"title": "Risk Assessment", "content": report.risk_assessment},
        {"title": "Findings", "content": report.findings},
        {"title": "Recommendations", "content": report.recommendations},
        {"title": "Conclusion", "content": report.conclusion},
    ]
    return build_pdf("Feasibility Report", report.title, sections, title_page=True)


def pitch_to_pdf(pitch) -> bytes:
    sections = [
        {"title": "Elevator Pitch", "content": pitch.elevator_pitch},
        {"title": "Problem", "content": pitch.problem},
        {"title": "Solution", "content": pitch.solution},
        {"title": "Target Market", "content": pitch.target_market},
        {"title": "Business Model", "content": pitch.business_model},
        {"title": "Competitor Landscape", "content": pitch.competitor_landscape},
        {"title": "Go To Market Strategy", "content": pitch.go_to_market_strategy},
        {"title": "Revenue Model", "content": pitch.revenue_model},
        {"title": "MVP Summary", "content": pitch.mvp_summary},
        {"title": "Traction Strategy", "content": pitch.traction_strategy},
        {"title": "Funding Needs", "content": pitch.funding_needs},
        {"title": "Future Roadmap", "content": pitch.future_roadmap},
        {"title": "Closing Statement", "content": pitch.closing_statement},
    ]
    return build_pdf("Pitch Deck Summary", pitch.startup_name, sections)


def swot_to_pdf(swot) -> bytes:
    sections = [
        {"title": "Strengths", "type": "list", "items": parse_list(swot.strengths)},
        {"title": "Weaknesses", "type": "list", "items": parse_list(swot.weaknesses)},
        {"title": "Opportunities", "type": "list", "items": parse_list(swot.opportunities)},
        {"title": "Threats", "type": "list", "items": parse_list(swot.threats)},
        {"title": "Strategic Recommendations", "type": "list", "items": parse_list(swot.strategic_recommendations)},
    ]
    return build_pdf("SWOT Analysis", f"SWOT Analysis #{swot.id}", sections)


def competitor_to_pdf(competitor) -> bytes:
    sections = [
        {"title": "Direct Competitors", "type": "list", "items": parse_list(competitor.direct_competitors)},
        {"title": "Indirect Competitors", "type": "list", "items": parse_list(competitor.indirect_competitors)},
        {"title": "Competitor Strengths", "content": competitor.competitor_strengths},
        {"title": "Competitor Weaknesses", "content": competitor.competitor_weaknesses},
        {"title": "Market Gap", "content": competitor.market_gap},
        {"title": "Differentiation Strategy", "content": competitor.differentiation_strategy},
        {"title": "Pricing Comparison", "content": competitor.pricing_comparison},
        {"title": "Recommendations", "content": competitor.recommendations},
    ]
    return build_pdf("Competitor Analysis", f"Competitor Analysis #{competitor.id}", sections)


def mvp_to_pdf(mvp) -> bytes:
    sections = [
        {"title": "MVP Summary", "content": mvp.mvp_summary},
        {"title": "Core Features", "type": "list", "items": parse_list(mvp.core_features)},
        {"title": "Excluded Features", "type": "list", "items": parse_list(mvp.excluded_features)},
        {"title": "Recommended Tech Stack", "type": "list", "items": parse_list(mvp.recommended_tech_stack)},
        {"title": "Development Phases", "type": "list", "items": parse_list(mvp.development_phases)},
        {"title": "Timeline", "content": mvp.timeline},
        {"title": "Required Team", "type": "list", "items": parse_list(mvp.required_team)},
        {"title": "Budget Considerations", "content": mvp.budget_considerations},
        {"title": "Launch Checklist", "type": "list", "items": parse_list(mvp.launch_checklist)},
        {"title": "Success Metrics", "type": "list", "items": parse_list(mvp.success_metrics)},
    ]
    return build_pdf("MVP Plan", f"MVP Plan #{mvp.id}", sections)
