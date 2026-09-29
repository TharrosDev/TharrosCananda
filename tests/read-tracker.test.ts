import { afterEach, describe, expect, it, vi } from "vitest";
import { ReadTracker } from "../src/components/read-tracker";

const hooks = vi.hoisted(() => ({ effect: null as null | (() => () => void), send: vi.fn() }));
vi.mock("react", () => ({ useEffect: (effect: () => () => void) => (hooks.effect = effect) }));
vi.mock("../src/lib/metrics-client", () => ({ sendMetric: hooks.send }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  hooks.send.mockReset();
});

describe("engaged reading", () => {
  it("counts a tall viewer after 20 visible seconds, excludes hidden time, and stops ticking", () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "performance"] });
    let observe!: (visible: boolean) => void;
    let threshold: unknown;
    const doc = Object.assign(new EventTarget(), {
      visibilityState: "visible",
      querySelector: () => ({}),
    });
    vi.stubGlobal("document", doc);
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(
          callback: (entries: { isIntersecting: boolean }[]) => void,
          options: IntersectionObserverInit,
        ) {
          observe = (visible) => callback([{ isIntersecting: visible }]);
          threshold = options.threshold;
        }
        observe() {}
        disconnect() {}
      },
    );
    ReadTracker({ slug: "report" });
    const cleanup = hooks.effect!();
    expect(threshold).toBe(0);
    observe(true);
    vi.advanceTimersByTime(10_000);
    doc.visibilityState = "hidden";
    doc.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(60_000);
    expect(hooks.send).not.toHaveBeenCalled();
    doc.visibilityState = "visible";
    doc.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(10_000);
    expect(hooks.send).toHaveBeenCalledExactlyOnceWith("report", "read");
    expect(vi.getTimerCount()).toBe(0);
    cleanup();
  });
});
