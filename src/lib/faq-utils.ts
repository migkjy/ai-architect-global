export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Parse FAQ Q&A pairs from markdown content.
 * Looks for a `## FAQ` section with `### Question` subheadings.
 */
export function parseFaqFromContent(content: string): FaqItem[] {
  const faqSectionMatch = content.match(/^## FAQ\s*$/m);
  if (!faqSectionMatch || faqSectionMatch.index === undefined) return [];

  const faqStart = faqSectionMatch.index + faqSectionMatch[0].length;
  const nextH2 = content.slice(faqStart).match(/^## /m);
  const faqSection = nextH2 && nextH2.index !== undefined
    ? content.slice(faqStart, faqStart + nextH2.index)
    : content.slice(faqStart);

  const items: FaqItem[] = [];
  const questionBlocks = faqSection.split(/^### /m).slice(1);

  for (const block of questionBlocks) {
    const lines = block.trim().split("\n");
    const question = lines[0].trim().replace(/\?$/, "?");
    const answer = lines
      .slice(1)
      .join("\n")
      .trim();

    if (question && answer) {
      items.push({ q: question, a: answer });
    }
  }

  return items;
}

export function buildFaqJsonLd(
  faqs: FaqItem[],
  pageUrl: string,
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
