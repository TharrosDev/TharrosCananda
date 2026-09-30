"use client";

import { useEffect, useState } from "react";

export type PageSection = { id: string; label: string };

/** Follow the actual reading position; native anchors and browser history keep working. */
export function usePageSection(items: readonly PageSection[]) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const sections = items.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });
    const header = document.querySelector<HTMLElement>(".site-header");
    const contents = document.querySelector<HTMLElement>(".page-contents[data-sticky]");

    const measure = () => {
      frame = 0;
      if (disposed || !sections.length) return;
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const contentsHeight =
        contents &&
        getComputedStyle(contents).position === "sticky" &&
        contents.getBoundingClientRect().top <= headerHeight + 1
          ? contents.getBoundingClientRect().height
          : 0;
      const readingLine = headerHeight + contentsHeight + 36;
      let next = sections[0].id;
      for (const section of sections) {
        if (section.element.getBoundingClientRect().top > readingLine) break;
        next = section.id;
      }
      setCurrent(next);
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    void document.fonts.ready.then(schedule);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [items]);

  return [current, setCurrent] as const;
}
