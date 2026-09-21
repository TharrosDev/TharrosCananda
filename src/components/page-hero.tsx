import Link from "next/link";
import type { ReactNode } from "react";

export type HeroIndexItem = { label: string; href?: string; note?: string };
export type PageHeroVariant = "home" | "standard" | "task" | "document";

/** Shared dark hero with deliberately different density for home, editorial and task pages. */
export function PageHero({
  title,
  description,
  index,
  indexLabel = "On this page",
  variant = "standard",
  children,
}: {
  title: string;
  description: string;
  index?: readonly HeroIndexItem[];
  indexLabel?: string;
  variant?: PageHeroVariant;
  children?: ReactNode;
}) {
  const hasLinkedItems = index?.some((item) => Boolean(item.href)) ?? false;

  const indexContents = index && index.length > 0 ? (
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
  ) : null;

  const surfaceClass = variant === "document" ? "" : "band band-dark";

  return (
    <section className={`page-hero page-hero-${variant} ${surfaceClass}`.trim()}>
      <div className="page-hero-inner">
        <div className="page-hero-copy">
          <h1>{title}</h1>
          <p>{description}</p>
          {children}
        </div>
        {indexContents && (
          hasLinkedItems ? (
            <nav className="hero-index" aria-label={indexLabel}>{indexContents}</nav>
          ) : (
            <div className="hero-index" aria-label={indexLabel}>{indexContents}</div>
          )
        )}
      </div>
    </section>
  );
}
