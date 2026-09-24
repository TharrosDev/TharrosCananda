"use client";

import { useEffect } from "react";
import { sendMetric } from "@/lib/metrics-client";

const ENGAGED_MS = 20_000;

/**
 * Counts one read once the report has been on screen in the visible tab for 20 s in total,
 * or when any PDF download link on the page is used. Prefetches, bots and bounces never reach it.
 */
export function ReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const viewer = document.querySelector("[data-report-viewer]");
    let onScreen = false;
    // Tracked like onScreen: the tick on becoming visible must not credit the hidden gap before it.
    let visible = document.visibilityState === "visible";
    let visibleMs = 0;
    let last = performance.now();
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      sendMetric(slug, "read");
    };
    const tick = () => {
      const now = performance.now();
      if (onScreen && visible) visibleMs += now - last;
      last = now;
      if (visibleMs >= ENGAGED_MS) send();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        tick();
        onScreen = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    if (viewer) observer.observe(viewer);
    const timer = window.setInterval(tick, 1000);
    const onVisibility = () => {
      tick();
      visible = document.visibilityState === "visible";
    };
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.("a[download]")) send();
    };
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick);
    };
  }, [slug]);
  return null;
}
