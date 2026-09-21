import type { ReactNode } from "react";

export function SectionHeading({
  title,
  children,
  align = "left",
}: {
  title: string;
  children: ReactNode;
  align?: "left" | "split";
}) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
