"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ──────────────────────────── Data ──────────────────────────── */

interface Question {
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    question: "How often does your team use AI tools?",
    options: ["Never", "Monthly", "Weekly", "Daily"],
  },
  {
    question: "What percentage of repetitive tasks are automated?",
    options: ["0%", "1–25%", "26–50%", "51%+"],
  },
  {
    question: "Do you have an AI strategy document?",
    options: ["No", "Considering", "Draft exists", "Implemented"],
  },
  {
    question: "How do you handle AI tool training?",
    options: ["No training", "Ad hoc", "Regular sessions", "Certification program"],
  },
  {
    question: "Is AI integrated into your core product/service?",
    options: ["No", "Planning", "Partially", "Fully integrated"],
  },
  {
    question: "How do you measure AI ROI?",
    options: ["We don't", "Informally", "Defined KPIs", "Automated dashboards"],
  },
  {
    question: "How does your team handle AI-generated content?",
    options: ["Don't use it", "Manual review only", "Hybrid workflow", "AI-first pipeline"],
  },
  {
    question: "What's your monthly AI tool budget?",
    options: ["$0", "Under $100", "$100–$500", "$500+"],
  },
  {
    question: "Do you use AI for customer interactions?",
    options: ["No", "FAQ bots only", "Personalization", "Full AI CX"],
  },
  {
    question: "How quickly can you deploy a new AI tool?",
    options: ["Months", "Weeks", "Days", "Hours"],
  },
];

type Tier = "beginner" | "adopter" | "native";

interface TierInfo {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  headline: string;
  description: string;
  recommendation: string;
  ctaText: string;
  ctaHref: string;
}

const tiers: Record<Tier, TierInfo> = {
  beginner: {
    label: "Beginner",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    headline: "Your AI journey is just getting started",
    description:
      "Most businesses are at this stage — aware of AI but not yet using it systematically. The gap between you and AI-native competitors is growing every month. The good news? You can leapfrog with the right framework.",
    recommendation:
      "Start with Vol.1: AI Marketing Architect — it turns DotCom Secrets into an AI-powered system you can run this week.",
    ctaText: "Start with AI Marketing Architect",
    ctaHref: "/products/ai-marketing-architect",
  },
  adopter: {
    label: "Adopter",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    headline: "You're on the right track — now systematize it",
    description:
      "You're using AI tools, but they're probably siloed. Individual team members experiment, yet there's no unified system. The next step: turn ad-hoc usage into repeatable, automated workflows.",
    recommendation:
      "The 6-book bundle gives you a complete system — from funnels to launches to copy to writing. Everything connected.",
    ctaText: "Get the Full Bundle",
    ctaHref: "/bundle",
  },
  native: {
    label: "Native",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    headline: "You're operating like an AI-native business",
    description:
      "Impressive. AI is embedded in your workflows, products, and culture. You're in the top tier. But even AI-native teams find gaps in their frameworks — especially when scaling.",
    recommendation:
      "Explore individual volumes to fill specific gaps, or grab the bundle for your team's onboarding library.",
    ctaText: "Explore All Playbooks",
    ctaHref: "/products",
  },
};

/* ──────────────────────────── Helpers ──────────────────────────── */

function getTier(score: number): Tier {
  if (score <= 10) return "beginner";
  if (score <= 20) return "adopter";
  return "native";
}

function getShareText(score: number, tier: Tier) {
  return `I scored ${score}/30 on the AI Native Score! My level: ${tiers[tier].label}. How AI-ready is YOUR business?`;
}

/* ──────────────────────────── Components ──────────────────────────── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-text-secondary mb-2">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  index,
  selected,
  onSelect,
}: {
  q: Question;
  index: number;
  selected: number | null;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold mb-6 leading-snug">
        {q.question}
      </h2>
      <div className="grid gap-3">
        {q.options.map((opt, oi) => {
          const isSelected = selected === oi;
          return (
            <button
              key={oi}
              onClick={() => onSelect(oi)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "border-gold bg-gold/10 text-text-primary"
                  : "border-white/10 bg-surface/60 text-text-secondary hover:border-gold/40 hover:bg-surface"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3 ${
                  isSelected
                    ? "bg-gold text-navy-dark"
                    : "bg-white/10 text-text-secondary"
                }`}
              >
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScoreRing({ score, max }: { score: number; max: number }) {
  const pct = score / max;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - pct);
  const tier = getTier(score);
  const info = tiers[tier];

  return (
    <div className="relative w-40 h-40 mx-auto mb-6">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          className="text-white/5"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          className={info.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-text-secondary">/ {max}</span>
      </div>
    </div>
  );
}

function ShareButtons({ text, url }: { text: string; url: string }) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex gap-3 justify-center mt-6">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] rounded-xl text-sm font-medium hover:bg-[#1DA1F2]/20 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077B5]/10 border border-[#0077B5]/30 text-[#0077B5] rounded-xl text-sm font-medium hover:bg-[#0077B5]/20 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Share on LinkedIn
      </a>
    </div>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, website }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center mt-8">
        <p className="text-emerald-400 font-semibold">You're in! Check your inbox.</p>
        <p className="text-sm text-text-secondary mt-1">
          We'll send your detailed AI readiness insights shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-surface/60 border border-gold/20 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-1">Get your detailed AI readiness report</h3>
      <p className="text-sm text-text-secondary mb-4">
        Personalized recommendations based on your score — delivered to your inbox.
      </p>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-navy border border-white/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50"
        />
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-navy border border-white/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-gold text-navy-dark font-bold rounded-xl text-sm hover:bg-gold-light transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "Sending..." : "Get Report"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
      )}
      <p className="text-xs text-text-muted mt-3 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

/* ──────────────────────────── Main Page ──────────────────────────── */

export default function ScorePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  const score = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const tier = getTier(score);
  const info = tiers[tier];

  const handleSelect = useCallback(
    (value: number) => {
      const next = [...answers];
      next[currentQ] = value;
      setAnswers(next);

      // Auto-advance after a short delay
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ(currentQ + 1);
        } else {
          setShowResult(true);
        }
      }, 300);
    },
    [answers, currentQ]
  );

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleRetake = () => {
    setCurrentQ(0);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  };

  const siteUrl = "https://ai-native-playbook.com";
  const shareUrl = `${siteUrl}/${locale}/score`;

  /* ── Result View ── */
  if (showResult) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* Badge */}
          <div className="text-center mb-8">
            <span
              className={`inline-block ${info.bgColor} border ${info.borderColor} ${info.color} text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase mb-6`}
            >
              Your AI Native Level
            </span>
          </div>

          {/* Score Ring */}
          <ScoreRing score={score} max={30} />

          {/* Tier */}
          <div className="text-center mb-10">
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${info.color}`}>
              {info.label}
            </h1>
            <p className="text-lg font-semibold text-text-primary mb-3">
              {info.headline}
            </p>
            <p className="text-text-secondary leading-relaxed max-w-lg mx-auto">
              {info.description}
            </p>
          </div>

          {/* Recommendation Card */}
          <div className={`${info.bgColor} border ${info.borderColor} rounded-2xl p-6 mb-8`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-gold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-1">Our Recommendation</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {info.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={`/${locale}${info.ctaHref}`}
              className="inline-block px-8 py-4 bg-gold text-navy-dark font-bold rounded-xl text-lg hover:bg-gold-light transition-colors"
            >
              {info.ctaText} &rarr;
            </Link>
          </div>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-center text-sm text-text-secondary mb-2">
              Share your score with your network
            </p>
            <ShareButtons
              text={getShareText(score, tier)}
              url={shareUrl}
            />
          </div>

          {/* Email Capture */}
          <EmailCapture />

          {/* Retake */}
          <div className="text-center mt-8">
            <button
              onClick={handleRetake}
              className="text-sm text-text-muted hover:text-text-secondary transition-colors underline underline-offset-2"
            >
              Retake the assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz View ── */
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        {currentQ === 0 && (
          <div className="text-center mb-10 animate-fade-in">
            <span className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase mb-6">
              Free Assessment
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              AI Native Score
            </h1>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              How AI-ready is your business? Answer 10 quick questions to find
              out — takes less than 2 minutes.
            </p>
          </div>
        )}

        {/* Progress */}
        <ProgressBar current={currentQ + 1} total={questions.length} />

        {/* Question */}
        <QuestionCard
          key={currentQ}
          q={questions[currentQ]}
          index={currentQ}
          selected={answers[currentQ]}
          onSelect={handleSelect}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentQ === 0}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr; Back
          </button>
          <span className="text-xs text-text-muted">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
