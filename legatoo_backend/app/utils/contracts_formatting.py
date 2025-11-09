"\"\"\"Utility helpers for normalizing and structuring contract content.\"\"\""

from __future__ import annotations

from dataclasses import dataclass
from html import escape
import re
from typing import Any, Dict, Iterable, List, Optional

from bs4 import BeautifulSoup, NavigableString, Tag

HTML_TAG_PATTERN = re.compile(r"<\s*\/?\s*[a-zA-Z0-9]+[\s>]", re.IGNORECASE)

ARABIC_ARTICLE_PATTERN = re.compile(
    r"^(?:المادة|البند|الفقرة|مادة)\s+([^\n:：-]*)([:：\-–—]|\s)"
)
ENGLISH_ARTICLE_PATTERN = re.compile(
    r"^(?:Article|Section|Clause)\s+[0-9A-Za-z]+(?:\s*[-:–—.]|\s)", re.IGNORECASE
)

BULLET_PATTERN = re.compile(r"^[-*•]\s+")
NUMBERED_PATTERN = re.compile(r"^\d+[\.\-\)]\s+")

ALLOWED_TAGS = {
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "span",
}

ALLOWED_ATTRS = {"dir", "class"}


def _escape_html(text: str) -> str:
    return (
        escape(text, quote=True)
        .replace("\u00a0", " ")
        .replace("\r\n", "\n")
        .replace("\r", "\n")
    )


def _normalise_whitespace(value: str) -> str:
    return value.replace("\r\n", "\n").replace("\r", "\n")


def _wrap_list(lines: Iterable[str], ordered: bool) -> str:
    tag = "ol" if ordered else "ul"
    items = []
    for idx, raw_line in enumerate(lines, start=1):
        cleaned = raw_line.strip()
        if not cleaned:
            continue
        if ordered:
            cleaned = NUMBERED_PATTERN.sub("", cleaned, count=1)
        else:
            cleaned = BULLET_PATTERN.sub("", cleaned, count=1)
        items.append(f"<li>{_escape_html(cleaned.strip())}</li>")
    return f"<{tag}>{''.join(items)}</{tag}>"


def _wrap_heading(block: str) -> str:
    return f"<h3><strong>{_escape_html(block.strip())}</strong></h3>"


def _wrap_paragraph(block: str) -> str:
    escaped = _escape_html(block.strip()).replace("\n", "<br />")
    return f"<p>{escaped}</p>"


def _has_html_tags(content: str) -> bool:
    return bool(HTML_TAG_PATTERN.search(content))


def sanitize_contract_html(html: str) -> str:
    """Remove dangerous tags/attributes and retain only supported markup."""
    soup = BeautifulSoup(html, "html.parser")

    for tag in list(soup.find_all()):
        if tag.name not in ALLOWED_TAGS:
            tag.unwrap()
            continue

        # Drop disallowed attributes
        for attr in list(tag.attrs.keys()):
            if attr not in ALLOWED_ATTRS:
                del tag[attr]

    # Remove scripts or styles that may exist as NavigableStrings
    for script_like in soup(["script", "style"]):
        script_like.decompose()

    container = soup.body or soup
    sanitized = "".join(str(child) for child in container.children)
    return sanitized.strip()


def normalize_contract_content(content: Optional[str]) -> str:
    """Convert plain contract text to semantic HTML paragraphs/headings."""
    if not content:
        return ""

    trimmed = _normalise_whitespace(content.strip())
    if not trimmed:
        return ""

    if _has_html_tags(trimmed):
        return sanitize_contract_html(trimmed)

    blocks = re.split(r"\n{2,}", trimmed)
    html_blocks: List[str] = []

    for block in blocks:
        cleaned = block.strip()
        if not cleaned:
            continue

        lines = [
            line.strip()
            for line in cleaned.split("\n")
            if line.strip()
        ]

        if not lines:
            continue

        all_bullet = all(BULLET_PATTERN.match(line) for line in lines)
        all_numbered = all(NUMBERED_PATTERN.match(line) for line in lines)

        if all_bullet or all_numbered:
            html_blocks.append(_wrap_list(lines, ordered=all_numbered))
            continue

        if ARABIC_ARTICLE_PATTERN.match(lines[0]) or ENGLISH_ARTICLE_PATTERN.match(lines[0]):
            html_blocks.append(_wrap_heading(lines[0]))
            if len(lines) > 1:
                html_blocks.append(_wrap_paragraph("\n".join(lines[1:])))
            continue

        html_blocks.append(_wrap_paragraph(cleaned))

    return "\n".join(html_blocks)


@dataclass
class ContractRun:
    text: str
    bold: bool = False
    italic: bool = False
    underline: bool = False


@dataclass
class ContractElement:
    type: str  # 'paragraph', 'heading', 'list'
    level: Optional[int] = None  # heading level
    runs: Optional[List[ContractRun]] = None
    items: Optional[List[List[ContractRun]]] = None
    ordered: Optional[bool] = None


def _parse_runs(node: Tag | NavigableString, base_style: Optional[Dict[str, bool]] = None) -> List[ContractRun]:
    style = dict(base_style or {})
    runs: List[ContractRun] = []

    if isinstance(node, NavigableString):
        text = str(node)
        if text:
            runs.append(
                ContractRun(
                    text=text,
                    bold=style.get("bold", False),
                    italic=style.get("italic", False),
                    underline=style.get("underline", False),
                )
            )
        return runs

    if node.name == "br":
        runs.append(
            ContractRun(
                text="\n",
                bold=style.get("bold", False),
                italic=style.get("italic", False),
                underline=style.get("underline", False),
            )
        )
        return runs

    if node.name in {"strong", "b"}:
        style["bold"] = True
    if node.name in {"em", "i"}:
        style["italic"] = True
    if node.name == "u":
        style["underline"] = True

    for child in node.children:
        runs.extend(_parse_runs(child, style))

    return runs


def parse_contract_structure(content: Optional[str]) -> List[ContractElement]:
    """Return a structured representation (paragraphs, headings, lists) of content."""
    normalized_html = normalize_contract_content(content)
    if not normalized_html:
        return []

    sanitized_html = sanitize_contract_html(normalized_html)
    soup = BeautifulSoup(sanitized_html, "html.parser")
    container = soup.body or soup
    elements: List[ContractElement] = []

    for child in container.children:
        if isinstance(child, NavigableString):
            text = child.strip()
            if not text:
                continue
            runs = _parse_runs(child)
            elements.append(ContractElement(type="paragraph", runs=runs))
            continue

        if not isinstance(child, Tag):
            continue

        if child.name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            level = int(child.name[1])
            runs = [run for run in _parse_runs(child) if run.text.strip()]
            if runs:
                elements.append(ContractElement(type="heading", level=level, runs=runs))
            continue

        if child.name in {"p", "div", "span"}:
            runs = _parse_runs(child)
            if any(run.text.strip() for run in runs):
                elements.append(ContractElement(type="paragraph", runs=runs))
            continue

        if child.name in {"ul", "ol"}:
            ordered = child.name == "ol"
            items: List[List[ContractRun]] = []
            for li in child.find_all("li", recursive=False):
                li_runs = [run for run in _parse_runs(li) if run.text.strip()]
                if li_runs:
                    items.append(li_runs)
            if items:
                elements.append(
                    ContractElement(type="list", ordered=ordered, items=items)
                )
            continue

    return elements


def extract_plain_text(content: Optional[str]) -> str:
    """Utility to strip HTML and return clean text."""
    if not content:
        return ""
    normalized_html = normalize_contract_content(content)
    soup = BeautifulSoup(normalized_html, "html.parser")
    return soup.get_text(separator=" ", strip=True)


