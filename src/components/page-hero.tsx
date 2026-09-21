import Link from "next/link";
import type { ReactNode } from "react";

export type HeroIndexItem = { label: string; href?: string; note?: string };

/** Full-bleed dark hero: headline and lede on the left, a numbered "on this page" index on the right. */
export function PageHero({
  title,
  description,
  index,
  indexLabel = "On this page",
  children,
}: {
  title: string;
  description: string;
  index?: readonly HeroIndexItem[];
  indexLabel?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero band band-dark">
      <div className="page-hero-inner">
        <div className="page-hero-copy">
          <h1>{title}</h1>
          <p>{description}</p>
          {children}
        </div>
        {index && index.length > 0 && (
          <nav className="hero-index" aria-label={indexLabel}>
            <ol>
              {index.map((item, position) => (
                <li key={item.label}>
                  <span className="index-number">{String(position + 1).padStart(2, "0")}</span>
                  <span className="hero-index-body">
                    {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
                    {item.note && <small>{item.note}</small>}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
