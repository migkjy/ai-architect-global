import { describe, it, expect } from "vitest";
import { splitContentAtMidpoint } from "@/lib/blog-content-utils";

describe("splitContentAtMidpoint", () => {
  it("splits content roughly in half by paragraph", () => {
    const content = "Para 1\n\nPara 2\n\nPara 3\n\nPara 4";
    const { before, after } = splitContentAtMidpoint(content);
    expect(before.length).toBeGreaterThan(0);
    expect(after.length).toBeGreaterThan(0);
  });

  it("returns full content in before when content has no paragraphs to split", () => {
    const content = "Single line";
    const { before, after } = splitContentAtMidpoint(content);
    expect(before).toBe(content);
    expect(after).toBe("");
  });

  it("splits at approximately 40-60% of paragraphs", () => {
    const paragraphs = Array.from({ length: 10 }, (_, i) => `Paragraph ${i + 1}`);
    const content = paragraphs.join("\n\n");
    const { before, after } = splitContentAtMidpoint(content);

    const beforeParaCount = before.split("\n\n").filter(Boolean).length;
    const totalParaCount = paragraphs.length;
    const splitRatio = beforeParaCount / totalParaCount;

    expect(splitRatio).toBeGreaterThanOrEqual(0.3);
    expect(splitRatio).toBeLessThanOrEqual(0.7);
    expect(after.length).toBeGreaterThan(0);
  });

  it("handles content with headings and code blocks correctly", () => {
    const content = [
      "# Heading 1",
      "Paragraph under heading 1.",
      "## Heading 2",
      "Paragraph under heading 2.",
      "```js\nconst x = 1;\n```",
      "### Heading 3",
      "Paragraph under heading 3.",
      "More content here.",
    ].join("\n\n");

    const { before, after } = splitContentAtMidpoint(content);
    const combined = before + (after ? "\n\n" + after : "");
    // All original content is preserved (whitespace may differ at join)
    expect(combined.replace(/\s+/g, " ").trim()).toBe(
      content.replace(/\s+/g, " ").trim()
    );
  });

  it("does not split very short content (less than 4 paragraphs)", () => {
    const content = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
    const { before, after } = splitContentAtMidpoint(content);
    expect(before).toBe(content);
    expect(after).toBe("");
  });

  it("preserves all content across before and after", () => {
    const paragraphs = Array.from({ length: 8 }, (_, i) => `Paragraph ${i + 1} content here.`);
    const content = paragraphs.join("\n\n");
    const { before, after } = splitContentAtMidpoint(content);

    const reconstructed = [before, after].filter(Boolean).join("\n\n");
    expect(reconstructed).toBe(content);
  });
});
