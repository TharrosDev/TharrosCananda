import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Page not found.</h1>
      <p>The page may have moved, or the address may be incomplete.</p>
      <nav className="not-found-links" aria-label="Useful pages">
        <Link className="text-link" href="/research">
          Research <ArrowIcon />
        </Link>
        <Link className="text-link" href="/live-monitor" prefetch={false}>
          Live Monitor <ArrowIcon />
        </Link>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </nav>
    </section>
  );
}
