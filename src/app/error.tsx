"use client";

import Link from "next/link";

// Reuses the not-found layout so a render failure still looks like the site.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="not-found">
      <div className="not-found-copy">
        <h1>Something went wrong.</h1>
        <p>This page could not be displayed. Try loading it again or look at the research.</p>
      </div>
      <div className="not-found-ways">
        <button className="button-primary" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="button-secondary" href="/research">
          Go to Research
        </Link>
      </div>
    </section>
  );
}
