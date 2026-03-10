"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a1628",
          color: "#e2e8f0",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "28rem", width: "100%" }}>
          <div
            style={{
              fontSize: "6rem",
              fontWeight: "bold",
              color: "#d4a853",
              opacity: 0.2,
              marginBottom: "1rem",
              lineHeight: 1,
            }}
          >
            500
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#94a3b8",
              marginBottom: "2rem",
              fontSize: "0.875rem",
            }}
          >
            A critical error occurred while loading the page. Please try again.
          </p>
          {error.digest && (
            <p
              style={{
                color: "#64748b",
                fontSize: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                backgroundColor: "#d4a853",
                color: "#0a1628",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                border: "1px solid rgba(212,168,83,0.3)",
                color: "#94a3b8",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
