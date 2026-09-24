import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Page not found.</h1>
      <p>The page may have moved, or the address may be incomplete.</p>
      <nav className="not-found-links" aria-label="Useful pages">
        <Link className="button-primary" href="/research">
          Research archive <ArrowIcon />
        </Link>
        <Link className="text-link" href="/methodology">
          Methodology <ArrowIcon />
        </Link>
        <Link className="text-link" href="/research-services">
          Commission research <ArrowIcon />
        </Link>
      </nav>
    </section>
  );
}
