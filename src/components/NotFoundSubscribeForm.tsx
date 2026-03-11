"use client";

import { useState } from "react";

export default function NotFoundSubscribeForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "404-page", website }),
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

  if (status === "success") {
    return <p className="text-green-400 text-sm font-medium">Subscribed! Check your email.</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="nf-website">Website</label>
          <input
            id="nf-website"
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label htmlFor="nf-email" className="sr-only">Email address</label>
        <input
          id="nf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          required
          className="flex-1 min-w-0 rounded-xl border border-gold/20 bg-navy-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/30 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-gold px-4 py-2 text-sm font-bold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Get Free"}
        </button>
      </form>
      {status === "error" && (
        <p role="alert" className="text-red-400 text-xs mt-2">An error occurred. Please try again.</p>
      )}
    </>
  );
}
