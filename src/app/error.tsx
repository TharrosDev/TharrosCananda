"use client";

// Reuses the not-found layout so a render failure still looks like the site.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="not-found">
      <h1>Something went wrong.</h1>
      <p>This page could not be displayed. Try again, or return later.</p>
      <button className="button-primary" type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
