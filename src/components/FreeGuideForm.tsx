"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface FreeGuideFormProps {
  ctaLabel?: string;
}

export default function FreeGuideForm({ ctaLabel }: FreeGuideFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push(`/${locale}/free-guide/thank-you`);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="free-guide-name" className="sr-only">
          Your name (optional)
        </label>
        <input
          id="free-guide-name"
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-colors"
        />
        <label htmlFor="free-guide-email" className="sr-only">
          Email address
        </label>
        <input
          id="free-guide-email"
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-describedby={error ? "free-guide-error" : undefined}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 bg-gold text-navy-dark hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Sending..." : (ctaLabel ?? "Get Your Free Guide")}
        </button>
      </div>

      {error && (
        <p id="free-guide-error" role="alert" className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}
    </form>
  );
}
