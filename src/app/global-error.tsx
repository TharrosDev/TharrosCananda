"use client";

import Link from "next/link";
import "./globals.css";

// Replaces the root layout when it fails, so it renders its own <html>.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-CA">
      <body>
        <main className="not-found">
          <div className="not-found-copy">
            <h1>Something went wrong.</h1>
            <p>Tharros could not be displayed. Try loading it again or return to the homepage.</p>
          </div>
          <div className="not-found-ways">
            <button className="button-primary" type="button" onClick={reset}>
              Try again
            </button>
            <Link className="button-secondary" href="/">
              Return to Tharros
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
