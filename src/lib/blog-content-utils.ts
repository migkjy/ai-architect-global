/**
 * Utilities for splitting blog post content for inline CTA insertion.
 */

const MIN_PARAGRAPHS_TO_SPLIT = 4;
const SPLIT_RATIO = 0.5; // target ~50% split point
const CROSSLINK_RATIO = 0.3; // target ~30% for related-posts crosslink

/**
 * Splits markdown content into two halves at approximately the midpoint by paragraph.
 * Returns { before, after } where after is empty string if content is too short to split.
 */
export function splitContentAtMidpoint(content: string): {
  before: string;
  after: string;
} {
  const paragraphs = content.split("\n\n");

  if (paragraphs.length < MIN_PARAGRAPHS_TO_SPLIT) {
    return { before: content, after: "" };
  }

  const splitIndex = Math.round(paragraphs.length * SPLIT_RATIO);
  const before = paragraphs.slice(0, splitIndex).join("\n\n");
  const after = paragraphs.slice(splitIndex).join("\n\n");

  return { before, after };
}

/**
 * Splits markdown content into three sections for two inline insertions:
 * 1. intro (~30%) — followed by related-posts crosslink
 * 2. middle (~30%→50%) — followed by inline CTA
 * 3. rest (~50%→100%)
 *
 * If content is too short, middle/rest may be empty strings.
 */
export function splitContentThreeWay(content: string): {
  intro: string;
  middle: string;
  rest: string;
} {
  const paragraphs = content.split("\n\n");

  if (paragraphs.length < MIN_PARAGRAPHS_TO_SPLIT) {
    return { intro: content, middle: "", rest: "" };
  }

  const crosslinkIndex = Math.max(2, Math.round(paragraphs.length * CROSSLINK_RATIO));
  const midpointIndex = Math.round(paragraphs.length * SPLIT_RATIO);

  // Ensure crosslink comes before midpoint with at least 1 paragraph gap
  const effectiveCrosslink = Math.min(crosslinkIndex, midpointIndex - 1);

  if (effectiveCrosslink <= 0 || effectiveCrosslink >= midpointIndex) {
    // Fall back to 2-way split (no room for crosslink)
    const before = paragraphs.slice(0, midpointIndex).join("\n\n");
    const after = paragraphs.slice(midpointIndex).join("\n\n");
    return { intro: before, middle: "", rest: after };
  }

  const intro = paragraphs.slice(0, effectiveCrosslink).join("\n\n");
  const middle = paragraphs.slice(effectiveCrosslink, midpointIndex).join("\n\n");
  const rest = paragraphs.slice(midpointIndex).join("\n\n");

  return { intro, middle, rest };
}
