const HTML_TAG_PATTERN = /<\s*\/?\s*[a-zA-Z0-9]+[\s>]/;

const ARABIC_ARTICLE_PATTERN =
  /^(?:المادة|البند|الفقرة|مادة)\s+([^\n:：-]*)([:：\-–—]|\s)/;
const ENGLISH_ARTICLE_PATTERN =
  /^(?:Article|Section|Clause)\s+[0-9A-Za-z]+(?:\s*[-:–—.]|\s)/i;

const BULLET_PATTERN = /^[-*•]\s+/;
const NUMBERED_PATTERN = /^\d+[\.\-\)]\s+/;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isLikelyHtml(content: string): boolean {
  return HTML_TAG_PATTERN.test(content);
}

function normaliseWhitespace(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function wrapList(lines: string[], ordered: boolean): string {
  const tag = ordered ? "ol" : "ul";
  const items = lines
    .map((line) =>
      `<li>${escapeHtml(
        line
          .trim()
          .replace(ordered ? NUMBERED_PATTERN : BULLET_PATTERN, "")
          .trim()
      )}</li>`
    )
    .join("");
  return `<${tag}>${items}</${tag}>`;
}

function wrapParagraph(block: string): string {
  const escaped = escapeHtml(block.trim()).replace(/\n+/g, "<br />");
  return `<p>${escaped}</p>`;
}

function wrapHeading(block: string): string {
  const escaped = escapeHtml(block.trim());
  return `<h3><strong>${escaped}</strong></h3>`;
}

/**
 * Converts raw contract text into structured HTML with RTL-friendly blocks.
 * If the input already contains HTML tags, it is returned unchanged (after trimming).
 */
export function normalizeContractContent(rawContent: string | null | undefined): string {
  if (!rawContent) {
    return "";
  }

  const trimmed = normaliseWhitespace(rawContent.trim());
  if (!trimmed) {
    return "";
  }

  if (isLikelyHtml(trimmed)) {
    return trimmed;
  }

  const blocks = trimmed.split(/\n{2,}/);
  const htmlBlocks: string[] = [];

  for (const block of blocks) {
    const cleaned = block.trim();
    if (!cleaned) continue;

    const lines = cleaned.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) continue;

    const allBullet = lines.every((line) => BULLET_PATTERN.test(line));
    const allNumbered = lines.every((line) => NUMBERED_PATTERN.test(line));

    if (allBullet || allNumbered) {
      htmlBlocks.push(wrapList(lines, allNumbered));
      continue;
    }

    if (
      ARABIC_ARTICLE_PATTERN.test(lines[0]) ||
      ENGLISH_ARTICLE_PATTERN.test(lines[0])
    ) {
      htmlBlocks.push(wrapHeading(lines[0]));
      if (lines.length > 1) {
        const rest = lines.slice(1).join("\n");
        htmlBlocks.push(wrapParagraph(rest));
      }
      continue;
    }

    htmlBlocks.push(wrapParagraph(cleaned));
  }

  return htmlBlocks.join("\n");
}

/**
 * Condenses HTML (or plain text) into a readable text excerpt.
 */
export function extractPlainText(content: string | null | undefined, maxLength = 280): string {
  if (!content) return "";
  let text = content;

  if (isLikelyHtml(content)) {
    text = content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<[^>]+>/g, " ");
  }

  const condensed = text.replace(/\s+/g, " ").trim();
  if (condensed.length <= maxLength) {
    return condensed;
  }
  return `${condensed.substring(0, maxLength - 1)}…`;
}


