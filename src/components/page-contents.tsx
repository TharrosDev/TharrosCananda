"use client";

import { usePageSection, type PageSection } from "@/components/use-page-section";
import "./page-contents.css";

/** A small reading index, enhanced with the section currently being read. */
export function PageContents({
  items,
  label,
  className = "",
  sticky = true,
}: {
  items: readonly PageSection[];
  label: string;
  className?: string;
  sticky?: boolean;
}) {
  const [current, setCurrent] = usePageSection(items);

  return (
    <nav
      className={`page-contents ${className}`.trim()}
      aria-label={label}
      data-sticky={sticky ? "" : undefined}
    >
      <span className="page-contents-label">On this page</span>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current === item.id ? "location" : undefined}
              onClick={() => setCurrent(item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
