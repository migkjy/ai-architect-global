"use client";

import Link from "next/link";
import { useState } from "react";

export default function NotFound() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "404-page" }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-navy">
      <div className="max-w-lg w-full">
        {/* 404 */}
        <div className="mb-6">
          <span className="text-8xl font-bold text-gold opacity-20">404</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          The page you requested does not exist or has been moved.
          <br />
          Explore the links below to find what you need.
        </p>

        {/* Navigation links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="bg-gold text-navy-dark px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/ko"
            className="border border-gold/30 text-text-secondary px-6 py-3 rounded-xl hover:border-gold/60 hover:text-text-primary transition-all"
          >
            한국어
          </Link>
          <Link
            href="/ja"
            className="border border-gold/30 text-text-secondary px-6 py-3 rounded-xl hover:border-gold/60 hover:text-text-primary transition-all"
          >
            日本語
          </Link>
        </div>

        {/* Subscribe CTA */}
        <div className="border border-gold/20 rounded-2xl p-6 bg-navy-dark/50">
          <p className="text-sm font-semibold text-gold mb-1">Free AI Business Checklist</p>
          <p className="text-xs text-text-secondary mb-4">
            Get weekly AI business insights delivered to your inbox.
          </p>
          {status === "success" ? (
            <p className="text-green-400 text-sm font-medium">Subscribed! Check your email.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="nf-email" className="sr-only">Email address</label>
              <input
                id="nf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 min-w-0 rounded-xl border border-gold/20 bg-navy-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-xl bg-gold px-4 py-2 text-sm font-bold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Get Free"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs mt-2">An error occurred. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
