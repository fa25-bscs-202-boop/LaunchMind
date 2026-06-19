from __future__ import annotations

import html
import re
from pathlib import Path

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
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
MARKDOWN_PATH = ROOT / "docs" / "code_explanation_report.md"
PDF_PATH = ROOT / "docs" / "code_explanation_report.pdf"


def clean_text(text: str) -> str:
    replacements = {
        "\ufeff": "",
        "\u2011": "-",
        "\u2010": "-",
        "\u2012": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2212": "-",
        "\xa0": " ",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }
    for original, replacement in replacements.items():
        text = text.replace(original, replacement)
    return text


def inline_markup(text: str) -> str:
    escaped = html.escape(clean_text(text))
    escaped = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", escaped)
    return escaped


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            fontName="Helvetica-Bold",
            fontSize=25,
            leading=31,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111827"),
            spaceAfter=18,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverMeta",
            fontName="Helvetica",
            fontSize=11,
            leading=16,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#4B5563"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ReportHeading1",
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=23,
            textColor=colors.HexColor("#111827"),
            spaceBefore=18,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ReportHeading2",
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#1F2937"),
            spaceBefore=13,
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyClean",
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#1F2937"),
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletClean",
            fontName="Helvetica",
            fontSize=9.2,
            leading=13,
            textColor=colors.HexColor("#1F2937"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Footer",
            fontName="Helvetica",
            fontSize=8,
            alignment=TA_RIGHT,
            textColor=colors.HexColor("#6B7280"),
        )
    )
    return styles


def flush_paragraph(lines: list[str], story: list, styles) -> None:
    if not lines:
        return
    text = " ".join(line.strip() for line in lines if line.strip())
    if text:
        story.append(Paragraph(inline_markup(text), styles["BodyClean"]))
    lines.clear()


def flush_bullets(items: list[str], story: list, styles) -> None:
    if not items:
        return
    flowable = ListFlowable(
        [
            ListItem(
                Paragraph(inline_markup(item), styles["BulletClean"]),
                leftIndent=10,
            )
            for item in items
        ],
        bulletType="bullet",
        leftIndent=18,
        bulletFontName="Helvetica",
        bulletFontSize=8,
    )
    story.append(flowable)
    story.append(Spacer(1, 5))
    items.clear()


def markdown_to_story(markdown: str, styles) -> list:
    story: list = []
    paragraph_lines: list[str] = []
    bullet_items: list[str] = []
    in_code = False
    code_lines: list[str] = []

    for raw_line in markdown.splitlines():
        line = clean_text(raw_line.rstrip())

        if line.startswith("```"):
            if in_code:
                story.append(
                    Preformatted(
                        "\n".join(code_lines),
                        styles["Code"],
                        maxLineLength=92,
                    )
                )
                story.append(Spacer(1, 8))
                code_lines.clear()
                in_code = False
            else:
                flush_paragraph(paragraph_lines, story, styles)
                flush_bullets(bullet_items, story, styles)
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            flush_paragraph(paragraph_lines, story, styles)
            flush_bullets(bullet_items, story, styles)
            continue

        if line.startswith("# "):
            flush_paragraph(paragraph_lines, story, styles)
            flush_bullets(bullet_items, story, styles)
            story.append(Paragraph(inline_markup(line[2:]), styles["ReportHeading1"]))
            continue

        if line.startswith("## "):
            flush_paragraph(paragraph_lines, story, styles)
            flush_bullets(bullet_items, story, styles)
            story.append(Paragraph(inline_markup(line[3:]), styles["ReportHeading1"]))
            continue

        if line.startswith("### "):
            flush_paragraph(paragraph_lines, story, styles)
            flush_bullets(bullet_items, story, styles)
            story.append(Paragraph(inline_markup(line[4:]), styles["ReportHeading2"]))
            continue

        if line.startswith("- "):
            flush_paragraph(paragraph_lines, story, styles)
            bullet_items.append(line[2:])
            continue

        if re.match(r"^\d+\. ", line):
            flush_paragraph(paragraph_lines, story, styles)
            bullet_items.append(re.sub(r"^\d+\. ", "", line))
            continue

        paragraph_lines.append(line)

    flush_paragraph(paragraph_lines, story, styles)
    flush_bullets(bullet_items, story, styles)
    return story


def draw_frame(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D4AF37"))
    canvas.setLineWidth(0.6)
    canvas.line(inch, 10.25 * inch, 7.5 * inch, 10.25 * inch)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.HexColor("#111827"))
    canvas.drawString(inch, 10.4 * inch, "Launch Mind")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.drawRightString(7.5 * inch, 10.4 * inch, "Code Explanation Report")
    canvas.drawString(inch, 0.55 * inch, "Generated from repository source")
    canvas.drawRightString(7.5 * inch, 0.55 * inch, f"Page {doc.page}")
    canvas.restoreState()


def main() -> None:
    styles = make_styles()
    markdown = MARKDOWN_PATH.read_text(encoding="utf-8")
    story = [
        Spacer(1, 1.4 * inch),
        Paragraph("Launch Mind", styles["CoverTitle"]),
        Paragraph("Code Explanation Report", styles["CoverTitle"]),
        Paragraph("Generated on June 19, 2026", styles["CoverMeta"]),
        Paragraph(
            "A deep walkthrough of the FastAPI backend, Next.js frontend, data model, AI services, authentication, and export system.",
            styles["CoverMeta"],
        ),
        PageBreak(),
    ]
    story.extend(markdown_to_story(markdown, styles))

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=1.05 * inch,
        bottomMargin=0.85 * inch,
        title="Launch Mind Code Explanation Report",
    )
    doc.build(story, onFirstPage=draw_frame, onLaterPages=draw_frame)
    print(PDF_PATH)


if __name__ == "__main__":
    main()
