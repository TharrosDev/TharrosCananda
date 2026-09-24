import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-copy">
        <h1>Page not found.</h1>
        <p>The page may have moved, or the address may be incomplete.</p>
      </div>
      <div className="not-found-ways">
        {/* A plain GET form: it reaches the archive search with or without JavaScript. */}
        <form className="not-found-search" action="/research" method="get" role="search">
          <label htmlFor="not-found-q">Search the research</label>
          <span>
            <input
              id="not-found-q"
              name="q"
              type="search"
              maxLength={120}
              placeholder="Title, subject or any word in a report"
            />
            <button className="button-primary" type="submit">
              Search <ArrowIcon />
            </button>
          </span>
        </form>
        <nav className="not-found-links" aria-label="Useful pages">
          <Link href="/research">
            Research archive <ArrowIcon />
          </Link>
          <Link href="/methodology">
            Methodology <ArrowIcon />
          </Link>
          <Link href="/research-services">
            Commission research <ArrowIcon />
          </Link>
        </nav>
      </div>
    </section>
  );
}
