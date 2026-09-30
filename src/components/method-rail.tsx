"use client";

import { usePageSection } from "@/components/use-page-section";

/** Local reading index for method clauses and documents. Plain anchors without JavaScript. */
export function MethodRail({
  items,
  label = "Method clauses",
}: {
  items: readonly { id: string; label: string }[];
  label?: string;
}) {
  const [current, setCurrent] = usePageSection(items);

  return (
    <nav className="method-rail" aria-label={label}>
      <span className="method-rail-heading">On this page</span>
      <span className="method-rail-progress" aria-hidden="true" />
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === current ? "location" : undefined}
              onClick={() => setCurrent(item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
