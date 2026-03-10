// instrumentation-client.ts
// This file runs before the application's frontend code starts executing.
// Ideal for setting up global analytics, error tracking, or performance monitoring.
// See: https://nextjs.org/docs/app/guides/analytics#client-instrumentation

// ─── Global Error Tracking ──────────────────────────────────────────────────
window.addEventListener("error", (event: ErrorEvent) => {
  const url = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Instrumentation] Unhandled error:", event.error);
    }
    return;
  }

  const body = JSON.stringify({
    type: "error",
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: "POST", keepalive: true });
  }
});

// ─── Unhandled Promise Rejection Tracking ───────────────────────────────────
window.addEventListener(
  "unhandledrejection",
  (event: PromiseRejectionEvent) => {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[Instrumentation] Unhandled promise rejection:",
        event.reason
      );
    }
  }
);
