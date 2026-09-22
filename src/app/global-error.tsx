"use client";

import "./globals.css";

// Replaces the root layout when it fails, so it renders its own <html>.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-CA">
      <body>
        <main className="not-found">
          <h1>Something went wrong.</h1>
          <p>Tharros Canada could not be displayed. Try again, or return later.</p>
          <button className="button-primary" type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
