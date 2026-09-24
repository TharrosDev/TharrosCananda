"use client";

import { useEffect, useState } from "react";

/** Contents rail for the method clauses: marks the clause being read. Plain in-page links without JavaScript. */
export function MethodRail({ items }: { items: readonly { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        // The first clause in reading order that crosses the band wins, not whichever changed last.
        const first = items.find((item) => crossing.has(item.id));
        if (first) setCurrent(first.id);
      },
      // The band starts just under the anchor offset (header + 28px), so a clause jumped to from the rail counts.
      { rootMargin: "-112px 0px -55% 0px" },
    );
    for (const { id } of items) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="method-rail" aria-label="Method clauses">
      <span className="method-rail-progress" aria-hidden="true" />
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === current ? "true" : undefined}
              onClick={() => setCurrent(item.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
