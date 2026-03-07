"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-navy">
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <span className="text-8xl font-bold text-gold opacity-20">500</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          A temporary error has occurred. Please try again in a moment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-gold text-navy-dark px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-gold/30 text-text-secondary px-6 py-3 rounded-xl hover:border-gold/60 hover:text-text-primary transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
