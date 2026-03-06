"use client";

import { useState } from "react";

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div key={faq.q} className="bg-surface/60 border border-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <h3 className="font-semibold text-text-primary pr-4">{faq.q}</h3>
            <svg
              className={`w-5 h-5 text-gold shrink-0 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-6">
              <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
