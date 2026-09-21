import type { ReactNode } from "react";

export function PageHero({
  title,
  description,
  aside,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        {aside && <aside>{aside}</aside>}
      </div>
    </section>
  );
}
