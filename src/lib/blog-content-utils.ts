/**
 * Utilities for splitting blog post content for inline CTA insertion.
 */

const MIN_PARAGRAPHS_TO_SPLIT = 4;
const SPLIT_RATIO = 0.5; // target ~50% split point

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
